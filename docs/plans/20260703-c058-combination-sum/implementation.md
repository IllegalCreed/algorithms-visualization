# 实现记录：组合总和（C-20260703-058，决策树剪枝）

> Status: verified
> Stable ID: C-20260703-058
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 DecisionTreeView 扩展 prunedIds**：types.ts +`DecisionTreeTrack.prunedIds?`、+`CombSumExecPoint`；先 DecisionTreeView.spec 追加 TC-VIZ-DTREEVIEW-05 跑红 → DecisionTreeView.vue 加 `.pruned` 渲染跑绿。
2. **T1 module + oracle + sources**（L3）：先 combsum.module.spec（TC-COMBSUM-MOD-01..12）跑红 → combsum.{ts,sources.ts,module.ts}（start-index 决策树 + 剪枝 DFS 重走）跑绿。
3. **T2 新页 + 接线**：Combsum.vue（Article + AlgorithmPlayer）；路由 /docs/combination-sum；菜单 + 首页「回溯与搜索」第 4 项（新 combsum.svg）；改 TC-HOOK-01-1/02-1（回溯 children +combination-sum）；Combsum.spec + combination-sum.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 回溯第 4 页）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 扩展 DecisionTreeView（additive）**：types.ts +`DecisionTreeTrack.prunedIds?` + `CombSumExecPoint`；`DecisionTreeView.vue` 加 `isPruned` + 节点 `.pruned`（红填充/描边）+ 指向剪枝节点的边 `.pruned`（红虚线 `stroke-dasharray`）。子集/排列不设 `prunedIds` → 无 `.pruned`，既有 `TC-VIZ-DTREEVIEW-01..04` 全绿；新增 TC-VIZ-DTREEVIEW-05。**AlgorithmPlayer.vue 零改动**（decisionTree v-if 既有）。
- **T1 module + oracle + sources**：`combsum.ts`（候选 `[1,2,3,4]` 目标 `5` + `buildCombSumTree` start-index 前序建组合决策树〈加数超目标即 `pruned`、= 目标即 `solution`，二者不再展开〉并算坐标 + `combSumAll` oracle + `combLabel`）+ `combsum.sources.ts`（4 语言组合总和剪枝回溯〈`sum+c>target` continue〉+ lineMap）+ `combsum.module.ts`（与建树同构 DFS 重走：start/include/**prune**/record/backtrack/done）。**24 步**（start 1 + include 8 + prune 5 + record 2 + backtrack 7 + done 1）。
- **T2 新页 + 接线**：Combsum.vue（Article 正文：凑目标和、剪枝是回溯高效关键、超目标砍枝、回溯三要素总结 + 与 N 皇后/子集/排列对照 + AlgorithmPlayer）；路由 `/docs/combination-sum`；菜单 + 首页「回溯与搜索」第 4 项（新 `combsum.svg`：决策树 + 剪枝支 ✗ 图标）；改 TC-HOOK-01-1/02-1（回溯 children → `['n-queens','subsets','permutations','combination-sum']`）。

### 坑点

- 无坑。combsum.module 12 首跑即绿。start-index 建树把 pruned（sum>目标）/solution（sum=目标）节点建出但不展开，`prunedIds`/`solutionIds` 在 DFS 中累积；剪枝节点在 trackEdges 中无 `from`（无子），满足 MOD-10。
- **决策树轨第 3 消费者·从复用升级为小扩展**：全排列是「零改动复用」，组合总和按新需求 additive 扩展 `prunedIds`（如 MatrixView 曾为 DP 加 emptyText/rowLabels）。播放器可插拔轨仍 10 条；子集（选/不选二叉）+ 排列（挑一个多叉）+ 组合总和（加数多叉 + 剪枝）三题共用 DecisionTreeView。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：157 文件 **1126 passed**（+16：DecisionTreeView 剪枝 1 + combsum.module 12 + Combsum 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.49% / Branch 93.6% / Func 94.57% / Line 95.21%**。既有轨/页零回归（除 DecisionTreeView additive 扩展）。
- **e2e**：Playwright **50 passed**（+1 TC-E2E-COMBSUM-01）。
- **真机自检**（Playwright 脚本，`/docs/combination-sum`）：
  - 首步——14 节点、无 `.bars-view`、counter `1 / 24`、Shiki **127 token**、字幕「空组合，和 0，逐个加数凑目标 5」。
  - 首个剪枝步（第 3 步）——字幕「选 3 → {1,2,3} 和=6 > 目标 5：剪枝，不再展开这一支」。
  - 末步——counter `24`、**5 剪枝支 + 2 解**、字幕「共找到 2 个和为 5 的组合」、解 `["{1,4}","{2,3}"]`、剪枝 `["{1,2,3}","{1,2,4}","{1,3,4}","{2,4}","{3,4}"]`。
- **零回归**：既有 10 轨 + 6 图算法 + 2 DP + N 皇后 + 子集 + 全排列 + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 扩展 DecisionTreeView（+prunedIds/`.pruned` 剪枝支 + TC-VIZ-DTREEVIEW-05）+ T1 combsum.module（start-index 决策树剪枝 24 步）+ T2 新页 Combsum.vue + 「回溯与搜索」第 4 项 + 路由/菜单/首页接线 + TC-HOOK（回溯 children +combination-sum）。**决策树轨第 3 消费者·首次演示剪枝·回溯「试探-剪枝-回溯」三要素凑齐。**门禁全绿（单测 1126 / e2e 50 / 覆盖率 94.49%）；真机 24 步、5 剪枝支红、2 解绿，首个剪枝 {1,2,3}=6>5。**M6 回溯与搜索第 4 页达成。**
