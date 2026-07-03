# 需求：拓扑排序（新图算法页，DAG 依赖排序，复用 GraphView 轨）

> Status: verified
> Stable ID: C-20260703-051
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；GraphView 第 5 消费者，补齐图算法三大范式）
> Replaces: none
> Replaced by: none
> Related plans: roadmap **M6 图算法分类扩充**（G5）；C-047 建的 GraphView 通用轨（本页第 5 消费者零改动复用）；C-049 Prim / C-050 Bellman-Ford（同期图算法新页样板）；数据结构 · 图（C-022）、队列（Kahn 用队列）
> Related tests: 计划新增 `TC-TOPO-MOD-*`（module）/ `TC-VIEW-TOPO-01/02/03`（页）/ `TC-E2E-TOPO-01`（e2e）；**修改** `TC-HOOK-01-1`（Home）+ `TC-HOOK-02-1`（Menu）（图算法 4→5、新增 topological-sort）

> ⚠️ 编号：全局计数到 050；本变更为 **C-20260703-051**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M6 图算法分类扩充**：图算法大类已有最短路（Dijkstra C-047 / Bellman-Ford C-050）+ 最小生成树（Kruskal C-048 / Prim C-049）两组配对。本变更加 **拓扑排序**——图算法的**第三大经典范式**：不求路径、不求树，而是求**有向无环图（DAG）的一个线性顺序**，使每条边 `u→v` 都满足 u 排在 v 前。
- **教学点**：Kahn 算法——反复取一个**入度为 0** 的点输出，并把它的后继入度各减 1，直到所有点输出。若中途没有入度 0 的点，说明有环（无拓扑序）。典型应用：课程先修顺序、任务/构建依赖、编译顺序。
- **复用 M8 基础设施**：直接走全模板，**零改动复用 C-047 的 GraphView 有向图轨**——`nodeBadge` 承载**入度**、`doneNodes` 承载**已输出点**、`edgeClass` 高亮当前点出边。GraphView 通用轨第 5 消费者。

## 三个地基决策

1. **新建固定 DAG**：新建一张 6 点 7 边有向无环图，拓扑序**非平凡**（不等于点标号顺序，需真正按入度求解），且存在**并列可选点**（同时多个入度 0）以演示「按最小下标取」的确定化 tiebreak。图数据放 `topo.ts`（module + oracle 共用）。
2. **零改动复用 GraphView 轨**：有向图（`directed:true`）+ `nodeBadge`（当前入度数字）+ `doneNodes`（已输出点变绿）+ `activeNode`（当前取出点琥珀环）+ `edgeClass`（当前点出边 'current' 黄）——全部 C-047 已就位。唯一 additive：`types.ts` +`TopoExecPoint`。
3. **Kahn 算法细粒度重走**：init（算各点入度）→ 每轮 selectNode（取入度 0 且最小下标的点）+ removeNode（输出它、后继入度各减 1）→ done（拓扑序完成）。~14 步，对齐 4 语言逐行高亮。

## 要做什么

1. **框架扩展**（`player/types.ts`，additive）：+`TopoExecPoint`（`'init'|'selectNode'|'removeNode'|'done'`）。GraphView/AlgorithmPlayer/Step 零改动。
2. **算法模块**（`src/algorithms/topo.module.ts` + `topo.ts`〈图数据 + oracle〉 + `topo.sources.ts` 4 语言）：init 算入度 → Kahn 重走 → done。约 14 步。
3. **新页面**（`src/views/Article/Algorithm/Topo.vue`）：Article 正文（什么是拓扑序 / Kahn 怎么做 / 在哪里用〈课程/构建依赖〉/ 有环则无解）+ AlgorithmPlayer。
4. **接线**：路由 `/docs/topological-sort`（name='topological-sort'）；菜单图算法 +拓扑排序；首页网格 +拓扑排序（新 topo.svg 图标）。
5. **TC-HOOK**：TC-HOOK-01-1（Home）+ TC-HOOK-02-1（Menu）图算法 children 4→5、url 加 'topological-sort'。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case + HOOK 文案）、roadmap（M6 图算法 G5）。

## 不做什么（边界）

- **不改 GraphView.vue / AlgorithmPlayer.vue / Step 类型 / Dijkstra / Kruskal / Prim / Bellman-Ford**（纯复用）。
- **不做 DFS 版拓扑 / 环检测的完整可视化**（正文一句带过：无入度 0 点即有环）；不做可调图。
- 固定 DAG、Kahn + 最小下标 tiebreak，主线呈现。

## 业务规则 / 约束

- **数据**：新建固定 DAG（6 点 7 边），拓扑序 **C→A→E→B→D→F**（非平凡），初始入度 [A=1,B=2,C=0,D=1,E=0,F=3]。
- **可视化**：GraphView 有向图（nodeBadge 入度 + 当前点 activeNode 环 + 已输出 doneNodes 绿 + 当前点出边 current 黄）+ vars（已输出序列 / 当前点 / 剩余点数）。
- **向后兼容硬约束**：TopoExecPoint 追加；GraphView/AlgorithmPlayer/Step 零改动 → 既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + Kruskal + Prim + Bellman-Ford + 播放器现有 Case 零改动通过。仅 TC-HOOK-01-1/02-1 因菜单加项而改（图算法 5 项）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] 拓扑排序页 `/docs/topological-sort`：**正文 + 交互可视化（GraphView 图轨）+ 多语言代码播放器**三件齐全。真机三件同屏。
- [x] **互动**：单步看到——init 各点入度、每步取入度 0 的点（琥珀环）输出（变绿）、后继入度减 1（徽标下降），末步拓扑序 C→A→E→B→D→F 全部变绿。真机首步入度 [1,2,0,1,0,3]、末步 14/14 拓扑序 C→A→E→B→D→F + 6 点全绿。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 152 Shiki token、有箭头（有向）、边无权标签干净。
- [x] **零回归**：既有 15 排序 + 7 轨 + 15 结构 + 4 图算法 + 播放器各轨全绿；GraphView.vue/AlgorithmPlayer 零改动（仅 GraphTrack.edges.w 放宽为可选，向后兼容）。单测 1000 绿、e2e 43 绿。
- [x] 图算法菜单/首页 5 项，TC-HOOK-01-1/02-1 更新；新 topo.svg；三索引 + roadmap（M6 G5）回写。
- [x] 拓扑排序页正文点出应用（课程先修 / 构建依赖 / 电子表格）+ 有环则无拓扑序 + 复习队列/图互链。

## 开放问题

- 无天然柱数组 → array:[]（BarsView 隐藏，C-047 已实现）。
- 步粒度：每点 selectNode（取入度 0，activeNode 环）+ removeNode（输出 + 后继减度）；6 点 ×2 + init + done ≈ 14 步。
- tiebreak：多个入度 0 时取**最小下标**（确定化，便于测试断言）；正文说明「任一入度 0 点都可，这里固定取最小下标」。

## 变更历史

- 2026-07-03：创建。M6 图算法 G5——拓扑排序（Kahn）。**零改动复用 C-047 GraphView 有向轨（第 5 消费者）**：nodeBadge=入度、doneNodes=已输出。新建非平凡 DAG。唯一 additive types +TopoExecPoint。补齐图算法三大范式（最短路/MST/拓扑）。新页 + 路由/菜单/首页接线 + TC-HOOK（图算法 4→5）。编号 051。按 skip-visual-confirmation 直接进文档+TDD。
