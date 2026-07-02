# 需求：Dijkstra 接入算法播放器（新 GraphView 轨，M8②-1）

> Status: verified
> Stable ID: C-20260702-047
> Type: refactor
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-02
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；GraphView 轨供 C-048 Kruskal 复用）
> Replaces: C-20260629-037 的自建 DijkstraViz 可视化部分（DijkstraViz.vue 标 superseded）
> Replaced by: none
> Related plans: roadmap **M8②（图算法接入播放器）**第 1 项；C-037（Dijkstra 原页，本变更返工其可视化）；C-006（算法播放器框架）；C-040~C-045（全模板样板）；**后续 C-048 Kruskal 复用本变更建的 GraphView 轨**
> Related tests: 计划新增 `TC-VIZ-GRAPHVIEW-*`（GraphView 新轨）/ `TC-PLAYER-GRAPH-*`（播放器接图轨 + BarsView 空数组不渲染）/ `TC-DIJKSTRA-MOD-*`（dijkstra.module）；**改** `TC-VIEW-DIJKSTRA-01/02`（自建 viz → 播放器）+ `TC-E2E-DIJKSTRA-01`（播放器交互）；**标 superseded** `TC-VIZ-DIJKSTRAVIZ-*`（DijkstraViz 删除）

> ⚠️ 编号：全局计数到 046；本变更为 **C-20260702-047**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M8②**（唯一剩项）：算法页三件套统一要求算法页 = 介绍正文 + 交互可视化 + **多语言代码播放器**。图算法（Dijkstra C-037、Kruskal C-038）当年是「介绍文章 + **自建 viz**（DijkstraViz/KruskalViz + useXxx，单步按钮）」形式——**有正文、有可视化，但没有代码播放器**，与排序页不一致。
- **本变更（M8②-1）**：把 **Dijkstra** 返工进 AlgorithmPlayer 框架——新建 **GraphView 轨**承载「带权图 + 距离表 + 松弛高亮」，配多语言代码同步高亮 + 单步/播放/拖动。**正文保留**（已写得好），仅把自建 DijkstraViz 换成 AlgorithmPlayer。GraphView 轨设计为通用，**Kruskal（C-048）直接复用**。

## 三个地基决策

1. **新建第 7 条 GraphView 轨 + BarsView 变可选**：图算法没有天然「柱状数组」主轨——AlgorithmPlayer 的 `<BarsView>` 加 `v-if="current.array.length"`（既有排序 array 恒非空 → 零回归），图算法 `array:[]` 只渲染 GraphView。GraphTrack 通用字段覆盖 Dijkstra（有向 + dist 徽标 + settled 绿 + relaxed/tree 边）与 Kruskal（无向 + current/mst/rejected 边 + 分量）。
2. **复用 useDijkstra 固定图数据 + 细粒度重走**：dijkstra.module 导入 `useDijkstra()` 的 6 点 9 边有向图（源 A），但**自己重走出更细的步**（init/selectMin/settle/relaxEdge/relaxUpdate/relaxSkip/done，~32 步），对齐 4 语言源码逐行高亮。useDijkstra.ts **保留**（作数据源 + oracle）；DijkstraViz.vue（自建 SVG 组件）**删除、标 superseded**。
3. **正文保留 + 换播放器**：Dijkstra.vue 的 Article 正文原样保留，`<Playground><DijkstraViz/></Playground>` → `<AlgorithmPlayer :module="dijkstraModule"/>`。

## 要做什么

1. **框架扩展**（`player/types.ts` + `AlgorithmPlayer.vue`，additive）：+`GraphTrack`/`Step.graph?`/`DijkstraExecPoint`；BarsView `v-if="current.array.length"`；+`<GraphView v-if="current.graph">`。补 TC-PLAYER-GRAPH（图轨渲染 + 空数组不渲染 BarsView）。
2. **GraphView 轨**（`src/components/GraphView.vue`）：SVG 图（改造自 DijkstraViz）——节点（圆 + label + 可选 dist 徽标 + doneNodes 绿 + activeNode 环）、边（有向箭头可选 + 权重 + edgeClass 高亮）。
3. **算法模块**（`src/algorithms/dijkstra.module.ts` + `dijkstra.ts` oracle + `dijkstra.sources.ts` 4 语言）：产出 Step<DijkstraExecPoint>[]（array:[] + graph 轨 + vars dist 表）。
4. **视图返工**（`src/views/Article/Algorithm/Dijkstra.vue`）：正文保留 + AlgorithmPlayer。
5. **删除自建 viz**：DijkstraViz.vue + DijkstraViz.spec.ts 删除（Cases 标 superseded）；useDijkstra 保留。改 Dijkstra.spec（Article + AlgorithmPlayer + GraphView）+ dijkstra.e2e（播放器交互）。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case + superseded 旧 viz Case）、roadmap（M8②-1）。**不改路由/菜单/首页/图标/TC-HOOK**（Dijkstra 早在菜单里）。

## 不做什么（边界）

- **不改 Kruskal**（C-048 复用 GraphView 时做）、不改排序/数据结构页。
- **不改 useDijkstra 算法逻辑 / 图数据**（复用）；不改既有 6 轨、usePlayer、其它排序。
- **不做可调图 / 交互建图 / 优先队列堆可视化**：固定 6 点 9 边、数组式取最小，主线呈现。

## 业务规则 / 约束

- **数据**：复用 useDijkstra 固定图（源 A，dist 终值 [0,3,1,4,7,9]、序 A→C→B→D→E→F、A→F 最短路长 9）。
- **可视化**：GraphView（节点 dist 徽标 + settled 绿 + 当前点环 + relaxed 黄边 + 末步最短路树绿边）+ vars（dist 表 + u + k）；BarsView 空数组不显。
- **向后兼容硬约束**：GraphTrack/Step.graph?/DijkstraExecPoint 均追加；BarsView 加 v-if（既有排序 array 恒非空 → 零回归）；既有 15 排序 + 6 轨 + 15 结构 + Kruskal + 播放器现有 Case 零改动通过。DijkstraViz 删除仅影响其自身 Case（标 superseded）+ Dijkstra 页 Case（改写）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] Dijkstra 页 `/docs/dijkstra`：**正文 + 交互可视化（GraphView 图轨）+ 多语言代码播放器**三件齐全（与排序页一致）。真机自检确认三件同屏。
- [x] **互动**：单步看到——源 A dist=0 其余 ∞、每步取最近点确定（绿）、松弛邻边（黄 + dist 徽标更新）、末步最短路树（绿边）+ dist 终值 [0,3,1,4,7,9]。真机末步徽标 [0,3,1,4,7,9]、6 点全绿、5 条树边、字幕 A→C→B→D→E→F 长 9。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 157 Shiki token。
- [x] **零回归**：既有 15 排序 + 6 轨 + 15 结构 + Kruskal + 播放器各轨全绿；BarsView 加 v-if 不影响任何排序。单测 950 全绿、e2e 40 全绿。
- [x] 新增 GraphView/播放器接轨/dijkstra.module Case 全绿；DijkstraViz Case 标 superseded；三索引 + roadmap（M8②-1）回写。
- [x] GraphView 轨为通用设计，**Kruskal（C-048）可直接复用**（本变更验收其 Dijkstra 用法）。

## 开放问题

- Dijkstra 无天然柱数组 → array:[]（BarsView 隐藏），dist 信息走 GraphView 节点徽标 + vars 表。
- 步粒度：每条出边 relaxEdge（决策）+ relaxUpdate/relaxSkip（动作），同排序「compare + 分支」节奏；~32 步。
- DijkstraViz 删除 vs 保留：按 M8 规范「旧自建 viz 标 superseded」——删除组件+spec（git 存档），plan/test-cases 标 superseded 双向链接；useDijkstra 因被 module 复用而保留。

## 变更历史

- 2026-07-02：创建。M8②-1——Dijkstra 接入算法播放器。新建通用 GraphView 第 7 轨（改造自 DijkstraViz），BarsView 变可选（v-if array.length，零回归）。复用 useDijkstra 固定图 + 细粒度重走 + 4 语言 sources；正文保留、换播放器；DijkstraViz 删除标 superseded。GraphView 供 Kruskal C-048 复用。编号 047。按 skip-visual-confirmation 直接进文档+TDD。
