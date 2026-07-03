# 设计：组合总和（C-20260703-058，决策树剪枝）

> Status: verified
> Stable ID: C-20260703-058
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

**复用并小幅扩展** [[C-20260703-056]] 新建的 **DecisionTreeView 决策树轨**：加一个 `prunedIds`（剪枝节点集）+ View 的 `.pruned` 样式，即可表达「剪枝支」。这是决策树原语的第 3 个消费者（子集/排列后），从「零改动复用」升级为「按新需求小扩展」（如 MatrixView 曾为 DP 加 `emptyText`/`rowLabels`）。既有轨/页零回归。

## 轨扩展：DecisionTreeView + prunedIds（additive）

```ts
// DecisionTreeTrack 加一字段
prunedIds?: number[]; // 剪枝节点（红/虚线 ✗）——子集/排列不设 → 无 .pruned，零回归

// 新执行点
export type CombSumExecPoint =
  | 'start'      // 根：空组合，和 0
  | 'include'    // 加一个数（和 ≤ 目标），下降
  | 'prune'      // 加一个数会使和 > 目标 → 剪枝，标红、不展开
  | 'record'     // 和 = 目标 → 记录一个组合
  | 'backtrack'  // 一支探索完，回退换下一个数
  | 'done';      // 全部探索完
```

DecisionTreeView.vue additive 改动：`isPruned(id)=prunedIds.includes(id)`；节点加 `.pruned`（红填充/描边），指向剪枝节点的边加 `.pruned`（红虚线）。优先级 pruned 与 solution 互斥（一个节点非解即可能剪枝）。既有 `.active/.on-path/.visited/.solution` 不变。

## 算法：组合总和（候选 `[1,2,3,4]`，目标 `5`，每数最多一次）

### 决策树与剪枝

采用 **start-index** 形式：每个节点是一个组合，其子 = 「在 start 及之后再加一个候选」。加入某数若使**和 > 目标**则该子**剪枝**（红叉，不展开）；若**和 = 目标**则该节点是**解**（绿，不再加）；否则继续展开。

候选 `[1,2,3,4]` 目标 `5` → **14 节点**：根 + `{1}{2}{3}{4}` + `{1,2}{1,3}{1,4}{2,3}{2,4}{3,4}` + `{1,2,3}{1,2,4}{1,3,4}`。其中 **2 解**：`{1,4}`(1+4=5)、`{2,3}`(2+3=5)；**5 剪枝支**：`{1,2,3}=6`、`{1,2,4}=7`、`{1,3,4}=8`、`{2,4}=6`、`{3,4}=7`（均 > 5）；`{4}=4` 为无更多可选的死路。

DFS（候选升序）解序 → `[[1,4],[2,3]]`。

### 固定布局（`src/algorithms/combsum.ts`）

`buildCombSumTree()` 递归（前序）建全树并算坐标（同 subsets/permute 布局法：叶子横向均分、内部取子中点、y 按深度）。每节点记 `chosen`、`sum`、`startIdx`、`pruned`（sum>目标）、`solution`（sum=目标）、`parent`、`edgeLabel`（选 k）。建树时 pruned/solution 节点不再展开。

`combSumAll()` oracle：返回 DFS 序解 `[[1,4],[2,3]]`，供 module 断言。

### 细粒度重走（`src/algorithms/combsum.module.ts`）

`buildCombSumSteps()` 复跑与建树同构的 DFS，emit 决策树轨胖步骤：

1. `start`：根，字幕「空组合，和 0，逐个加数凑目标 5」。
2. 下降到子：和 ≤ 目标 → `include`（「选 k」，字幕含「和=X」；死路时注明「无更多数可选且 ≠ 5」）；和 > 目标 → `prune`（该节点入 `prunedIds`，字幕「选 k → 和=X > 5：剪枝」，不展开）。
3. 和 = 目标 → `record`（`solutionIds += 节点`，字幕「和 = 5 → 记录组合 {…}」）。
4. 一支走完、还有下一个候选 → `backtrack` 回到父，字幕「回溯，换下一个数」。
5. 全遍历完 → `done`，字幕「共 N 个组合和为 5」。

步数 ≈ 24（start 1 + include 8 + prune 5 + record 2 + backtrack 7 + done 1）。`vars`：`候选=1 2 3 4`、`目标=5`、`当前组合={…}`、`当前和=X`、`已找到=t`。

### 四语言源码（`src/algorithms/combsum.sources.ts`）

ts/python/go/rust 各一段经典组合总和回溯（`backtrack(start, sum)`：`sum==target` 收集；`for i in start..n`：`sum+c[i]>target` 剪枝 `continue`/`break`，否则 push→递归(i+1)→pop）。`lineMap` 映射 `start/include/prune/record/backtrack/done`。

## 页面与接线

- `Combsum.vue`：Article 正文（组合总和/凑目标和、决策树 + **剪枝**是回溯高效关键、和 > 目标即砍枝、与子集/排列并列的三要素总结、应用）+ `<AlgorithmPlayer :module="combsumModule"/>`。`array:[]` → BarsView 隐藏。
- 路由 `/docs/combination-sum` name=`combination-sum` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「回溯与搜索」+「组合总和」（第 4 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `combsum.svg`（决策树 + 剪刀/红叉剪枝图标）。
- 改 `TC-HOOK-01-1/02-1`：`data[4].children` → `['n-queens','subsets','permutations','combination-sum']`。

## 关键决策

1. **扩展 prunedIds 而非新轨**：剪枝是决策树的通用概念，加一个 `prunedIds` + `.pruned` 样式即覆盖，未来带剪枝的回溯题（组合、N 皇后剪枝版）皆可复用；DecisionTreeView additive 扩展，子集/排列零回归。
2. **start-index 多叉形式**（每节点一个组合）：剪枝表现为「某条加数支被砍」，最直观；每个节点是真实组合，配合「当前和」讲清剪枝判据。
3. **候选 `[1,2,3,4]` 目标 `5`**：14 节点、2 解、5 剪枝支——剪枝多到足以说明问题，规模又与既有回溯页同量级。

## 影响面

- 改：`types.ts`（+`DecisionTreeTrack.prunedIds?`、+`CombSumExecPoint`）、`DecisionTreeView.vue`（+`.pruned` 渲染）、`DecisionTreeView.spec.ts`（+TC-VIZ-DTREEVIEW-05）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`combsum.ts`、`combsum.sources.ts`、`combsum.module.ts`(+spec)、`Combsum.vue`(+spec)、`e2e/combination-sum.e2e.ts`、`src/assets/combsum.svg`。
- AlgorithmPlayer.vue 零改动；既有 10 轨（除 DecisionTreeView additive 扩展）+ 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。扩展 DecisionTreeView（prunedIds）+ 组合总和页设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（DecisionTreeView +prunedIds/`.pruned` 红虚线剪枝支、combsum.module start-index 剪枝 DFS 24 步、`array:[]` 隐 BarsView）；真机首步 14 节点、首个剪枝 {1,2,3}=6>5、末步 5 剪枝支 + 2 解验证。
