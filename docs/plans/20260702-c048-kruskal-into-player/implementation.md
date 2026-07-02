# 实现记录：Kruskal 接入算法播放器（C-20260702-048，M8②-2 · 收官 M8）

> Status: verified
> Stable ID: C-20260702-048
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 类型扩展**：types.ts +KruskalExecPoint（唯一框架改动，纯追加）。GraphView/AlgorithmPlayer/Step 零改动。
2. **T1 module + oracle + sources**（L3）：先 kruskal.module.spec（TC-KRUSKAL-MOD-01..12）跑红 → kruskal.{ts,sources.ts,module.ts}（复用 useKruskal 图 + 并查集细粒度重走）跑绿。
3. **T2 视图返工**：Kruskal.vue 正文保留 + AlgorithmPlayer；改写 Kruskal.spec（Article+Player+Graph）；改写 kruskal.e2e（播放器交互）；删除 KruskalViz.vue + spec。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + KruskalViz 标 superseded、roadmap M8②-2 收官 → M8 全完成）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 唯一框架改动**：types.ts +`KruskalExecPoint`（init/consider/accept/reject/done 5 点），与 `DijkstraExecPoint` 并列。**GraphView.vue / AlgorithmPlayer.vue / Step / GraphTrack 零改动**——C-047 的 GraphView 通用轨已支持无向图（`directed:false` 不挂 `marker-end`）+ `.current`（黄）/`.mst`（绿）/`.rejected`（虚线）样式，Kruskal 是其**首个无向消费者**。
- **T1 module 复用 useKruskal + 并查集细粒度重走**：`kruskal.ts`（oracle=useKruskal().run() 取 mstEdges/totalWeight/rejected）+ `kruskal.sources.ts`（4 语言排序 + 并查集）+ `kruskal.module.ts`（复用 useKruskal 6 点 9 边无向图<边按权升序>，自持并查集重走 **20 步**）。MST=[AC,BC,DE,BD,DF] 权 18、rejected=[AB,CE,EF,CD]。
  - **edgeClass 累积 helper**：每步重算 `mst.forEach(id=>cls[id]='mst'); rejected.forEach(id=>cls[id]='rejected'); if(currentId) cls[currentId]='current'`。
  - **doneNodes**：accept 时并入边两端点，末步含全 6 点（MST 连通所有点）。
- **T2 视图返工**：Kruskal.vue 正文原样保留，`<Playground><KruskalViz/></Playground>` → `<AlgorithmPlayer :module="kruskalModule"/>`。Kruskal.spec 改（Article+AlgorithmPlayer+GraphView 6 节点+无 .bars-view+全模板锚点）；kruskal.e2e 改（`.graph-view`/`.scrub` 拖末步→5 `.mst`+4 `.rejected`+字幕 18）；`git rm` KruskalViz.vue + spec。useKruskal.ts 保留（module 数据源+oracle）。

### 坑点

- **accept/reject 步误传 currentId 覆盖边分类**：初稿 emit('accept', e.key, ...) 把已入 mst 的边又被 edgeClassOf 的 currentId 覆盖成 'current'（黄），TC-KRUSKAL-MOD-06/07 跑红（期望 mst/rejected，实得 current）。修正：accept/reject 传 `undefined`——'current' 语义**仅属 consider 步**（正在考虑），边一旦归类（mst/rejected）就不再 current。
- **零框架改动验证**：GraphView.vue/spec + AlgorithmPlayer.vue/spec 未动一行，`TC-VIZ-GRAPHVIEW-*`/`TC-PLAYER-GRAPH-*` 零改动全绿——C-047 通用轨设计经无向 Kruskal 二次验证成立。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：134 文件 **955 passed**；覆盖率 **Stmt 93.59% / Branch 91.98% / Func 94.19% / Line 94.44%**（超聚合门槛 70/60）。algorithms 目录 98.15%；GraphView/AlgorithmPlayer 零改动。
- **e2e**：Playwright **40 passed**（含改写的 TC-E2E-KRUSKAL-01 播放器交互）。
- **真机自检**（chrome-devtools，`/docs/kruskal`）：
  - 首步——6 节点 9 边、**无箭头（无向 ✓）**、counter `1 / 20`、字幕「9 条边按权从小到大排好；MST 空…」、**无 `.bars-view`**、Shiki **134 token**、4 语言 tab、权重 1–9 齐全。
  - 末步（scrub→max=19）——counter `20 / 20`、**5 `.graph-edge.mst`（绿实边 AC/BC/DE/BD/DF）**、**4 `.graph-edge.rejected`（红虚线 AB/CE/EF/CD）**、**6 点全 `.done`（绿）**、字幕「选够 5 条边（V−1）：最小生成树完成，总权 18」。
- **零回归**：既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + 播放器各轨 Case 全绿；GraphView/AlgorithmPlayer 零改动。

## 变更历史

- 2026-07-02：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 types +KruskalExecPoint（唯一框架改动）+ T1 kruskal.module（20 步并查集细粒度重走）+ T2 视图返工（正文保留换播放器、KruskalViz 删除）。**零框架改动复用 C-047 GraphView 轨**（首个无向消费者）。门禁全绿（单测 955 / e2e 40 / 覆盖率 93.59%）；真机首末步核对 MST=18 无误。**M8 算法页模板统一全部收官（①②③）**。
