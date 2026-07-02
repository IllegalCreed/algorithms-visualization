# 测试用例：Dijkstra 最短路（C-20260629-037）

> Status: verified
> Stable ID: C-20260629-037
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（useDijkstra 纯逻辑）/ L4（DijkstraViz 互动 + Dijkstra 视图）/ L5（Dijkstra 页 e2e）
> 命名空间：`TC-DIJKSTRA-*`、`TC-VIZ-DIJKSTRAVIZ-*`、`TC-VIEW-DIJKSTRA-*`、`TC-E2E-DIJKSTRA-*`；**改** `TC-HOOK-01-1`（Home + Menu 两处）

## L3 —— `useDijkstra` 纯逻辑（`src/components/structures/useDijkstra.spec.ts`）

固定带权有向图：A0 B1 C2 D3 E4 F5；边 A→B4/A→C1/C→B2/C→D5/B→D1/B→E7/D→E3/D→F6/E→F2；源 A。

| 用例 ID        | 场景         | 输入 / 操作   | 期望                                                                           |
| -------------- | ------------ | ------------- | ------------------------------------------------------------------------------ |
| TC-DIJKSTRA-01 | 图规模与标签 | 初始          | `vertices.length===6`、label `[A,B,C,D,E,F]`；`edges.length===9`、`source===0` |
| TC-DIJKSTRA-02 | 出边邻接     | 初始          | adj[0] 两条出边到 1(w4)/2(w1)；adj[4] 一条到 5(w2)；adj[5] 空                  |
| TC-DIJKSTRA-03 | 确定顺序     | `run().order` | `[0,2,1,3,4,5]`（A→C→B→D→E→F）                                                 |
| TC-DIJKSTRA-04 | 最终距离     | `run().dist`  | `[0,3,1,4,7,9]`                                                                |
| TC-DIJKSTRA-05 | 前驱表       | `run().prev`  | `[null,2,0,1,3,4]`                                                             |
| TC-DIJKSTRA-06 | 最短路还原·F | `pathTo(5)`   | `[0,2,1,3,4,5]`                                                                |
| TC-DIJKSTRA-07 | 最短路还原·E | `pathTo(4)`   | `[0,2,1,3,4]`                                                                  |
| TC-DIJKSTRA-08 | steps 步数   | `run().steps` | 长度 `7`（step0 初始 + 6 次确定）                                              |
| TC-DIJKSTRA-09 | 初始步       | `steps[0]`    | `settled===[]`；`dist[0]===0` 且 dist[1..5] 均 `Infinity`                      |
| TC-DIJKSTRA-10 | 确定 C 后    | `steps[2]`    | `justSettled===2`、`settled===[0,2]`、`dist===[0,3,1,6,Infinity,Infinity]`     |
| TC-DIJKSTRA-11 | 松弛更新·D   | `steps[3]`    | `dist[3]===4`（由 steps[2] 的 6 经 B→D 松弛降到 4）                            |
| TC-DIJKSTRA-12 | 终步         | `steps[6]`    | `settled.length===6`、`dist===[0,3,1,4,7,9]`                                   |

## L4 —— `DijkstraViz` 互动（`src/components/structures/DijkstraViz.spec.ts`）

> ⚠️ **本节 8 个 `TC-VIZ-DIJKSTRAVIZ-*` 已于 C-20260702-047（M8②-1）superseded**：`DijkstraViz.vue`/spec 删除，功能由通用 GraphView 图轨 + AlgorithmPlayer 承接（`TC-VIZ-GRAPHVIEW-*` / `TC-PLAYER-GRAPH-*` / `TC-DIJKSTRA-MOD-*`）。下方 `TC-VIEW-DIJKSTRA-01/02` 亦被 C-047 改写（+ 新增 -03）、`TC-E2E-DIJKSTRA-01` 改写。`useDijkstra` 逻辑 + `TC-DIJKSTRA-01..12` 保留复用。详见 `../20260702-c047-dijkstra-into-player/test-cases.md`。

挂载组件断言。helper：`next`（点下一步）、`reset`（点重置）。

| 用例 ID               | 场景          | 操作            | 期望                                                                 |
| --------------------- | ------------- | --------------- | -------------------------------------------------------------------- |
| TC-VIZ-DIJKSTRAVIZ-01 | 初始结构渲染  | mount           | 6 个 `.dvert`、9 条 `.dedge`、距离表 6 格 `.dcell`、下一步/重置 按钮 |
| TC-VIZ-DIJKSTRAVIZ-02 | 初始距离表    | mount           | 距离表含 `0`（A）与 `∞`（其余）；`.dvert.settled` 数量 0             |
| TC-VIZ-DIJKSTRAVIZ-03 | 下一步·确定 A | next ×1         | `.dvert.settled` 数量 1；距离表出现 `4`（B）与 `1`（C）              |
| TC-VIZ-DIJKSTRAVIZ-04 | 松弛更新 B    | next ×2         | 距离表出现 `3`（B 由 4 降到 3）                                      |
| TC-VIZ-DIJKSTRAVIZ-05 | 松弛边点亮    | next ×1         | `.dedge.relaxed` 数量 ≥1                                             |
| TC-VIZ-DIJKSTRAVIZ-06 | 走到底·完成   | next ×6         | `.dvert.settled` 数量 6；距离表出现 `9`（F）；status 含「最短」      |
| TC-VIZ-DIJKSTRAVIZ-07 | 最短路树点亮  | next ×6         | `.dedge.tree` 数量 ≥1（最短路树边）                                  |
| TC-VIZ-DIJKSTRAVIZ-08 | 重置复原      | next ×3 后 重置 | `.dvert.settled` 数量 0；距离表回到含 `∞`                            |

## L4 —— `Dijkstra` 视图（`src/views/Article/Algorithm/Dijkstra.spec.ts`）

| 用例 ID             | 场景         | 期望                                                      |
| ------------------- | ------------ | --------------------------------------------------------- |
| TC-VIEW-DIJKSTRA-01 | 页面骨架渲染 | 含 `Article`；含「Dijkstra」标题文案；含 `Playground`     |
| TC-VIEW-DIJKSTRA-02 | 内嵌互动组件 | 渲染 `DijkstraViz`（存在 `.dijkstra-viz`、6 个 `.dvert`） |

## L5 —— Dijkstra 页 e2e（`e2e/dijkstra.e2e.ts`）

限定容器 `.dijkstra-viz`，避免与正文/菜单文字串扰。

| 用例 ID            | 场景            | 操作                                         | 期望                                                                |
| ------------------ | --------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| TC-E2E-DIJKSTRA-01 | 页面可达 + 互动 | 访问 `/docs/dijkstra`；连点下一步 6 次；重置 | 6 个 `.dvert`；走到底 status 含「最短」与「9」；重置后 settled 清空 |

## 回归（改顶层分类计数）

| 用例 ID（两处） | 文件                                | 改动                                                                                        |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| TC-HOOK-01-1    | `src/views/Home/Main/hooks.spec.ts` | 顶层分类 `data` 长度 2→**3**；`data[2].title==='图算法'`、其 children 含「Dijkstra 最短路」 |
| TC-HOOK-01-1    | `src/views/Docs/Menu/hooks.spec.ts` | 同上（Menu 版顶层 3 分类、第 3 个图算法含 Dijkstra）                                        |

## 其它回归

- 既有 15 结构页 + 8 排序 + 播放器 + 骨架：现有 Case **零改动**全绿（除上面两条 TC-HOOK-01-1）。
- **C-022 `useGraph`/`GraphViz` 零改动**，其 Case 全绿。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位（参考既有 ~90%）。

## 自测报告（2026-06-29）

- 执行命令：`pnpm format` → `pnpm format:check` / `pnpm lint:check` / `pnpm type-check` / `pnpm test:unit run --coverage` / `pnpm exec playwright test`
- 新增用例：L3 12（TC-DIJKSTRA-01..12）+ L4 互动 8（TC-VIZ-DIJKSTRAVIZ-01..08）+ L4 视图 2（TC-VIEW-DIJKSTRA-01/02）+ L5 1（TC-E2E-DIJKSTRA-01）= **22 新**；改 2 处 TC-HOOK-01-1（Home + Menu 顶层分类 2→3）。
- 结果：**全绿**。单测 `792 passed`（115 文件）；e2e `31 passed`（含 TC-E2E-DIJKSTRA-01）。
- 覆盖率（聚合）：Statements 93.11% / Branches 90.45% / Functions 94.05% / Lines 94.04%——均高于门槛（≥70% / ≥60%）。DijkstraViz.vue 100%/85%/100%/100%；useDijkstra.ts 97.91%/80%/100%/100%（pathTo 复跑 run 的分支）；Dijkstra.vue 静态模板挂载渲染。
- 真机自检（Playwright 截图，localhost:5173 `/docs/dijkstra`）：初始 6 点带权有向图 + 9 带箭头边 + 边权 + 距离表 A=0 余 ∞；连点下一步 6 次走到底——6 点全确定（深绿）、最短路树绿色加粗 A→C→B→D→E→F、距离表 [0,3,1,4,7,9]、status「A→F 最短路 = A→C→B→D→E→F，长度 9」、下一步按钮禁用；松弛过程（B 4→3 等）由 L4/e2e 覆盖。
- 零回归：C-022 useGraph/GraphViz 零改动；既有 15 结构 + 8 排序全绿；仅 TC-HOOK-01-1 两处 2→3。
- 结论：达成验收口径，**verified**；**图算法大类开张（M6 阶段一 G1 ✓）**。
