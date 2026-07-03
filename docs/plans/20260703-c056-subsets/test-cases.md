# 测试用例：子集生成（C-20260703-056，决策树轨首发）

> Status: verified
> Stable ID: C-20260703-056
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（subsets.module）/ L4（DecisionTreeView 新轨 + 播放器接轨 + Subsets 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-DTREEVIEW-*`、`TC-PLAYER-DTREE-*`、`TC-SUBSETS-MOD-*`、`TC-VIEW-SUBSETS-*`、`TC-E2E-SUBSETS-01`；**改** `TC-HOOK-01-1`/`TC-HOOK-02-1`

## L4 —— `DecisionTreeView` 新决策树轨（`src/components/DecisionTreeView.spec.ts`）

mock DecisionTreeTrack 渲染断言。

| 用例 ID             | 场景                | 期望                                                |
| ------------------- | ------------------- | --------------------------------------------------- |
| TC-VIZ-DTREEVIEW-01 | 节点与边            | 3 节点 2 边的树 → 3 `.dtree-node`、2 `.dtree-edge`  |
| TC-VIZ-DTREEVIEW-02 | 当前节点高亮        | activeId=1 → 对应节点带 `.active`（恰 1 个）        |
| TC-VIZ-DTREEVIEW-03 | 解叶高亮            | solutionIds=[2] → 对应节点带 `.solution`（恰 1 个） |
| TC-VIZ-DTREEVIEW-04 | 决策边标签 + 叶标签 | 边 label「选 1」渲染；叶 label「{1}」渲染为节点文字 |

## L4 —— 播放器接决策树轨（`src/components/player/AlgorithmPlayer.spec.ts`）

| 用例 ID            | 场景                   | 期望                                              |
| ------------------ | ---------------------- | ------------------------------------------------- |
| TC-PLAYER-DTREE-01 | decisionTree → 渲染    | step 带 decisionTree → 渲染 `DecisionTreeView`    |
| TC-PLAYER-DTREE-02 | 无 decisionTree 不渲染 | 既有排序 step → 不渲染 DecisionTreeView（零回归） |

## L3 —— `subsets.module`（`src/algorithms/subsets.module.spec.ts`）

固定元素 `[1,2,3]`；oracle `subsetsAll`。

| 用例 ID           | 场景                | 期望                                                                                           |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| TC-SUBSETS-MOD-01 | 末步 done + 全解    | 末步 `done`；`solutionIds` 覆盖全部 8 叶                                                       |
| TC-SUBSETS-MOD-02 | 步合法 + 带决策树轨 | 每步 `point ∈ {start,include,exclude,record,backtrack,done}` 且带 `decisionTree`、`array===[]` |
| TC-SUBSETS-MOD-03 | 树规模              | 决策树 15 节点、14 边；叶（无出边）= 8                                                         |
| TC-SUBSETS-MOD-04 | record = oracle     | 8 个 `record` 步按序对应 `subsetsAll()` = `[[1,2,3],[1,2],[1,3],[1],[2,3],[2],[3],[]]`         |
| TC-SUBSETS-MOD-05 | start 根空集        | 首步 `start`，activeId = 根 id、`pathIds=[根]`、`solutionIds` 空                               |
| TC-SUBSETS-MOD-06 | 恰 8 record         | `#record == 8`（= 2^3）                                                                        |
| TC-SUBSETS-MOD-07 | 存在回溯            | `#backtrack >= 1`；每个 backtrack 步 active 为内部节点（有出边）                               |
| TC-SUBSETS-MOD-08 | pathIds 连贯        | 每步 `pathIds` 从根到 active 连续（相邻为父子边）                                              |
| TC-SUBSETS-MOD-09 | solutionIds 单调增  | `solutionIds` 长度随步不减；末步 = 8                                                           |
| TC-SUBSETS-MOD-10 | 首个 include        | 首个 `include` 步 active = 根的「选 1」子；决策边 label 含「选 1」                             |
| TC-SUBSETS-MOD-11 | 四语言 + 行号       | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                                  |
| TC-SUBSETS-MOD-12 | module 元信息       | `title` 含「子集」；`initialInput()` = `[]`                                                    |

## L4 —— `Subsets` 视图（`src/views/Article/Algorithm/Subsets.spec.ts`，新增）

| 用例 ID            | 场景          | 期望                                                    |
| ------------------ | ------------- | ------------------------------------------------------- |
| TC-VIEW-SUBSETS-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                      |
| TC-VIEW-SUBSETS-02 | 决策树轨      | h1 含「子集」；渲染 `DecisionTreeView`；无 `.bars-view` |
| TC-VIEW-SUBSETS-03 | 全模板同屏    | Article 含「子集」+ DecisionTreeView 同屏               |

## L4 —— TC-HOOK（回溯与搜索第 2 项）

| 用例 ID      | 改动                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| TC-HOOK-01-1 | Home：`data` 5 分类，第 5「回溯与搜索」children url = `['n-queens','subsets']` |
| TC-HOOK-02-1 | Menu：`data` 5 分类，第 5「回溯与搜索」children url = `['n-queens','subsets']` |

## L5 —— 子集页 e2e（`e2e/subsets.e2e.ts`，新增）

| 用例 ID           | 场景          | 操作                                    | 期望                                                                                                                                               |
| ----------------- | ------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-SUBSETS-01 | 全模板 + 互动 | 访问 `/docs/subsets`；`.scrub` 拖到末步 | 正文 `.article h1` 含「子集」；`.dtree-view` 可见；≥8 `.dtree-node`；无 `.bars-view`；拖末步 8 `.dtree-node.solution`（8 个解叶）；真机 Shiki 着色 |

## 回归

- 既有 9 轨（Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/Board）+ 6 图算法 + 2 DP + N 皇后 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **既有 9 轨组件零改动**；AlgorithmPlayer 仅 additive 加 `<DecisionTreeView v-if>` + import。
- TC-HOOK 其余（数据结构 15、排序 15、图算法 6、动态规划 2、回溯首项 n-queens）不变；仅 -01-1/-02-1 回溯 children 追加 `subsets`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 153 文件 1095 passed** / **e2e 48 passed**。
  - 新增 Case 全绿：DecisionTreeView 4（VIZ-DTREEVIEW-01..04）、播放器接决策树轨 2（PLAYER-DTREE-01/02）、subsets.module 12（SUBSETS-MOD-01..12，含 record=oracle MOD-04、pathIds 连贯 MOD-08、solutionIds 单调 MOD-09）、Subsets 视图 3、e2e 1；改 TC-HOOK-01-1/02-1（回溯 children +subsets）。
  - **一次通过**：DecisionTreeView 4 + subsets.module 12 均首跑即绿（决策树 DFS 与 oracle 一致，8 子集 DFS 序 `[[1,2,3],[1,2],[1,3],[1],[2,3],[2],[3],[]]`）；无坑。
- 覆盖率：**Stmt 94.28% / Branch 93.2% / Func 94.39% / Line 95.03%**（聚合，超门槛 70/60）。既有 9 轨零改动。
- 真机自检（Playwright 脚本 `/docs/subsets`）：首步 15 节点 + 14 边 + 0 解叶 + 无 `.bars-view` + `1 / 31` + Shiki 100 token + 字幕「从空集 ∅ 出发…」；步 3 = 选 3 到底 → 字幕「选 3 → 当前子集 {1,2,3}」+ active 1 + **on-path 4**（根→选1→选2→选3）；末步 `31` + **8 解叶** + 字幕「全部 2^3 = 8 个子集枚举完毕（幂集）」+ 解叶标签 `["{1,2,3}","{1,2}","{1,3}","{1}","{2,3}","{2}","{3}","∅"]`。
- 结论：**通过**。三件套齐全；回溯家族决策树心智模型可视化；零回归（新建 DecisionTreeView 第 10 轨 additive 可插拔）；决策树 DFS 前进-到底-回退清晰；决策树原语为排列/组合/组合总和铺路。

## 变更历史

- 2026-07-03：创建（draft → approved）。
- 2026-07-03：交付完成，翻 verified。22 Case 全绿（DecisionTreeView 4 + 接轨 2 + module 12 + 视图 3 + e2e 1，改 TC-HOOK 2）；真机 31 步决策树 DFS、8 解叶序无误。
