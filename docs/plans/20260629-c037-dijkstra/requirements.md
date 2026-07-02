# 需求：Dijkstra 最短路（新页 + 新「图算法」顶层分类，M6 阶段一首发 G1）

> Status: verified
> Stable ID: C-20260629-037
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-06-29
> Progress: 100%
> Blocked by: none
> Next action: 已完成（22 Case + 改 2 HOOK，全门禁绿，双轨部署，图算法大类开张）
> Replaces: none
> Replaced by: **C-20260702-047（部分）** —— M8②-1 把 Dijkstra 页返工进 AlgorithmPlayer：自建 `DijkstraViz` 换成通用 GraphView 图轨 + 4 语言代码播放器，`DijkstraViz.vue`/spec 删除（`TC-VIZ-DIJKSTRAVIZ-*` superseded、`TC-VIEW-DIJKSTRA-01/02` 改写 + 增 -03、`TC-E2E-DIJKSTRA-01` 改写）；**`useDijkstra` 纯逻辑 + `TC-DIJKSTRA-01..12` 保留复用**。见 `../20260702-c047-dijkstra-into-player/`。
> Related plans: 算法候选池 `docs/plans/algorithms-backlog.md` G1（图算法大类首发）；roadmap M6；回扣 C-022（图数据结构页——本算法是其「算法视角」延伸，复用六边形布局 + SVG 画法）；借鉴 C-006 算法播放器的「单步演示」思路（本 viz 自建轻量单步，不接入播放器框架）
> Related tests: 计划新增 `TC-DIJKSTRA-*`（useDijkstra 纯逻辑）/ `TC-VIZ-DIJKSTRAVIZ-*`（DijkstraViz 互动）/ `TC-VIEW-DIJKSTRA-01/02`（Dijkstra 页）/ `TC-E2E-DIJKSTRA-01`（e2e）；**修改** `TC-HOOK-01-1`（Home + Menu 两处，顶层分类 2→3、新增「图算法」）

> ⚠️ 编号：全局计数已到 036（030 个人主页、031 LRU、032 跳表、033 线段树、034 别会话 M5 SEO/GEO、035 B+ 树、036 布隆），本变更顺延为 **C-20260629-037**。

## 背景

M4（数据结构深化扩充）全收官后，开启 **M6 算法分类扩充**（见 `docs/plans/algorithms-backlog.md`）。**阶段一首发 G1 = Dijkstra 最短路**，同时它是「图算法」这个**新顶层大类的第一个页**。

**为何先做图算法 / 先做 Dijkstra**：图算法承接已有的「图」数据结构页（C-022），最自然；BFS/DFS 遍历 C-022 已讲过（无权图），本类从**带权图最短路 Dijkstra** 起，不重复、且最具代表性。

**定位**：Dijkstra 解**单源最短路**（边权非负）。核心思想——维护一张「源到各点的当前最短距离」表，反复**取出还没确定、当前距离最小的点**把它「定下来」，再用它去**松弛**（relax）邻边：若「经它中转」更短就更新邻居的距离。每个点被定下来一次，定下来时它的距离就是最终最短距离。可视化最出彩的一点：**先到某点的距离不一定最短，后续会被更短的路径反复更新**。

**这是一次「大类首发」变更**（比单个数据结构新页大）：除新页本身，还要**新增一个顶层菜单分类「图算法」**（和「数据结构」「经典排序算法」并列）。

## 三个地基决策

1. **固定带权有向图**（仿前面所有可视化的固定结构 → 可测）：6 个顶点 **A–F**（id 0–5）+ **9 条有向边**，源 **A**。边经精心设计，使 Dijkstra 过程出现**多次「松弛更新」**（先到的点被更短路径降距），教学价值最高。
   - 边（起→止，权）：`A→B 4`、`A→C 1`、`C→B 2`、`C→D 5`、`B→D 1`、`B→E 7`、`D→E 3`、`D→F 6`、`E→F 2`。
   - 跑 Dijkstra（源 A）：**确定顺序** `A→C→B→D→E→F`；**最终距离** `A0 / B3 / C1 / D4 / E7 / F9`；最短路 `A→F = A→C→B→D→E→F`（9）。
   - 松弛亮点：dist(B) 4→3、dist(D) 6→4、dist(E) 10→7、dist(F) 10→9。
2. **零回归：不改 C-022 的 `useGraph`/`GraphViz`**（无向无权，已 verified），**新建自包含** `useDijkstra` + `DijkstraViz`（复用六边形布局 + SVG 节点/边画法的思路）。图算法大类出第二个算法时再抽共用带权图画布。
3. **单步演示**：`useDijkstra.run()` **预计算 `steps`**（每步 = 本步确定的点 + 距离表快照 + 本步松弛的边），DijkstraViz 用 `stepIndex` 指针在 steps 间「下一步」推进——**同步置态**（无 setTimeout），L4 可精确断言每步。

## 要做什么

1. **Dijkstra 逻辑**（`src/components/structures/useDijkstra.ts`）：固定带权有向图 `vertices`（含坐标）/ `edges`（带权有向）/ `adj`（出边邻接）；纯 `run()→{order, dist, prev, steps}`；`pathTo(v)`（沿 prev 还原最短路）。可单测。
2. **Dijkstra 互动组件**（`src/components/structures/DijkstraViz.vue`）：SVG 带权有向图（箭头 + 边权）+ 距离表（A–F 当前 dist）+ 下一步 / 重置 工具栏 + 确定点 / 松弛边 / 最短路树点亮 + 状态解说。
3. **Dijkstra 页**（`src/views/Article/Algorithm/Dijkstra.vue`，**新建 Algorithm 目录**）：「什么是最短路 / Dijkstra 思想（取最近 + 松弛）/ Playground / 为什么贪心取最近成立（非负权）/ 复杂度 / 用途（地图导航、网络路由）」+ 回扣图结构。
4. **新增「图算法」顶层分类 + 新页 4 处接线**：
   - `Docs/Menu/hooks.ts` `useCategoryData` 追加第 3 个分类 `{title:'图算法', children:[{title:'Dijkstra 最短路', url:'dijkstra'}]}`。
   - `Home/Main/hooks.ts` 首页网格追加同名分类组（含 desc + 图标）。
   - 路由 `/docs/dijkstra` name `dijkstra`（懒加载）。
   - `assets/dijkstra.svg` 图标（1024 viewBox 黑剪影）。
5. **测试与文档**：补 L3/L4/L5；**改 `TC-HOOK-01-1`**（Home + Menu 两处：顶层分类 2→3、`data[2].title==='图算法'`、其 children 含 Dijkstra）；回写 `index.md`、`algorithms-backlog.md`（G1 出池）、三 `test-cases`、`roadmap`（M6 doing）。

## 不做什么（边界）

- **不做可编辑图 / 任意源点 / 负权（Bellman-Ford）/ A\* / 优先队列内部结构动画**：本页固定图、固定源 A、单步演示主线；优先队列、复杂度证明、负权由正文带过。
- **不改 C-022 useGraph/GraphViz / 不改既有 15 结构页 + 8 排序 / 不接入算法播放器框架**：仅新增 useDijkstra/DijkstraViz/Dijkstra.vue + 新分类接线 + 改 TC-HOOK-01-1。
- **不一次做完图算法大类**：本变更只起「图算法」分类 + Dijkstra 一个；Bellman-Ford / Floyd / 拓扑 / MST / SCC 后续按 algorithms-backlog 推进。

## 业务规则 / 约束

- **互动模型**：读者驱动单步；`run()` 纯函数预计算 steps；DijkstraViz 下一步同步推进 stepIndex、同步置态（L4 可断言）；点亮 CSS 过渡渐显；重置回 step0、始终可点。
- **数据**：固定 6 点 9 边带权有向图（上文）；源 A；确定顺序 A→C→B→D→E→F；最终距离 [0,3,1,4,7,9]。
- **可视化**：SVG 带权有向图（marker 箭头 + 边权 label）+ 距离表；确定点深绿 / 本步确定点橙描边 / 松弛边高亮 / 最短路树边绿；容器定宽定高。
- **新增顶层分类**：`useCategoryData` 与首页各加「图算法」组；**改 TC-HOOK-01-1 两处**（分类 2→3）。新页 name = slug `dijkstra`。
- **向后兼容硬约束**：仅新增 + 新分类接线 + 改 TC-HOOK-01-1（合理变更）；既有 15 结构 + 8 排序 + 播放器 + 骨架 全部现有 Case 零改动通过（除 TC-HOOK-01-1 两条）。C-022 useGraph/GraphViz 零改动。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 首页 + 侧边菜单出现**第 3 个分类「图算法」**，其下「Dijkstra 最短路」可进入、不 404。
- [ ] 新增「Dijkstra 最短路」页（`/docs/dijkstra`）：正文 + 内嵌 DijkstraViz。
- [ ] **互动**：见带权有向图 + 距离表；单步推进——每步确定一个最近点、松弛其邻边、距离表更新；**能看到 dist 被更短路径反复降低**（如 B 4→3、E 10→7）；走完得最短路 A→F = 9 + 最短路树。
- [ ] **正文质量**：讲清「单源最短路 / 取最近 + 松弛 / 非负权下贪心成立 / O((V+E)logV) / 导航·路由用途」，回扣图结构。
- [ ] **零回归**：既有 15 结构 + 8 排序 + 播放器全绿；C-022 useGraph/GraphViz 零改动；仅 TC-HOOK-01-1 两处计数 2→3（合理）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + algorithms-backlog 回写；G1 出池标完成、**图算法大类开张**。

## 开放问题

- 固定图 + 固定源 + 单步：保证可测 + 聚焦；任意源/可编辑图/优先队列动画由正文交代或后续。
- 「图算法」与「数据结构」里的「图」页关系：前者讲算法（最短路等），后者讲结构本身（存储 + 遍历）；正文互相链接。

## 变更历史

- 2026-06-29：创建。M6 阶段一首发 G1。新增「图算法」顶层分类 + Dijkstra 单源最短路（固定 6 点 9 边带权有向图，确定顺序 A→C→B→D→E→F、距离 [0,3,1,4,7,9]，多次松弛更新）。零回归不改 C-022 useGraph/GraphViz，新建自包含 useDijkstra/DijkstraViz。新建 `views/Article/Algorithm/` 目录放图算法页。改 TC-HOOK-01-1 两处 2→3。编号顺延 037。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
