# 实现记录：Dijkstra 接入算法播放器（C-20260702-047，M8②-1）

> Status: verified
> Stable ID: C-20260702-047
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 框架扩展**：types.ts +GraphTrack/Step.graph?/DijkstraExecPoint；AlgorithmPlayer BarsView v-if + `<GraphView v-if>`；AlgorithmPlayer.spec +TC-PLAYER-GRAPH-01/02（内联 graph module + 验证既有 bubble array 非空仍渲染 Bars）。
2. **T1 GraphView**：先 GraphView.spec（TC-VIZ-GRAPHVIEW-01..04）跑红 → GraphView.vue（改造自 DijkstraViz SVG）跑绿。
3. **T2 module + oracle + sources**（L3）：先 dijkstra.module.spec（TC-DIJKSTRA-MOD-01..11）跑红 → dijkstra.{ts,sources.ts,module.ts}（复用 useDijkstra 图 + 细粒度重走）跑绿。
4. **T3 视图返工**：Dijkstra.vue 正文保留 + AlgorithmPlayer；改写 Dijkstra.spec（Article+Player+Graph）；改写 dijkstra.e2e（播放器交互）；删除 DijkstraViz.vue + spec。
5. 全门禁 → 真机自检 → 回写（三索引新 Case + DijkstraViz 标 superseded、roadmap M8②-1）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 框架扩展（additive 零回归）**：`types.ts` +`DijkstraExecPoint`（7 执行点：init/selectMin/settle/relaxEdge/relaxUpdate/relaxSkip/done）、`GraphTrack`（vertices/edges/directed/nodeBadge?/activeNode?/doneNodes?/edgeClass?——通用覆盖 Dijkstra 有向+dist 徽标+relaxed/tree 与 Kruskal 无向+current/mst/rejected）、`Step.graph?`。`AlgorithmPlayer.vue`：`<BarsView v-if="current.array.length">`（既有排序 array 恒非空 → 零回归）+ `<GraphView v-if="current.graph">`。TC-PLAYER-GRAPH-01（graph→GraphView 渲染）/-02（array:[]→无 BarsView；bubble array 非空→BarsView 仍在）双向锁死。
- **T1 GraphView.vue**：改造自 DijkstraViz SVG（viewBox 0 0 460 300）。边线按 R=19 缩短露出 `marker-end` 箭头（directed 时）+ 权重文字；节点圆 r=18 + label + 可选 dist 徽标（x20 y-16）。类：`.graph-node.done`（绿）/.active（琥珀环）、`.graph-edge.relaxed/.current`（黄）/.tree/.mst（绿）/.rejected（虚线）。`edgeViews` 由 vertexById 映射算 x1/y1/x2/y2/wx/wy。TC-VIZ-GRAPHVIEW-01..04。
- **T2 module 细粒度重走**：`dijkstra.ts`（oracle=useDijkstra().run() 取 dist/order）+ `dijkstra.sources.ts`（4 语言数组式 Dijkstra）+ `dijkstra.module.ts`（复用 useDijkstra 6 点 9 边有向图，自己重走出 **32 步**）。dist 终值 [0,3,1,4,7,9]、settle 序 [0,2,1,3,4,5]（A→C→B→D→E→F）、末步 5 条 tree 边 ['0-2','1-3','2-1','3-4','4-5']。
- **T3 视图返工**：Dijkstra.vue 正文原样保留，`<Playground><DijkstraViz/></Playground>` → `<AlgorithmPlayer :module="dijkstraModule"/>`。Dijkstra.spec 改（Article+AlgorithmPlayer+GraphView 6 节点+无 .bars-view）；dijkstra.e2e 改（`.graph-view`/`.scrub` 拖末步→6 `.graph-node.done`+5 `.graph-edge.tree`+字幕「最短」）；`git rm` DijkstraViz.vue + spec。useDijkstra.ts 保留（module 数据源+oracle）。

### 坑点

- **首个 relaxUpdate 是 A→B 而非 A→C**：源 A 出边序 `adj[A]=[A→B(4), A→C(1)]`（按 EDGES 声明序，非权重序），故第一个松弛更新的是 B=4。TC-DIJKSTRA-MOD-07 初稿误设「首更新=C=1」跑红——修正为断言首更新 B=4 + 另找 C=1 的 relaxUpdate 存在。教训：`adj` 邻接序 = 边声明序，不是权重序。
- **AlgorithmPlayer 依赖 Pinia + useHighlighter**：Dijkstra.spec mount 须 `global.plugins:[createPinia()]` + `vi.mock('@/components/player/useHighlighter')`（同 BubbleSort.spec），否则 `getActivePinia()` 报错。
- **BarsView 根类 `.bars-view`**（不在 player/ 子目录，在 `src/components/BarsView.vue`）——负断言用此类名。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓（vue-tsc 干净）。
- **单测**：134 文件 **950 passed**；覆盖率 **Stmt 93.58% / Branch 91.91% / Func 94.2% / Line 94.42%**（远超聚合门槛 70/60）。新文件：dijkstra.module.ts 97.01%/98.11%、GraphView.vue 100%/100%、dijkstra.{ts,sources.ts} 经 MOD-01/MOD-10 全覆盖（algorithms 目录 98.06%）。
- **e2e**：Playwright **40 passed**（含改写的 TC-E2E-DIJKSTRA-01 播放器交互）。
- **真机自检**（chrome-devtools，`/docs/dijkstra`）：
  - 首步——6 节点 9 边、徽标 `[0,∞,∞,∞,∞,∞]`、counter `1 / 32`、字幕「源 A 距离置 0，其余置 ∞」、**无 `.bars-view`**、Shiki **157 token**、4 语言 tab（TS/Python/Go/Rust）。
  - 末步（scrub→max=31）——counter `32 / 32`、徽标 `[0,3,1,4,7,9]`（=oracle）、**6 点全 `.done`（绿）**、**5 条 `.tree`（绿边）**、字幕「全部确定！最短路树（绿边）已定。A→C→B→D→E→F 最短路长 9」。
  - 视觉：有向箭头 + 权重齐全、末步最短路树高亮而非树边淡化、正文+图轨+代码播放器三件同屏。
- **零回归**：既有 15 排序 + 6 轨 + 15 结构 + Kruskal 自建 viz + 播放器各轨 Case 全绿；BarsView 加 v-if 不影响任何排序（TC-PLAYER-GRAPH-02 内 bubble 仍渲染 Bars 佐证）。

## 变更历史

- 2026-07-02：创建（draft）。
- 2026-07-02：交付完成，翻 verified。T0 框架扩展（GraphTrack 第 7 轨 + BarsView v-if）+ T1 GraphView + T2 dijkstra.module（32 步细粒度重走）+ T3 视图返工（正文保留换播放器、DijkstraViz 删除）。门禁全绿（单测 950 / e2e 40 / 覆盖率 93.58%）；真机首末步核对无误。GraphView 轨供 C-048 Kruskal 复用。
