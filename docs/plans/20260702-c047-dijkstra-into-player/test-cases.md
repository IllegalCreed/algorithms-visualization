# 测试用例：Dijkstra 接入算法播放器（C-20260702-047，M8②-1）

> Status: verified
> Stable ID: C-20260702-047
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（dijkstra.module）/ L4（GraphView 轨 + 播放器接轨 + Dijkstra 页）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-GRAPHVIEW-*`、`TC-PLAYER-GRAPH-*`、`TC-DIJKSTRA-MOD-*`；**改** `TC-VIEW-DIJKSTRA-01/02`、`TC-E2E-DIJKSTRA-01`；**superseded** `TC-VIZ-DIJKSTRAVIZ-*`

## L4 —— `GraphView` 新图轨（`src/components/GraphView.spec.ts`）

mock GraphTrack 渲染断言。

| 用例 ID             | 场景         | 期望                                                                        |
| ------------------- | ------------ | --------------------------------------------------------------------------- |
| TC-VIZ-GRAPHVIEW-01 | 渲染节点与边 | 6 节点 track → 6 `.graph-node`；9 边 → 9 `.graph-edge`；权重文本可见        |
| TC-VIZ-GRAPHVIEW-02 | 节点态       | `doneNodes=[0,2]` → 该 2 节点 `.done`；`activeNode=1` → 第 2 节点 `.active` |
| TC-VIZ-GRAPHVIEW-03 | 边高亮       | `edgeClass={'0-1':'relaxed','0-2':'tree'}` → 对应边带 `.relaxed`/`.tree`    |
| TC-VIZ-GRAPHVIEW-04 | 节点徽标     | `nodeBadge=['0','∞',...]` → 节点旁 `.node-badge` 显示 dist（含 ∞）          |

## L4 —— `AlgorithmPlayer` 接图轨（`AlgorithmPlayer.spec.ts` 追加）

| 用例 ID            | 场景                | 期望                                                                 |
| ------------------ | ------------------- | -------------------------------------------------------------------- |
| TC-PLAYER-GRAPH-01 | 当前步带 graph      | 渲染 `GraphView`                                                     |
| TC-PLAYER-GRAPH-02 | array 空不渲染 Bars | array:[] → 不渲染 `BarsView`；既有排序 array 非空 → 仍渲染（零回归） |

## L3 —— `dijkstra.module`（`src/algorithms/dijkstra.module.spec.ts`）

复用 useDijkstra 固定图（源 A）；oracle `dijkstraTrace`。

| 用例 ID            | 场景             | 期望                                                                                     |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------------- |
| TC-DIJKSTRA-MOD-01 | 末步 dist=oracle | 末步 `done`，`graph.nodeBadge` 数值 = `dijkstraTrace().dist` = `[0,3,1,4,7,9]`           |
| TC-DIJKSTRA-MOD-02 | 步合法 + 带图轨  | 每步 `point ∈ {init,selectMin,settle,relaxEdge,relaxUpdate,relaxSkip,done}` 且带 `graph` |
| TC-DIJKSTRA-MOD-03 | 确定 6 点        | `#selectMin == #settle == 6`                                                             |
| TC-DIJKSTRA-MOD-04 | 松弛守恒         | `#relaxEdge == #relaxUpdate + #relaxSkip`                                                |
| TC-DIJKSTRA-MOD-05 | init 步          | init 步 dist[A]=0、其余 ∞（nodeBadge[0]='0'、[1]='∞'）                                   |
| TC-DIJKSTRA-MOD-06 | 确定顺序         | settle 步的 activeNode 序列 = `[0,2,1,3,4,5]`（A→C→B→D→E→F）                             |
| TC-DIJKSTRA-MOD-07 | 首松弛           | 首个 relaxUpdate 后 B=4（A 出边序 A→B(4) 先于 A→C(1)）；另存在 A→C 松弛后 C=1            |
| TC-DIJKSTRA-MOD-08 | done 最短路树    | done 步 edgeClass 含 tree 边，且恰为最短路树（每非源点一条入树边，共 5）                 |
| TC-DIJKSTRA-MOD-09 | done 步          | done 步 doneNodes 长度 = 6                                                               |
| TC-DIJKSTRA-MOD-10 | 四语言 + 行号    | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                            |
| TC-DIJKSTRA-MOD-11 | module 元信息    | `title` 含「Dijkstra」；`initialInput()` = `[]`                                          |

## L4 —— `Dijkstra` 视图（`src/views/Article/Algorithm/Dijkstra.spec.ts`，**改写**）

| 用例 ID             | 场景          | 期望                                                                                  |
| ------------------- | ------------- | ------------------------------------------------------------------------------------- |
| TC-VIEW-DIJKSTRA-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`（不再含 DijkstraViz）                              |
| TC-VIEW-DIJKSTRA-02 | 图轨 + 6 节点 | h1 含「Dijkstra」；渲染 `GraphView`；6 `.graph-node`；**无 `.bars-view`**（array:[]） |
| TC-VIEW-DIJKSTRA-03 | 全模板同屏    | Article 正文含「最短」+ 图轨 ≥9 `.graph-edge` 同屏（全模板锚点）                      |

## L5 —— Dijkstra 页 e2e（`e2e/dijkstra.e2e.ts`，**改写**）

| 用例 ID            | 场景          | 操作                                     | 期望                                                                                                                                             |
| ------------------ | ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| TC-E2E-DIJKSTRA-01 | 全模板 + 互动 | 访问 `/docs/dijkstra`；`.scrub` 拖到末步 | 正文 `.article h1` 含「Dijkstra」；`.graph-view` 可见；6 `.graph-node`；拖末步 6 节点 `.done`、最短路树 `.graph-edge.tree` 可见；真机 Shiki 着色 |

## superseded（DijkstraViz 删除）

| 用例 ID               | 处理                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| TC-VIZ-DIJKSTRAVIZ-\* | **标 superseded**（DijkstraViz.vue/spec 删除，功能由 GraphView + 播放器承接；三索引移除或标废，双向链接本变更） |

## 回归

- 既有 15 排序 + 6 轨 + 15 结构 + Kruskal + 播放器各轨现有 Case **零改动**全绿（BarsView 加 v-if 不影响排序——array 恒非空）。
- useDijkstra.ts + spec 零改动（保留复用）。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- 执行命令：`pnpm format` + `format:check`、`lint:check`、`type-check`、`test:unit run --coverage`、`pnpm exec playwright test`
- 结果：format:check ✓ / lint:check ✓（0 error）/ type-check ✓ / **单测 134 文件 950 passed** / **e2e 40 passed**。
  - 新增/改写 Case 全绿：GraphView 4（GRAPHVIEW-01..04）、播放器接轨 2（PLAYER-GRAPH-01/02）、dijkstra.module 11（DIJKSTRA-MOD-01..11）、Dijkstra 视图 3（VIEW-DIJKSTRA-01..03）、e2e 1（E2E-DIJKSTRA-01 改写）。
  - **MOD-07 修正**：初稿误设「首个 relaxUpdate=C=1」跑红——A 出边序 A→B(4) 先，实际首更新 B=4，改断言后绿。
- 覆盖率：**Stmt 93.58% / Branch 91.91% / Func 94.2% / Line 94.42%**（聚合，超门槛 70/60）。dijkstra.module.ts 97.01%、GraphView.vue 100%、algorithms 目录 98.06%。
- 真机自检（chrome-devtools `/docs/dijkstra`）：首步 6 点 9 边 + 徽标 [0,∞×5] + `1/32` + 无 `.bars-view` + Shiki 157 token；末步 `32/32` + 徽标 [0,3,1,4,7,9](=oracle) + 6 点 `.done` + 5 `.tree` 边 + 字幕「A→C→B→D→E→F 最短路长 9」。
- 结论：**通过**。三件套（正文 + GraphView 图轨 + 4 语言代码播放器）齐全；零回归；GraphView 通用轨供 C-048 Kruskal 复用。
