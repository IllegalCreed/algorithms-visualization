# 需求：Kruskal 接入算法播放器（复用 GraphView 轨，M8②-2 · 收官 M8）

> Status: verified
> Stable ID: C-20260702-048
> Type: refactor
> Owner: IllegalCreed
> Created: 2026-07-02
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；**M8 算法页模板统一全部收官**）
> Replaces: C-20260630-038 的自建 KruskalViz 可视化部分（KruskalViz.vue 标 superseded）
> Replaced by: none
> Related plans: roadmap **M8②（图算法接入播放器）**第 2 项（收官）；**C-047（Dijkstra 接播放器，建 GraphView 通用轨——本变更直接复用零改动）**；C-038（Kruskal 原页，本变更返工其可视化）；C-006（算法播放器框架）
> Related tests: 计划新增 `TC-KRUSKAL-MOD-*`（kruskal.module）；**改** `TC-VIEW-KRUSKAL-01/02`（自建 viz → 播放器）+ `TC-E2E-KRUSKAL-01`（播放器交互）；**标 superseded** `TC-VIZ-KRUSKALVIZ-*`（KruskalViz 删除）；复用 C-047 的 `TC-VIZ-GRAPHVIEW-*` / `TC-PLAYER-GRAPH-*`（无向图分支）

> ⚠️ 编号：全局计数到 047；本变更为 **C-20260702-048**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M8②**（图算法接播放器）由两半组成：Dijkstra（**C-047 ✓ 已完成**，建通用 GraphView 第 7 轨）+ Kruskal（本变更 C-048，收官）。
- **本变更（M8②-2）**：把 **Kruskal** 返工进 AlgorithmPlayer 框架——**直接复用 C-047 建好的 GraphView 轨**（已支持无向图 + edgeClass current/mst/rejected），配多语言代码同步高亮 + 单步/播放/拖动。**正文保留**，仅把自建 KruskalViz 换成 AlgorithmPlayer。**完成即 M8 算法页模板统一全部收官**。

## 三个地基决策

1. **零框架改动复用 GraphView 轨**：GraphView（C-047）已通用——`directed:false` 不画箭头、`.graph-edge.current`（黄）/`.mst`（绿）/`.rejected`（虚线灰）样式齐备。Kruskal 唯一 additive 是 `types.ts` 加 `KruskalExecPoint`（新执行点类型，纯追加零回归）。**不改 GraphView.vue / AlgorithmPlayer.vue / Step / 其它类型**。
2. **复用 useKruskal 固定图 + 细粒度重走**：kruskal.module 导入 `useKruskal()` 的 6 点 9 边无向图（边按权升序）+ 并查集，**自己重走出更细的步**（init/consider/accept/reject/done，20 步），对齐 4 语言源码逐行高亮。useKruskal.ts **保留**（数据源 + oracle）；KruskalViz.vue **删除、标 superseded**。
3. **正文保留 + 换播放器**：Kruskal.vue 的 Article 正文原样保留，`<Playground><KruskalViz/></Playground>` → `<AlgorithmPlayer :module="kruskalModule"/>`。

## 要做什么

1. **框架扩展**（`player/types.ts`，additive）：+`KruskalExecPoint`（`'init'|'consider'|'accept'|'reject'|'done'`）。**GraphView/AlgorithmPlayer/Step 零改动**（图轨已就位）。
2. **算法模块**（`src/algorithms/kruskal.module.ts` + `kruskal.ts` oracle + `kruskal.sources.ts` 4 语言）：复用 useKruskal 图，产出 Step<KruskalExecPoint>[]（array:[] + graph 轨含 edgeClass current/mst/rejected + doneNodes 已连通点 + vars 权重表）。
3. **视图返工**（`src/views/Article/Algorithm/Kruskal.vue`）：正文保留 + AlgorithmPlayer。
4. **删除自建 viz**：KruskalViz.vue + KruskalViz.spec.ts 删除（Cases 标 superseded）；useKruskal 保留。改 Kruskal.spec（Article + AlgorithmPlayer + GraphView）+ kruskal.e2e（播放器交互）。
5. **测试与文档**：L3/L4/L5；回写三索引（新 Case + superseded 旧 viz Case）、roadmap（M8②-2 收官 → M8 全完成）。**不改路由/菜单/首页/图标/TC-HOOK**（Kruskal 早在菜单里）。

## 不做什么（边界）

- **不改 GraphView.vue / AlgorithmPlayer.vue / Step 类型 / Dijkstra**（C-047 已定，本变更纯复用）。
- **不改 useKruskal 算法逻辑 / 图数据**（复用）；不改既有 7 轨、usePlayer、15 排序、15 结构。
- **不做可调图 / 交互建图 / Prim 对照**：固定 6 点 9 边、边按权升序，主线呈现。

## 业务规则 / 约束

- **数据**：复用 useKruskal 固定图（MST=[AC,BC,DE,BD,DF]、总权 18、成环跳过 [AB,CE,EF,CD]）。
- **可视化**：GraphView 无向图（当前考虑边 current 黄 + 已选 mst 绿 + 成环 rejected 虚线 + 已连通点 doneNodes 绿）+ vars（当前边 / MST 权重 / 已选边数 / 成环数）；无 nodeBadge（无向无 dist）。
- **向后兼容硬约束**：KruskalExecPoint 追加；GraphView/AlgorithmPlayer/Step 零改动 → 既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + 播放器现有 Case 零改动通过。KruskalViz 删除仅影响其自身 Case（标 superseded）+ Kruskal 页 Case（改写）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] Kruskal 页 `/docs/kruskal`：**正文 + 交互可视化（GraphView 图轨）+ 多语言代码播放器**三件齐全（与 Dijkstra / 排序页一致）。真机自检三件同屏。
- [x] **互动**：单步看到——边按权从小到大逐条 consider（黄）、不成环 accept（绿）/ 成环 reject（虚线），末步 MST=[AC,BC,DE,BD,DF]（5 绿边）+ 总权 18 + 4 条成环虚线。真机末步 5 mst + 4 rejected + 6 点全连通 + 字幕「总权 18」。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 134 Shiki token、无箭头（无向）。
- [x] **零回归**：既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + 播放器各轨全绿；GraphView/AlgorithmPlayer 零改动。单测 955 绿、e2e 40 绿。
- [x] 新增 kruskal.module Case 全绿；KruskalViz Case 标 superseded；三索引 + roadmap（M8②-2 收官）回写。
- [x] **M8 全收官**：① 新算法全模板 ✓ + ② 图算法接播放器（Dijkstra C-047 + Kruskal C-048）✓ + ③ 老排序补正文 ✓。

## 开放问题

- Kruskal 无天然柱数组 → array:[]（BarsView 隐藏，C-047 已实现）；无向无 dist → 不设 nodeBadge。
- 步粒度：每条边 consider（决策，查并查集）+ accept/reject（动作），同 Dijkstra relaxEdge + relaxUpdate/relaxSkip 节奏；20 步。
- doneNodes：标「已并入 MST 森林」的点（首条关联 mst 边加入时变绿），呈现森林生长。
- KruskalViz 删除 vs 保留：按 M8 规范「旧自建 viz 标 superseded」——删除组件+spec（git 存档），plan/test-cases 标 superseded 双向链接；useKruskal 因被 module 复用而保留。

## 变更历史

- 2026-07-02：创建。M8②-2（收官）——Kruskal 接入算法播放器。**零框架改动复用 C-047 GraphView 轨**（无向图 + current/mst/rejected 边分类），唯一 additive types +KruskalExecPoint。复用 useKruskal 固定图 + 细粒度重走 20 步 + 4 语言 sources；正文保留、换播放器；KruskalViz 删除标 superseded。完成即 M8 全收官。编号 048。按 skip-visual-confirmation 直接进文档+TDD。
