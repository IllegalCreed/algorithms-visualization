# 测试用例：Kruskal 最小生成树（C-20260630-038）

> Status: verified
> Stable ID: C-20260630-038
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（useKruskal 纯逻辑）/ L4（KruskalViz 互动 + Kruskal 视图）/ L5（Kruskal 页 e2e）
> 命名空间：`TC-KRUSKAL-*`、`TC-VIZ-KRUSKALVIZ-*`、`TC-VIEW-KRUSKAL-*`、`TC-E2E-KRUSKAL-*`；**改** `TC-HOOK-01-1`（Home + Menu 两处）

## L3 —— `useKruskal` 纯逻辑（`src/components/structures/useKruskal.spec.ts`）

固定无向带权图：A0 B1 C2 D3 E4 F5；边按权升序 A-C1/B-C2/D-E3/A-B4/B-D5/C-E6/D-F7/E-F8/C-D9。

| 用例 ID       | 场景         | 输入 / 操作         | 期望                                                              |
| ------------- | ------------ | ------------------- | ----------------------------------------------------------------- |
| TC-KRUSKAL-01 | 图规模与标签 | 初始                | `vertices.length===6`、label `[A..F]`；`edges.length===9`         |
| TC-KRUSKAL-02 | 边已按权升序 | 初始                | `edges.map(w)` 等于 `[1,2,3,4,5,6,7,8,9]`；edges[0].id==='AC'     |
| TC-KRUSKAL-03 | MST 边集     | `run().mstEdges`    | `['AC','BC','DE','BD','DF']`（5 条 = V−1）                        |
| TC-KRUSKAL-04 | MST 总权重   | `run().totalWeight` | `18`                                                              |
| TC-KRUSKAL-05 | steps 步数   | `run().steps`       | 长度 `10`（step0 初始 + 9 条边）                                  |
| TC-KRUSKAL-06 | 初始步       | `steps[0]`          | `mst===[]`、`current===null`、`weight===0`                        |
| TC-KRUSKAL-07 | 加入·B-C     | `steps[2]`          | `current.id==='BC'`、`accepted===true`、`mst===['AC','BC']`       |
| TC-KRUSKAL-08 | 成环跳过·A-B | `steps[4]`          | `current.id==='AB'`、`accepted===false`、`mst.length===3`（不变） |
| TC-KRUSKAL-09 | 加入·B-D     | `steps[5]`          | `accepted===true`、`mst` 含 `'BD'`、`weight===11`                 |
| TC-KRUSKAL-10 | 完成步·D-F   | `steps[7]`          | `accepted===true`、`mst.length===5`、`weight===18`                |
| TC-KRUSKAL-11 | 成环边集     | 各 step             | 被跳过（accepted false）的边 = `['AB','CE','EF','CD']`            |
| TC-KRUSKAL-12 | 末步权重稳定 | `steps[9]`          | `mst.length===5`、`weight===18`（后续成环步不改 MST）             |

## L4 —— `KruskalViz` 互动（`src/components/structures/KruskalViz.spec.ts`）

> ⚠️ **本节 8 个 `TC-VIZ-KRUSKALVIZ-*` 已于 C-20260702-048（M8②-2 · 收官 M8）superseded**：`KruskalViz.vue`/spec 删除，功能由 GraphView 无向图轨（零改动复用 C-047）+ AlgorithmPlayer 承接（`TC-KRUSKAL-MOD-*` + 复用 `TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*`）。下方 `TC-VIEW-KRUSKAL-01/02` 亦被 C-048 改写（+ 新增 -03）、`TC-E2E-KRUSKAL-01` 改写。`useKruskal` 逻辑 + `TC-KRUSKAL-01..12` 保留复用。详见 `../20260702-c048-kruskal-into-player/test-cases.md`。

挂载组件断言。helper：`next`（点下一步）、`reset`（点重置）。

| 用例 ID              | 场景             | 操作            | 期望                                                             |
| -------------------- | ---------------- | --------------- | ---------------------------------------------------------------- |
| TC-VIZ-KRUSKALVIZ-01 | 初始结构渲染     | mount           | 6 个 `.kvert`、9 条 `.kedge`、边列表 9 行 `.ke-row`、下一步/重置 |
| TC-VIZ-KRUSKALVIZ-02 | 初始无 MST       | mount           | `.kedge.mst` 数量 0                                              |
| TC-VIZ-KRUSKALVIZ-03 | 下一步·首条加入  | next ×1         | `.kedge.mst` 数量 1；status 含「加入」                           |
| TC-VIZ-KRUSKALVIZ-04 | 成环跳过         | next ×4         | status 含「成环」；`.kedge.cycle` 数量 ≥1；`.kedge.mst` 仍 3     |
| TC-VIZ-KRUSKALVIZ-05 | 当前考虑边高亮   | next ×4         | `.kedge.current` 数量 ≥1                                         |
| TC-VIZ-KRUSKALVIZ-06 | 走到底·完成      | next ×9         | `.kedge.mst` 数量 5；status 含「18」                             |
| TC-VIZ-KRUSKALVIZ-07 | 走到底·成环 4 条 | next ×9         | `.kedge.cycle` 数量 4                                            |
| TC-VIZ-KRUSKALVIZ-08 | 重置复原         | next ×3 后 重置 | `.kedge.mst` 数量 0                                              |

## L4 —— `Kruskal` 视图（`src/views/Article/Algorithm/Kruskal.spec.ts`）

| 用例 ID            | 场景         | 期望                                                    |
| ------------------ | ------------ | ------------------------------------------------------- |
| TC-VIEW-KRUSKAL-01 | 页面骨架渲染 | 含 `Article`；含「Kruskal」标题文案；含 `Playground`    |
| TC-VIEW-KRUSKAL-02 | 内嵌互动组件 | 渲染 `KruskalViz`（存在 `.kruskal-viz`、6 个 `.kvert`） |

## L5 —— Kruskal 页 e2e（`e2e/kruskal.e2e.ts`）

限定容器 `.kruskal-viz`，避免与正文/菜单文字串扰。

| 用例 ID           | 场景            | 操作                                        | 期望                                                                   |
| ----------------- | --------------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| TC-E2E-KRUSKAL-01 | 页面可达 + 互动 | 访问 `/docs/kruskal`；连点下一步 9 次；重置 | 6 个 `.kvert`；走到底 status 含「18」、`.kedge.mst` 5；重置后 mst 清空 |

## 回归（改图算法分类计数）

| 用例 ID（两处） | 文件                                | 改动                                                    |
| --------------- | ----------------------------------- | ------------------------------------------------------- |
| TC-HOOK-01-1    | `src/views/Home/Main/hooks.spec.ts` | 图算法分类 children 1→**2**；含 `dijkstra` 与 `kruskal` |
| TC-HOOK-01-1    | `src/views/Docs/Menu/hooks.spec.ts` | 同上（Menu 版图算法 children 含 dijkstra + kruskal）    |

## 其它回归

- 既有 15 结构页 + 8 排序 + Dijkstra + 播放器 + 骨架：现有 Case **零改动**全绿（除上面两条 TC-HOOK-01-1）。
- **C-037 useDijkstra/DijkstraViz、C-029 useUnionFind 零改动**，其 Case 全绿。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位（参考既有 ~90%）。

## 自测报告（2026-06-30）

- 执行命令：`pnpm format` → `pnpm format:check` / `pnpm lint:check` / `pnpm type-check` / `pnpm test:unit run --coverage` / `pnpm exec playwright test`
- 新增用例：L3 12（TC-KRUSKAL-01..12）+ L4 互动 8（TC-VIZ-KRUSKALVIZ-01..08）+ L4 视图 2（TC-VIEW-KRUSKAL-01/02）+ L5 1（TC-E2E-KRUSKAL-01）= **22 新**；改 2 处 TC-HOOK-01-1（图算法 children 1→2）。
- 结果：**全绿**。单测 `814 passed`（118 文件）；e2e `32 passed`（含 TC-E2E-KRUSKAL-01）。
- 覆盖率（聚合）：Statements 93.26% / Branches 90.64% / Functions 94.1% / Lines 94.16%——均高于门槛（≥70% / ≥60%）。KruskalViz.vue 100%/92.85%/100%/100%；useKruskal 纯逻辑由 12 条 L3 全量覆盖；Kruskal.vue 静态模板挂载渲染。
- 真机自检（Playwright 截图，localhost:5173 `/docs/kruskal`）：初始 6 点无向带权图 + 9 条带权边 + 边排序列表（A-C1/B-C2/D-E3…）；连点下一步 9 次走到底——MST 绿色加粗 = A-C/B-C/D-E/B-D/D-F（5 条）、成环跳过橙虚线 = A-B/C-E/E-F/C-D（4 条）、工具栏「已选 5 条·权重 18」、边列表 A-B 灰删除线、下一步按钮禁用。
- 零回归：C-037 useDijkstra/DijkstraViz、C-029 useUnionFind 零改动；既有 15 结构 + 8 排序 + Dijkstra 全绿；仅 TC-HOOK-01-1 两处（图算法 children 1→2）。
- 结论：达成验收口径，**verified**；图算法分类已含 2 个算法（Dijkstra 最短路 + Kruskal MST）。
