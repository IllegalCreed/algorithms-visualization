# 设计：子集生成（C-20260703-056，决策树轨首发）

> Status: verified
> Stable ID: C-20260703-056
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

沿用既有 **AlgorithmPlayer 可插拔轨**范式（[[C-20260703-055]] N 皇后已证）：新增算法 = 新 `Step.xxx?` 字段 + 新 `XxxView.vue` + AlgorithmPlayer 加一行 `v-if` + 一个「细粒度重走」module。本页新建第 10 条 **DecisionTreeView 决策树轨**，既有 9 轨零改动。

## 新轨：DecisionTreeView（第 10 轨，回溯家族通用决策树原语）

### 类型（`src/components/player/types.ts`，纯加法）

```ts
export interface DecisionTreeTrack {
  nodes: { id: number; label: string; x: number; y: number }[]; // 固定布局决策树；label 仅叶子标最终解、内部为空
  edges: { from: number; to: number; label?: string }[];        // 父→子；label = 决策（「选 k」/「跳过 k」）
  activeId?: number | null;    // 当前访问节点（琥珀环）
  pathIds?: number[];          // 当前递归栈 root→current（路径高亮）
  visitedIds?: number[];       // 已进入过的节点（淡实色）
  solutionIds?: number[];      // 已到达并记录的解叶（绿）
}

export type SubsetsExecPoint =
  | 'start'      // 位于根：空集，准备对元素 0 决策
  | 'include'    // 沿「选 k」边下降到 include 子节点
  | 'exclude'    // 沿「跳过 k」边下降到 exclude 子节点
  | 'record'     // 到达叶（决策完所有元素）→ 记录一个子集
  | 'backtrack'  // 一个子树探索完，回退到父节点换另一分支
  | 'done';      // 全部 2^n 子集枚举完毕

// Step 加一字段
decisionTree?: DecisionTreeTrack; // 纯加法：回溯的决策树轨；其它算法不设 → DecisionTreeView 不渲染
```

### 组件（`src/components/DecisionTreeView.vue`）

对齐 GraphView 的 SVG 定位节点 + 边范式（viewBox `0 0 640 300`）：

- **边**：`<line>` 从 `from`→`to`，中点渲染决策标签 `label`（「选 1」「跳过 2」）。当 `from`、`to` 同在 `pathIds` 上 → `.on-path`（琥珀加粗）。
- **节点**：`<circle r=15>` + 可选 `label`（叶子最终子集）渲染在圆下方。状态类：
  - `.active`（`activeId`）：琥珀描边环。
  - `.on-path`（在 `pathIds`）：路径填充（浅琥珀）。
  - `.visited`（在 `visitedIds`）：淡实填充。
  - `.solution`（在 `solutionIds`）：绿填充（解叶）。
  - 优先级 solution > active > on-path > visited > 默认。
- 叶子的 `label`（如 `{1,3}`、`∅`）渲染在圆下方小字，8 个叶子即 8 个子集。

## 算法：子集生成（`[1,2,3]`）

### 决策树与遍历

对元素 `[1,2,3]` 逐个决策「选 / 不选」，构成一棵**深度 3 的满二叉决策树**：根（深 0）→ 2 → 4 → 8 叶（深 3）= 15 节点。左枝=选、右枝=不选；每个叶子的「根→叶」路径决定一个子集，8 叶 = 2^3 = 8 个子集（幂集）。

DFS（选优先）访问顺序 → 8 个子集：`{1,2,3} {1,2} {1,3} {1} {2,3} {2} {3} ∅`。

### 固定布局（`src/algorithms/subsets.ts`）

`buildSubsetTree()` 递归（前序）建全树并算坐标：

- **叶子**（前序天然左→右）横向均分 640 宽；**内部**节点 x = 其两子中点（自底向上）。
- y = `34 + depth * 74`。
- 每节点记 `chosen`（已选元素）、`parent`、`edgeLabel`（选/跳过 k）、`pathKey`（'I'/'E' 决策串，用于 module 精确对齐递归）。

`subsetsAll()` oracle：返回 DFS 序 8 个子集，供 module 断言。

### 细粒度重走（`src/algorithms/subsets.module.ts`）

`buildSubsetsSteps()` 复跑与 `buildSubsetTree` 同构的 DFS，emit 决策树轨胖步骤：

1. `start`：根，`pathIds=[root]`，字幕「从空集 ∅ 出发，对每个元素依次决定选/不选」。
2. 下降到子节点：末位决策 'I' → `include`（「选 k」）；'E' → `exclude`（「跳过 k」）。active=该子、path=根→该子、visited += 该子。
3. 叶（decision 到 n）：`record`，`solutionIds += 叶`，字幕「记录第 t 个子集 {…}」。
4. 一个内部节点的**选**子树走完 → `backtrack` 回到该内部节点，字幕「回溯，改试不选 k」；随后 `exclude` 进右子树。
5. 全遍历完 → `done`，字幕「2^3 = 8 个子集枚举完毕」；`solutionIds` = 全 8 叶。

步数 ≈ 31（start 1 + include/exclude 14 + record 8 + backtrack 7 + done 1）。

`vars`：`元素 = 1 2 3`、`当前子集 = {…}`、`已收集 = t / 8`。

### 四语言源码（`src/algorithms/subsets.sources.ts`）

ts/python/go/rust 各一段经典「逐元素选/不选」回溯（`backtrack(i, current)`：到 `i==n` 收集，否则 current.push(elems[i])→递归→pop（撤销）→递归不选）。`lineMap` 映射 `start/include/exclude/record/backtrack/done` 到各语言行号。

## 页面与接线

- `Subsets.vue`：Article 正文（子集/幂集、决策树 DFS、选/不选二分、回溯与 2^n、应用）+ `<AlgorithmPlayer :module="subsetsModule"/>`。`array:[]` → BarsView 隐藏。
- 路由 `/docs/subsets` name=`subsets` 懒加载。
- 菜单 `Docs/Menu/hooks.ts`「回溯与搜索」+「子集生成」（第 2 项）；首页 `Home/Main/hooks.ts` 同类 + 新 `subsets.svg`（决策树分叉图标）。
- 改 `TC-HOOK-01-1/02-1`：`data[4].children` → `['n-queens','subsets']`。

## 关键决策

1. **新轨而非复用 TreeView**：既有 `tree?`/TreeView 是堆排序专用（仅 `heapSize`，数组按完全二叉树层序），非通用决策树。决策树语义（任意定位节点 + 决策边 + 4 类高亮）另起 DecisionTreeView，保 TreeView 零改动。
2. **投资可复用原语**：决策树是整个回溯家族（子集/排列/组合/组合总和）的统一心智模型——如 GraphView 服务 6 图算法、MatrixView 服务 3 DP，DecisionTreeView 一次建好、后续多题复用。
3. **选/不选二叉形式**（而非「选下标 ≥ start」增量形式）：决策树最规整（满二叉、2^n 叶一目了然），最贴合教材「子集决策树」画法。
4. **固定 `[1,2,3]`**：15 节点、8 叶在 640×300 内清晰可读；步数 ~31 与 N 皇后同量级，scrub 条不臃肿。

## 影响面

- 改：`types.ts`（+DecisionTreeTrack/Step.decisionTree?/SubsetsExecPoint）、`AlgorithmPlayer.vue`（+import +`<DecisionTreeView v-if>`）、`AlgorithmPlayer.spec.ts`（+2 用例）、`router/index.ts`、`Docs/Menu/hooks.ts`(+spec)、`Home/Main/hooks.ts`(+spec)。
- 增：`DecisionTreeView.vue`(+spec)、`subsets.ts`、`subsets.sources.ts`、`subsets.module.ts`(+spec)、`Subsets.vue`(+spec)、`e2e/subsets.e2e.ts`、`src/assets/subsets.svg`。
- 既有 9 轨 + 全部算法页零改动。

## 变更历史

- 2026-07-03：创建（draft → approved）。第 10 条 DecisionTreeView 决策树轨 + 子集生成页设计。
- 2026-07-03：交付完成，翻 verified。设计如实落地（DecisionTreeView 对齐 GraphView SVG 范式、subsets.module 决策树 DFS 31 步、`array:[]` 隐 BarsView、既有 9 轨零改动）；真机首步 15 节点/末步 8 解叶验证。
