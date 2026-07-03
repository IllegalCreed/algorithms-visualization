# 测试用例：全排列（C-20260703-057，复用决策树轨）

> Status: verified
> Stable ID: C-20260703-057
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（permute.module）/ L4（Permute 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-PERMUTE-MOD-*`、`TC-VIEW-PERMUTE-*`、`TC-E2E-PERMUTE-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`
> 复用：DecisionTreeView 零改动（其 `TC-VIZ-DTREEVIEW-*` / `TC-PLAYER-DTREE-*` 已在 C-056 覆盖，本变更不新增 viz-engine 用例）

## L3 —— `permute.module`（`src/algorithms/permute.module.spec.ts`）

固定元素 `[1,2,3]`；oracle `permutationsAll`。

| 用例 ID           | 场景                | 期望                                                                                               |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| TC-PERMUTE-MOD-01 | 末步 done + 全解    | 末步 `done`；`solutionIds` 覆盖全部 6 叶                                                           |
| TC-PERMUTE-MOD-02 | 步合法 + 带决策树轨 | 每步 `point ∈ {start,choose,record,backtrack,done}` 且带 `decisionTree`、`array===[]`              |
| TC-PERMUTE-MOD-03 | 树规模              | 决策树 16 节点、15 边；叶（无出边）= 6                                                             |
| TC-PERMUTE-MOD-04 | record = oracle     | 6 个 `record` 步按序对应 `permutationsAll()` = `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]` |
| TC-PERMUTE-MOD-05 | start 根空排列      | 首步 `start`，activeId = 根 id、`pathIds=[根]`、`solutionIds` 空                                   |
| TC-PERMUTE-MOD-06 | 恰 6 record         | `#record == 6`（= 3!）                                                                             |
| TC-PERMUTE-MOD-07 | 存在回溯            | `#backtrack >= 1`；每个 backtrack 步 active 为内部节点（有出边）                                   |
| TC-PERMUTE-MOD-08 | pathIds 连贯        | 每步 `pathIds` 从根到 active 连续（相邻为父子边）                                                  |
| TC-PERMUTE-MOD-09 | 解为合法排列        | 每个叶 `chosen` 是 `[1,2,3]` 的一个排列（长度 3、元素互异、值域正确）                              |
| TC-PERMUTE-MOD-10 | 首个 choose         | 首个 `choose` 步 active = 根首子（选 1）；决策边 label 含「选 1」                                  |
| TC-PERMUTE-MOD-11 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                      |
| TC-PERMUTE-MOD-12 | module 元信息       | `title` 含「排列」；`initialInput()` = `[]`                                                        |

## L4 —— `Permute` 视图（`src/views/Article/Algorithm/Permute.spec.ts`，新增）

| 用例 ID            | 场景          | 期望                                                    |
| ------------------ | ------------- | ------------------------------------------------------- |
| TC-VIEW-PERMUTE-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                      |
| TC-VIEW-PERMUTE-02 | 决策树轨      | h1 含「排列」；渲染 `DecisionTreeView`；无 `.bars-view` |
| TC-VIEW-PERMUTE-03 | 全模板同屏    | Article 含「排列」+ DecisionTreeView 同屏               |

## L4 —— TC-HOOK（回溯与搜索第 3 项）

| 用例 ID      | 改动                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data` 5 分类，第 5「回溯与搜索」children url = `['n-queens','subsets','permutations']` |
| TC-HOOK-02-1 | Menu：`data` 5 分类，第 5「回溯与搜索」children url = `['n-queens','subsets','permutations']` |

## L5 —— 全排列页 e2e（`e2e/permutations.e2e.ts`，新增）

| 用例 ID           | 场景          | 操作                                         | 期望                                                                                                                                               |
| ----------------- | ------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-PERMUTE-01 | 全模板 + 互动 | 访问 `/docs/permutations`；`.scrub` 拖到末步 | 正文 `.article h1` 含「排列」；`.dtree-view` 可见；≥6 `.dtree-node`；无 `.bars-view`；拖末步 6 `.dtree-node.solution`（6 个排列）；真机 Shiki 着色 |

## 回归

- 既有 10 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/DecisionTree）+ 6 图算法 + 2 DP + N 皇后 + 子集 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **DecisionTreeView.vue / AlgorithmPlayer.vue 零改动**（本变更纯复用决策树轨）。
- TC-HOOK 其余（数据结构 15、排序 15、图算法 6、动态规划 2、回溯 n-queens/subsets）不变；仅 -01-1/-02-1 回溯 children 追加 `permutations`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 155 文件 1110 passed** / **e2e 49 passed**。
  - 新增 Case 全绿：permute.module 12（PERMUTE-MOD-01..12，含 record=oracle MOD-04、解为合法排列 MOD-09、pathIds 连贯 MOD-08）、Permute 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（回溯 children +permutations）。
  - **一次通过**：permute.module 12 首跑即绿（多叉排列树 DFS 与 oracle 一致，6 排列 DFS 序 `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`）；无坑。
  - **DecisionTreeView 零改动复用**：本变更不新增 viz-engine 用例，其 `TC-VIZ-DTREEVIEW-*`/`TC-PLAYER-DTREE-*` 已在 C-056 覆盖并全绿。
- 覆盖率：**Stmt 94.38% / Branch 93.39% / Func 94.48% / Line 95.12%**（聚合，超门槛 70/60）。DecisionTreeView / AlgorithmPlayer 零改动。
- 真机自检（Playwright 脚本 `/docs/permutations`）：首步 16 节点 + 15 边 + 无 `.bars-view` + `1 / 28` + Shiki 132 token + 字幕「空排列：每个位置从剩余未用元素里挑一个」；步 2 = 选 1 后选 2 → 字幕「选 2 → 当前排列 [1,2]，剩余 {3}」+ active 1 + **on-path 3**（根→选1→选2）；末步 `28` + **6 排列叶** + 字幕「全部 6（= 3!）个排列枚举完毕」+ 排列叶 `["[1,2,3]","[1,3,2]","[2,1,3]","[2,3,1]","[3,1,2]","[3,2,1]"]`。
- 结论：**通过**。三件套齐全；**决策树轨复用验证成功**（第 2 消费者，零改动）；多叉决策树 DFS 前进-到底-回退清晰；与子集（二叉）形成决策树两形态对照。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。16 Case 全绿（module 12 + 视图 3 + e2e 1，改 TC-HOOK 2）；真机 28 步多叉排列树 DFS、6 排列叶序无误；DecisionTreeView 零改动复用。
