# 测试用例：组合总和（C-20260703-058，决策树剪枝）

> Status: verified
> Stable ID: C-20260703-058
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（combsum.module）/ L4（DecisionTreeView 扩展 + Combsum 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-DTREEVIEW-05`、`TC-COMBSUM-MOD-*`、`TC-VIEW-COMBSUM-*`、`TC-E2E-COMBSUM-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `DecisionTreeView` 剪枝扩展（`src/components/DecisionTreeView.spec.ts`，追加）

| 用例 ID             | 场景     | 期望                                                         |
| ------------------- | -------- | ------------------------------------------------------------ |
| TC-VIZ-DTREEVIEW-05 | 剪枝高亮 | prunedIds=[2] → 对应节点带 `.pruned`（恰 1 个）；不设时 0 个 |

## L3 —— `combsum.module`（`src/algorithms/combsum.module.spec.ts`）

固定候选 `[1,2,3,4]`、目标 `5`；oracle `combSumAll`。

| 用例 ID           | 场景                | 期望                                                                                         |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------- |
| TC-COMBSUM-MOD-01 | 末步 done + 全解    | 末步 `done`；`solutionIds` = 全部解叶（2 个）                                                |
| TC-COMBSUM-MOD-02 | 步合法 + 带决策树轨 | 每步 `point ∈ {start,include,prune,record,backtrack,done}` 且带 `decisionTree`、`array===[]` |
| TC-COMBSUM-MOD-03 | 树规模              | 决策树 14 节点；解 2、剪枝 5                                                                 |
| TC-COMBSUM-MOD-04 | record = oracle     | `record` 步组合按序 = `combSumAll()` = `[[1,4],[2,3]]`，且每个和 = 5                         |
| TC-COMBSUM-MOD-05 | start 根空组合      | 首步 `start`，activeId = 根、`pathIds=[根]`、`solutionIds`/`prunedIds` 空                    |
| TC-COMBSUM-MOD-06 | 存在剪枝            | `#prune >= 1`；末步 `prunedIds` 覆盖全部剪枝节点（5 个）                                     |
| TC-COMBSUM-MOD-07 | 剪枝节点和 > 目标   | 每个 `prunedIds` 节点其 `chosen` 之和 > 5                                                    |
| TC-COMBSUM-MOD-08 | 解节点和 = 目标     | 每个 `solutionIds` 节点其 `chosen` 之和 = 5                                                  |
| TC-COMBSUM-MOD-09 | pathIds 连贯        | 每步 `pathIds` 从根到 active 连续（相邻为父子边）                                            |
| TC-COMBSUM-MOD-10 | prune 不展开        | 每个剪枝节点在决策树中无出边（不展开子树）                                                   |
| TC-COMBSUM-MOD-11 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                |
| TC-COMBSUM-MOD-12 | module 元信息       | `title` 含「组合」；`initialInput()` = `[]`                                                  |

## L4 —— `Combsum` 视图（`src/views/Article/Algorithm/Combsum.spec.ts`，新增）

| 用例 ID            | 场景          | 期望                                                    |
| ------------------ | ------------- | ------------------------------------------------------- |
| TC-VIEW-COMBSUM-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                      |
| TC-VIEW-COMBSUM-02 | 决策树轨      | h1 含「组合」；渲染 `DecisionTreeView`；无 `.bars-view` |
| TC-VIEW-COMBSUM-03 | 全模板同屏    | Article 含「组合」+ DecisionTreeView 同屏               |

## L4 —— TC-HOOK（回溯与搜索第 4 项）

| 用例 ID      | 改动                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| TC-HOOK-01-1 | Home：`data` 5 分类，第 5「回溯与搜索」children url = `['n-queens','subsets','permutations','combination-sum']` |
| TC-HOOK-02-1 | Menu：`data` 5 分类，第 5「回溯与搜索」children url = `['n-queens','subsets','permutations','combination-sum']` |

## L5 —— 组合总和页 e2e（`e2e/combination-sum.e2e.ts`，新增）

| 用例 ID           | 场景          | 操作                                            | 期望                                                                                                                                                                      |
| ----------------- | ------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-COMBSUM-01 | 全模板 + 互动 | 访问 `/docs/combination-sum`；`.scrub` 拖到末步 | 正文 `.article h1` 含「组合」；`.dtree-view` 可见；≥6 `.dtree-node`；无 `.bars-view`；拖末步 ≥1 `.dtree-node.pruned`（剪枝支）+ 2 `.dtree-node.solution`；真机 Shiki 着色 |

## 回归

- 既有 10 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board/DecisionTree）+ 6 图算法 + 2 DP + N 皇后 + 子集 + 全排列 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **DecisionTreeView 仅 additive 扩展 `prunedIds`**：子集/排列不设 → 无 `.pruned`，其 `TC-VIZ-DTREEVIEW-01..04`/`TC-PLAYER-DTREE-*` 不变全绿；AlgorithmPlayer.vue 零改动。
- TC-HOOK 其余不变；仅 -01-1/-02-1 回溯 children 追加 `combination-sum`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 157 文件 1126 passed** / **e2e 50 passed**。
  - 新增 Case 全绿：DecisionTreeView 剪枝 1（TC-VIZ-DTREEVIEW-05）、combsum.module 12（COMBSUM-MOD-01..12，含 record=oracle MOD-04、剪枝节点和>目标 MOD-07、解节点和=目标 MOD-08、prune 不展开 MOD-10）、Combsum 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（回溯 children +combination-sum）。
  - **一次通过**：DecisionTreeView 剪枝 1 + combsum.module 12 首跑即绿（start-index 决策树剪枝与 oracle 一致，解 `[[1,4],[2,3]]`）；无坑。
- 覆盖率：**Stmt 94.49% / Branch 93.6% / Func 94.57% / Line 95.21%**（聚合，超门槛 70/60）。既有轨/页零回归（DecisionTreeView additive 扩展）。
- 真机自检（Playwright 脚本 `/docs/combination-sum`）：首步 14 节点 + 无 `.bars-view` + `1 / 24` + Shiki 127 token + 字幕「空组合，和 0，逐个加数凑目标 5」；首个剪枝步（第 3 步）字幕「选 3 → {1,2,3} 和=6 > 目标 5：剪枝，不再展开这一支」；末步 `24` + **5 剪枝支 + 2 解** + 字幕「共找到 2 个和为 5 的组合」+ 解 `["{1,4}","{2,3}"]` + 剪枝 `["{1,2,3}","{1,2,4}","{1,3,4}","{2,4}","{3,4}"]`。
- 结论：**通过**。三件套齐全；**首次演示回溯剪枝**（决策树轨第 3 消费者，additive 扩展 prunedIds）；剪枝红显、解绿显、回溯「试探-剪枝-回溯」三要素凑齐；子集/排列零回归。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。17 Case 全绿（DTreeView 剪枝 1 + module 12 + 视图 3 + e2e 1，改 TC-HOOK 2）；真机 24 步、5 剪枝支红、2 解绿；DecisionTreeView additive 扩展 prunedIds。
