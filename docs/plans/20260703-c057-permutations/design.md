# 设计：全排列（C-20260703-057，复用决策树轨）

> Status: verified
> Stable ID: C-20260703-057
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

**复用** [[C-20260703-056]] 新建的 **DecisionTreeView 决策树轨**（零改动），只新增一个「细粒度重走」module + 页面 + 接线。这是决策树原语的第 2 个消费者（子集 = 第 1 个），验证其对回溯家族的通用性。

## 复用点：DecisionTreeView（零改动）

`DecisionTreeTrack{ nodes, edges, activeId?, pathIds?, visitedIds?, solutionIds? }` 已是通用决策树原语（定位节点 + 决策边 + 4 类高亮）。全排列的决策树是**多叉树**（根 3 子 → 2 → 1），DecisionTreeView 按 `nodes`/`edges` 泛化渲染，无需任何改动即可承载。

唯一 types.ts 改动：新增执行点类型

```ts
export type PermuteExecPoint =
  | 'start' // 位于根：空排列，全部元素可选
  | 'choose' // 沿「选 k」边下降：从剩余未用元素挑一个放到下一位
  | 'record' // 到达叶（元素全用完）→ 记录一个排列
  | 'backtrack' // 一个子树探索完，回退到父节点挑下一个剩余元素
  | 'done'; // 全部 n! 个排列枚举完毕
```

无新 `Step.xxx?` 字段（复用 `decisionTree?`）、无新 View、AlgorithmPlayer 零改动。

## 算法：全排列（`[1,2,3]`）

### 决策树与遍历

每个位置**从剩余未用元素挑一个**，构成一棵**多叉决策树**：根（深 0，3 个可选）→ 每节点分支数 = 剩余元素数，逐层收窄 3→2→1。根 1 + 深 1 有 3 + 深 2 有 6 + 深 3（叶）有 6 = 16 节点。每个叶子（3 元素全用完）是一个排列，6 叶 = 3! = 6 个排列。

DFS（剩余升序优先）叶子序 → 6 个排列：`[1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]`。

### 固定布局（`src/algorithms/permute.ts`）

`buildPermuteTree()` 递归（前序，每层按剩余元素升序建子）建全树并算坐标（同 subsets 的布局法）：

- **叶子**（前序天然左→右）横向均分 640 宽；**内部**节点 x = 其各子中点（自底向上）。
- y = `34 + depth * 74`。
- 每节点记 `chosen`（已放前缀）、`parent`、`edgeLabel`（选 k）、`leaf`（depth===n）。

`permutationsAll()` oracle：返回 DFS 序 6 个排列，供 module 断言。

### 细粒度重走（`src/algorithms/permute.module.ts`）

`buildPermuteSteps()` 复跑与 `buildPermuteTree` 同构的 DFS，emit 决策树轨胖步骤：

1. `start`：根，`pathIds=[root]`，字幕「空排列，每个位置从剩余元素里挑一个」。
2. 下降到子节点：`choose`（「选 k」），active=该子、path=根→该子、visited += 该子；字幕「选 k → 当前排列 […]，剩余 {…}」。
3. 叶（元素用完）：`record`，`solutionIds += 叶`，字幕「记录第 t 个排列 […]」。
4. 一个节点的某子树走完、还有下一个剩余元素可试 → `backtrack` 回到该节点，字幕「回溯，撤销上一个选择，挑下一个剩余元素」；随后 `choose` 进下一子树。
5. 全遍历完 → `done`，字幕「n! = 6 个排列枚举完毕」；`solutionIds` = 全 6 叶。

步数 ≈ 28（start 1 + choose 15 + record 6 + backtrack 5 + done 1）。backtrack 数 = Σ内部节点(子数−1) = 根(3−1)+深1 三节点各(2−1) = 2+3 = 5。

`vars`：`元素 = 1 2 3`、`当前排列 = […]`、`剩余 = {…}`、`已收集 = t / 6`。

### 四语言源码（`src/algorithms/permute.sources.ts`）

ts/python/go/rust 各一段经典「used 标记 + 挑未用」回溯（`backtrack()`：`cur.length==n` 收集，否则遍历 `used[i]` 为假的元素：置位 → push → 递归 → pop → 复位）。`lineMap` 映射 `start/choose/record/backtrack/done` 到各语言行号。

## 页面与接线

- `Permute.vue`：Article 正文（全排列/排列数 n!、从剩余挑一个的多叉决策树、与子集二叉对照、回溯剪枝已用元素、应用）+ `<AlgorithmPlayer :module="permuteModule"/>`。`array:[]` → BarsView 隐藏。
- 路由 `/docs/permutations` name=`permutations` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「回溯与搜索」+「全排列」（第 3 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `permute.svg`（多叉决策树/排列图标）。
- 改 `TC-HOOK-01-1/02-1`：`data[4].children` → `['n-queens','subsets','permutations']`。

## 关键决策

1. **复用 DecisionTreeView 而非新轨**：决策树轨在子集页已建为通用原语，全排列的多叉树同属决策树语义，零改动复用——本变更的核心价值即验证复用力。
2. **多叉「挑一个」形式**（对照子集二叉「选/不选」）：既贴合排列的自然决策（每位挑一个剩余），又与子集形成决策树两形态对照，教学互补。
3. **固定 `[1,2,3]`**：16 节点、6 叶在 640×300 内清晰；步数 ~28 与既有回溯页同量级。

## 影响面

- 改：`types.ts`（+PermuteExecPoint，**无新轨/新字段**）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`permute.ts`、`permute.sources.ts`、`permute.module.ts`(+spec)、`Permute.vue`(+spec)、`e2e/permutations.e2e.ts`、`src/assets/permute.svg`。
- **DecisionTreeView.vue / AlgorithmPlayer.vue 零改动**；既有 10 轨 + 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。复用 DecisionTreeView（第 2 消费者）+ 全排列页设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（DecisionTreeView 零改动承载多叉排列树、permute.module DFS 28 步、`array:[]` 隐 BarsView）；真机首步 16 节点/末步 6 排列叶验证。
