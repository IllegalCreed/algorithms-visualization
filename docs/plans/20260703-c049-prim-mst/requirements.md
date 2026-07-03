# 需求：Prim 最小生成树（新图算法页，复用 GraphView 轨，与 Kruskal 配对）

> Status: verified
> Stable ID: C-20260703-049
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；GraphView 第 3 消费者，与 Kruskal 同图配对）
> Replaces: none
> Replaced by: none
> Related plans: roadmap **M6 图算法分类扩充**（G7）；**C-048 Kruskal（同为 MST，本页与之配对「同图两策略」）**；C-047（建 GraphView 通用轨——本页零改动复用）；C-038 Kruskal 原页 / C-022 图数据结构 / B2 并查集
> Related tests: 计划新增 `TC-PRIM-MOD-*`（prim.module）/ `TC-VIEW-PRIM-01/02/03`（Prim 页）/ `TC-E2E-PRIM-01`（e2e）；**修改** `TC-HOOK-01-1`（Home）+ `TC-HOOK-02-1`（Menu）（图算法 2→3、新增 Prim）

> ⚠️ 编号：全局计数到 048；本变更为 **C-20260703-049**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M6 图算法分类扩充**：图算法大类已有 Dijkstra（最短路，C-037/047）+ Kruskal（MST，C-038/048）。本变更加 **Prim**——最小生成树的**另一种策略**，与 Kruskal 配对「**同一张图、两种建 MST 思路**」（呼应项目「同一问题多解对照」的教学取向，如归并两种驱动、快排三变体）。
- **复用 M8 基础设施**：Prim 直接走全模板（Article 正文 + AlgorithmPlayer + GraphView 图轨），**零改动复用 C-047 建的 GraphView 无向图轨**（Kruskal 已验证无向消费）。这是 GraphView 通用轨的第三个消费者。

## 三个地基决策

1. **复用 useKruskal 同一张图**：Prim 与 Kruskal 用**同一张固定图**（useKruskal 的 6 点 9 边无向带权图）——MST 结果相同（边集 {AC,BC,BD,DE,DF}、总权 18），但**构造顺序不同**：Kruskal 按权全局选边 + 并查集判环；Prim 从起点 A **生长**，每轮选「一端在树内、一端在树外」的最小横切边。同图对照最能凸显两策略差异。不新建图数据。
2. **零框架改动复用 GraphView 轨**：Prim 用无向图（`directed:false` 无箭头）+ `doneNodes`（树内点绿）+ `edgeClass`（树边 'mst' 绿 + 当前选中横切边 'current' 黄）——全部 C-047/048 已就位。唯一 additive：`types.ts` +`PrimExecPoint`（纯追加零回归）。
3. **新页面全模板 + 接线**：新建 Prim.vue（Article 正文 + AlgorithmPlayer）+ 路由 `prim` + 菜单图算法项 + 首页网格项 + 新图标 prim.svg。图算法分类 2→3 项，改 TC-HOOK。

## 要做什么

1. **框架扩展**（`player/types.ts`，additive）：+`PrimExecPoint`（`'init'|'selectEdge'|'addVertex'|'done'`）。GraphView/AlgorithmPlayer/Step 零改动。
2. **算法模块**（`src/algorithms/prim.module.ts` + `prim.ts` oracle + `prim.sources.ts` 4 语言）：复用 useKruskal 图，从 A 生长，产出 Step<PrimExecPoint>[]（array:[] + graph 无向轨含 edgeClass mst/current + doneNodes 树内点 + vars 树/权重表）。
3. **新页面**（`src/views/Article/Algorithm/Prim.vue`）：Article 正文（什么是 MST 补 Prim 视角 / Prim 怎么做 / Prim vs Kruskal 对照 / 在哪里用）+ AlgorithmPlayer。
4. **接线**：路由 `/docs/prim`（name='prim'）；`Docs/Menu/hooks.ts` 图算法 +Prim；`Home/Main/hooks.ts` 首页网格 +Prim（新 prim.svg 图标）。
5. **TC-HOOK**：TC-HOOK-01-1（Home）+ TC-HOOK-02-1（Menu）图算法 children 2→3、url 加 'prim'。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case）、roadmap（M6 图算法 G7）。

## 不做什么（边界）

- **不改 GraphView.vue / AlgorithmPlayer.vue / Step 类型 / Dijkstra / Kruskal 逻辑**（纯复用）。
- **不改 useKruskal 图数据 / 算法**（复用其图）；不改 15 排序 / 15 结构 / 其它图算法。
- **不做可调图 / 交互建图 / 堆优化 Prim 的优先队列可视化**：固定图、朴素选最小横切边，主线呈现。

## 业务规则 / 约束

- **数据**：复用 useKruskal 固定图。Prim 从 A 起，MST 边集 {AC,BC,BD,DE,DF}、总权 18（与 Kruskal 同集，序不同：AC→BC→BD→DE→DF）。
- **可视化**：GraphView 无向图（树内点 doneNodes 绿 + 当前横切边 current 黄 + 树边 mst 绿）+ vars（树内点 / 已选边数 / MST 权重）；无 nodeBadge。
- **向后兼容硬约束**：PrimExecPoint 追加；GraphView/AlgorithmPlayer/Step 零改动 → 既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + Kruskal + 播放器现有 Case 零改动通过。仅 TC-HOOK-01-1/02-1 因菜单加项而改（图算法 3 项）。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] Prim 页 `/docs/prim`：**正文 + 交互可视化（GraphView 图轨）+ 多语言代码播放器**三件齐全。真机三件同屏。
- [x] **互动**：单步看到——从 A 起，每轮选最小横切边（黄）加入树、新点变绿，末步 MST=5 绿边 + 总权 18；构造顺序 AC→BC→BD→DE→DF（与 Kruskal 同集不同序）。真机首步 doneNodes=1（仅 A）、末步 5 mst + 6 点全绿 + 字幕「总权 18」。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 157 Shiki token、无箭头（无向）。
- [x] **零回归**：既有 15 排序 + 7 轨 + 15 结构 + Dijkstra + Kruskal + 播放器各轨全绿；GraphView/AlgorithmPlayer 零改动。单测 970 绿、e2e 41 绿。
- [x] 图算法菜单/首页 3 项（Dijkstra/Kruskal/Prim），TC-HOOK-01-1/02-1 更新；新 prim.svg 图标；三索引 + roadmap（M6 G7）回写。
- [x] Prim 页正文与 Kruskal 互链「同图两策略」对照（Prim vs Kruskal 小节 + Callout）。

## 开放问题

- Prim 无天然柱数组 → array:[]（BarsView 隐藏，C-047 已实现）；无向无 dist → 不设 nodeBadge。
- 步粒度：每轮 selectEdge（选最小横切边，current 黄）+ addVertex（加入树，绿）；5 轮 + init + done = ~12 步（Prim 无 reject，每次必加）。
- 起点选 A（与 useKruskal 源一致的直觉起点）。

## 变更历史

- 2026-07-03：创建。M6 图算法 G7——Prim 最小生成树。**零改动复用 C-047 GraphView 无向轨**（第 3 消费者）+ 复用 useKruskal 同一张图与 Kruskal 配对「同图两策略」。唯一 additive types +PrimExecPoint。新页面 + 路由/菜单/首页接线 + TC-HOOK（图算法 2→3）。编号 049。按 skip-visual-confirmation 直接进文档+TDD。
