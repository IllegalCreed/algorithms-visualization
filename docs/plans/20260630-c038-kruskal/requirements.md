# 需求：Kruskal 最小生成树（图算法第 2 项，M6 图算法 G6）

> Status: verified
> Stable ID: C-20260630-038
> Type: feature
> Owner: IllegalCreed
> Created: 2026-06-30
> Last reviewed: 2026-06-30
> Progress: 100%
> Blocked by: none
> Next action: 已完成（22 Case + 改 2 HOOK，全门禁绿，双轨部署）
> Replaces: none
> Replaced by: **C-20260702-048（部分）** —— M8②-2 把 Kruskal 页返工进 AlgorithmPlayer：自建 `KruskalViz` 换成 GraphView 无向图轨（零改动复用 C-047）+ 4 语言代码播放器，`KruskalViz.vue`/spec 删除（`TC-VIZ-KRUSKALVIZ-*` superseded、`TC-VIEW-KRUSKAL-01/02` 改写 + 增 -03、`TC-E2E-KRUSKAL-01` 改写）；**`useKruskal` 纯逻辑 + `TC-KRUSKAL-01..12` 保留复用**。见 `../20260702-c048-kruskal-into-player/`。
> Related plans: 算法候选池 `docs/plans/algorithms-backlog.md` G6；roadmap M6；C-037（图算法大类首发 Dijkstra，复用其 Algorithm 目录 + SVG 画法 + 单步 steps 范式）；**呼应 C-029 并查集**（Kruskal 用并查集判环）；回扣 C-022 图结构
> Related tests: 计划新增 `TC-KRUSKAL-*`（useKruskal 纯逻辑）/ `TC-VIZ-KRUSKALVIZ-*`（KruskalViz 互动）/ `TC-VIEW-KRUSKAL-01/02`（Kruskal 页）/ `TC-E2E-KRUSKAL-01`（e2e）；**修改** `TC-HOOK-01-1`（Home + Menu 两处，图算法分类 children 1→2、新增 Kruskal）

> ⚠️ 编号：全局计数已到 037（…035 B+树、036 布隆、037 Dijkstra）；日期已到 2026-06-30，本变更顺延为 **C-20260630-038**。

## 背景

M6 图算法大类第一项 Dijkstra（C-037）落地、大类已开张。本项 **G6 = Kruskal 最小生成树**，是「图算法」分类下的**第二个算法**——不再新建顶层分类，只在已有「图算法」分类里追加。

**定位**：在**无向带权连通图**里，选出若干边把所有点连起来、**总权重最小、不成环**——这就是**最小生成树（MST）**。Kruskal 的思想：把所有边**按权重从小到大排序**，依次考虑每条边——用**并查集**判断这条边两端是否已经连通：**没连通就加入**生成树（并把两端合并），**已连通就跳过**（加它会成环）。直到选够 V−1 条边。它是「贪心 + 并查集」的漂亮范例，**正好呼应已有的「并查集」页**（C-029）。

## 三个地基决策

1. **固定无向带权图**（仿前面所有可视化的固定结构 → 可测）：6 个顶点 **A–F**（id 0–5）+ **9 条无向带权边**，**权重两两不同**（便于排序唯一、过程确定）。
   - 边（端,端,权）：`A-C 1`、`B-C 2`、`D-E 3`、`A-B 4`、`B-D 5`、`C-E 6`、`D-F 7`、`E-F 8`、`C-D 9`。
   - 跑 Kruskal → **MST = A-C、B-C、D-E、B-D、D-F（5 条 = V−1，总权重 18）**；**跳过（成环）= A-B、C-E、E-F、C-D**。
2. **并查集判环**：内置并查集（find + union），逐条边判两端是否已在同一集合。复用并查集页（C-029）讲过的思想，本算法是它的经典应用。
3. **单步演示**（复用 C-037 Dijkstra 的 steps 范式）：`useKruskal.run()` **预计算 `steps`**（step0 初始 + 9 条边逐条考虑，每步记当前边 / 加入还是成环 / 累计 MST），KruskalViz 用 `stepIndex` 单步推进，**同步置态**（无 setTimeout），L4 可精确断言。

## 要做什么

1. **Kruskal 逻辑**（`src/components/structures/useKruskal.ts`）：固定无向带权图 `vertices`（含坐标）/ `edges`（已按权升序，带 id/端点/权）；内置并查集；纯 `run()→{steps, mstEdges, totalWeight}`。可单测。
2. **Kruskal 互动组件**（`src/components/structures/KruskalViz.vue`）：SVG 无向带权图（节点 + 无向边 + 边权）+ **边排序列表**（9 行，当前考虑高亮）+ 下一步 / 重置 工具栏 + 当前边 / 加入 / 成环 / MST 点亮 + 状态解说（已选 N 条、权重和 W）。
3. **Kruskal 页**（`src/views/Article/Algorithm/Kruskal.vue`）：「什么是最小生成树 / Kruskal 思想（排序 + 并查集判环）/ Playground / 为什么贪心取最小成立 / 复杂度 / 用途（布线、聚类、网络设计）」+ 回扣并查集、图。
4. **图算法分类追加 Kruskal + 新页 4 处接线**：
   - `Docs/Menu/hooks.ts` 图算法分类 children 追加 `{title:'Kruskal 最小生成树', url:'kruskal'}`。
   - `Home/Main/hooks.ts` 图算法分类 children 追加同名条目（含 desc + 图标）。
   - 路由 `/docs/kruskal` name `kruskal`（懒加载 Article/Algorithm/Kruskal.vue）。
   - `assets/kruskal.svg` 图标。
5. **测试与文档**：补 L3/L4/L5；**改 `TC-HOOK-01-1`**（Home + Menu 两处：图算法分类 children 1→2、含 Kruskal）；回写 `index.md`、`algorithms-backlog.md`（G6 出池）、三 `test-cases`、`roadmap`。

## 不做什么（边界）

- **不做可编辑图 / 任意权重 / Prim 对照 / 并查集路径压缩动画 / 非连通图（森林）**：本页固定图、单步演示主线；Prim、复杂度证明、路径压缩由正文带过或后续（G7 Prim）。
- **不新建顶层分类**（图算法分类已存在，只追加第 2 个算法）；不接入算法播放器框架（沿用 Dijkstra 自包含单步）。
- **不改 C-037 DijkstraViz / C-029 useUnionFind / 既有 15 结构 + 8 排序**：仅新增 useKruskal/KruskalViz/Kruskal.vue + 接线 + 改 TC-HOOK-01-1。

## 业务规则 / 约束

- **互动模型**：读者驱动单步；`run()` 纯函数预计算 steps；KruskalViz 下一步同步推进 stepIndex、同步置态（L4 可断言）；点亮 CSS 过渡渐显；重置回 step0、始终可点。
- **数据**：固定 6 点 9 边无向带权图（上文）；边按权升序；并查集判环；MST 5 条总权 18；跳过 4 条成环。
- **可视化**：SVG 无向带权图（节点 + 边 + 权 label）+ 边排序列表；当前考虑边橙、加入绿加粗、成环红、MST 累计绿；容器定宽定高。
- **图算法分类追加**：菜单/首页图算法 children +1（Kruskal 置 Dijkstra 之后）；**改 TC-HOOK-01-1 两处**（children 1→2，含 kruskal）。新页 name = slug `kruskal`。
- **向后兼容硬约束**：仅新增 + 图算法分类追加 + 改 TC-HOOK-01-1（合理变更）；既有 15 结构 + 8 排序 + Dijkstra + 播放器 全部现有 Case 零改动通过（除 TC-HOOK-01-1 两处）。C-037/C-029 零改动。
- 沿用 pnpm / ESLint / Prettier / `type-check` 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。
- 发版双轨：`push` 部署 GitHub Pages；自有域名手动 `./scripts/deploy.sh`。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [ ] 侧边菜单/首页「图算法」分类下出现**第 2 项「Kruskal 最小生成树」**，可进入、不 404。
- [ ] 新增「Kruskal 最小生成树」页（`/docs/kruskal`）：正文 + 内嵌 KruskalViz。
- [ ] **互动**：见无向带权图 + 边排序列表；单步推进——按权从小到大考虑每条边、并查集判环、不成环则加入（绿）、成环则跳过（红）；走完得 MST 5 条边、总权重 18，4 条边因成环被跳过一目了然。
- [ ] **正文质量**：讲清「最小生成树 / 排序 + 并查集判环 / 贪心取最小成立 / O(E log E) / 布线·聚类·网络设计用途」，回扣并查集、图。
- [ ] **零回归**：既有 15 结构 + 8 排序 + Dijkstra + 播放器全绿；C-037/C-029 零改动；仅 TC-HOOK-01-1 两处（图算法 children 1→2）。
- [ ] 新增 L3/L4/L5 全绿、覆盖率达门槛；三索引 + roadmap + algorithms-backlog 回写；G6 出池标完成。

## 开放问题

- 固定图 + 单步：保证可测 + 聚焦；任意图/Prim 对照/路径压缩由正文或后续（G7 Prim）。
- 与 Dijkstra 的关系：同在「图算法」分类，一个最短路、一个最小生成树；正文点明区别（最短路 vs 总权最小连通）。

## 变更历史

- 2026-06-30：创建。M6 图算法第 2 项 G6。Owner 在 Dijkstra 后于「继续图算法」中选定 Kruskal。固定 6 点 9 边无向带权图 + 并查集判环 + 单步演示（MST 5 条总权 18、跳过 4 条成环）。不新建分类（图算法分类已存在），只追加第 2 个算法，改 TC-HOOK-01-1 两处。复用 C-037 Algorithm 目录 + 单步 steps 范式，呼应 C-029 并查集。编号顺延 038（日期 6/30）。按用户「完全信任、可视化页不再做外观确认」直接进文档+TDD（见记忆 skip-visual-confirmation）。
