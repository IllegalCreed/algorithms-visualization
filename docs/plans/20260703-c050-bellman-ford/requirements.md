# 需求：Bellman-Ford 最短路（新图算法页，含负权，复用 GraphView 轨，与 Dijkstra 配对）

> Status: verified
> Stable ID: C-20260703-050
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；GraphView 第 4 消费者，与 Dijkstra 配对最短路）
> Replaces: none
> Replaced by: none
> Related plans: roadmap **M6 图算法分类扩充**（G3）；**C-047 Dijkstra（同为单源最短路，本页与之配对「正权贪心 vs 负权松弛」）**；C-047 建的 GraphView 通用轨（本页第 4 消费者零改动复用）；C-049 Prim（同期图算法配对样板）
> Related tests: 计划新增 `TC-BELLMAN-MOD-*`（module）/ `TC-VIEW-BELLMAN-01/02/03`（页）/ `TC-E2E-BELLMAN-01`（e2e）；**修改** `TC-HOOK-01-1`（Home）+ `TC-HOOK-02-1`（Menu）（图算法 3→4、新增 bellman-ford）

> ⚠️ 编号：全局计数到 049；本变更为 **C-20260703-050**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M6 图算法分类扩充**：图算法大类已有 Dijkstra（最短路，C-037/047）、Kruskal（MST，C-038/048）、Prim（MST，C-049）。本变更加 **Bellman-Ford**——最短路的**另一算法**，与 Dijkstra 配对「同为单源最短路，两种思路」。
- **教学点**：Dijkstra 贪心取最近点、要求**边权非负**；Bellman-Ford **反复松弛所有边 V−1 轮**，能处理**负权边**（Dijkstra 处理不了的场景）。配对呈现最能凸显「为什么需要两个算法」。
- **复用 M8 基础设施**：直接走全模板（Article 正文 + AlgorithmPlayer + GraphView 图轨），**零改动复用 C-047 的 GraphView 有向图轨**（Dijkstra 已验证有向消费）。GraphView 通用轨第 4 消费者。

## 三个地基决策

1. **新建含负权固定有向图**：Dijkstra 复用的 useDijkstra 图全为正权，无法体现 Bellman-Ford 价值。本变更**新建**一张固定有向图（5 点 A–E、7 边，含 **B→C=−3、D→E=−2** 两条负权边，**无负环**），源 A。图数据放 `bellman-ford.ts`（模块 + oracle 共用），不引入 useXxx 组件（GraphView 已是可视化载体）。
2. **边序"逆序"演示 V−1 轮**：edges 顺序刻意让「远端边」排在「近端边」前，使松弛按轮次逐步向外传播——需走满 **V−1=4 轮**才收敛（终态 dist=[0,4,1,3,1]）。直观展示 Bellman-Ford「每轮盲扫所有边、经 V−1 轮必收敛」的本质（不同于 Dijkstra 一次定一点）。
3. **零框架改动复用 GraphView 轨**：有向图（`directed:true` 带箭头）+ `nodeBadge`（dist）+ `edgeClass`（当前松弛边 'current' 黄 + 末步最短路树 'tree' 绿）——全部 C-047 已就位。唯一 additive：`types.ts` +`BellmanFordExecPoint`。

## 要做什么

1. **框架扩展**（`player/types.ts`，additive）：+`BellmanFordExecPoint`（`'init'|'roundStart'|'relaxUpdate'|'relaxSkip'|'done'`）。GraphView/AlgorithmPlayer/Step 零改动。
2. **算法模块**（`src/algorithms/bellman-ford.module.ts` + `bellman-ford.ts`〈图数据 + oracle〉 + `bellman-ford.sources.ts` 4 语言）：init → V−1 轮逐边松弛（当前边黄 + dist 徽标更新）→ done（最短路树绿）。约 34 步。
3. **新页面**（`src/views/Article/Algorithm/Bellman.vue`）：Article 正文（什么是负权最短路 / Bellman-Ford 怎么做 / 为何 V−1 轮 / Dijkstra vs Bellman-Ford + 负环检测一句）+ AlgorithmPlayer。
4. **接线**：路由 `/docs/bellman-ford`（name='bellman-ford'）；菜单图算法 +Bellman-Ford；首页网格 +Bellman-Ford（新 bellman.svg 图标）。
5. **TC-HOOK**：TC-HOOK-01-1（Home）+ TC-HOOK-02-1（Menu）图算法 children 3→4、url 加 'bellman-ford'。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case + HOOK 文案）、roadmap（M6 图算法 G3）。

## 不做什么（边界）

- **不改 GraphView.vue / AlgorithmPlayer.vue / Step 类型 / Dijkstra / Kruskal / Prim**（纯复用）。
- **不做负环检测的完整可视化**（正文一句带过：第 V 轮还能松弛即存在负环）；不做可调图 / 交互建图。
- 固定图、朴素逐边松弛，主线呈现。

## 业务规则 / 约束

- **数据**：新建固定有向图，源 A，含负权边（B→C=−3、D→E=−2），无负环。终态 dist=[0,4,1,3,1]，最短路树 {A→B,B→C,C→D,D→E}。
- **可视化**：GraphView 有向图（nodeBadge dist + 当前松弛边 current 黄 + 末步最短路树 tree 绿）+ vars（轮次 k / 当前边 / 本轮是否有更新 / dist 表）。
- **向后兼容硬约束**：BellmanFordExecPoint 追加；GraphView/AlgorithmPlayer/Step 零改动 → 既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + Kruskal + Prim + 播放器现有 Case 零改动通过。仅 TC-HOOK-01-1/02-1 因菜单加项而改（图算法 4 项）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] Bellman-Ford 页 `/docs/bellman-ford`：**正文 + 交互可视化（GraphView 图轨）+ 多语言代码播放器**三件齐全。真机三件同屏。
- [x] **互动**：单步看到——init dist[A]=0 余 ∞、每轮逐边松弛（当前边黄 + dist 徽标下降）、需走满 V−1=4 轮收敛、末步最短路树（绿边）+ dist 终值 [0,4,1,3,1]；含负权边 −3/−2。真机首步权重含 -2/-3、末步徽标 [0,4,1,3,1] + 4 树边 + 5 点全绿。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 94 Shiki token、有箭头（有向）。
- [x] **零回归**：既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + Kruskal + Prim + 播放器各轨全绿；GraphView/AlgorithmPlayer 零改动。单测 985 绿、e2e 42 绿。
- [x] 图算法菜单/首页 4 项，TC-HOOK-01-1/02-1 更新；新 bellman.svg；三索引 + roadmap（M6 G3）回写。
- [x] Bellman-Ford 页正文与 Dijkstra 互链「正权贪心 vs 负权松弛」对照（Dijkstra vs Bellman-Ford 小节 + Callout）。

## 开放问题

- 无天然柱数组 → array:[]（BarsView 隐藏，C-047 已实现）。
- 步粒度：每边一步（relaxUpdate/relaxSkip，当前边高亮 current）+ 每轮 roundStart 标记；V−1=4 轮 × 7 边 + 轮标 + init + done ≈ 34 步。
- 负权边视觉：GraphView 边权标签直接显示负数（如 −3），无需新样式（零改动）。

## 变更历史

- 2026-07-03：创建。M6 图算法 G3——Bellman-Ford 最短路。**零改动复用 C-047 GraphView 有向轨（第 4 消费者）**+ 新建含负权固定图与 Dijkstra 配对「正权贪心 vs 负权松弛」。唯一 additive types +BellmanFordExecPoint。边序逆序演示 V−1 轮收敛。新页 + 路由/菜单/首页接线 + TC-HOOK（图算法 3→4）。编号 050。按 skip-visual-confirmation 直接进文档+TDD。
