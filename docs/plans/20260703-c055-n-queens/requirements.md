# 需求：N 皇后（开「回溯与搜索」新顶层大类，首发算法，新建 BoardView 棋盘轨）

> Status: verified
> Stable ID: C-20260703-055
> Type: feature
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Progress: 100%
> Blocked by: none
> Next action: 无（已交付；「回溯与搜索」大类开张，新建 BoardView 第 9 轨，后续回溯题可复用）
> Replaces: none
> Replaced by: none
> Related plans: roadmap **M6 算法分类扩充**（阶段一「回溯与搜索」大类首发）；C-006 播放器框架（新增第 9 条 BoardView 轨）；C-047 GraphView / C-052 MatrixView（同为「新大类首发顺带建共用可视化」样板）
> Related tests: 计划新增 `TC-VIZ-BOARDVIEW-*`（BoardView 新轨）/ `TC-PLAYER-BOARD-*`（播放器接棋盘轨）/ `TC-QUEENS-MOD-*`（queens.module）/ `TC-VIEW-QUEENS-01/02/03`（页）/ `TC-E2E-QUEENS-01`（e2e）；**修改** `TC-HOOK-01-1`/`TC-HOOK-02-1`（顶层分类 4→5、新增「回溯与搜索」大类）

> ⚠️ 编号：全局计数到 054；本变更为 **C-20260703-055**（开工三查：index.md 无占用、docs/plans/ 无目录、git 同步）。

## 背景

- **M6 算法分类扩充**：已有数据结构 / 排序 / 图算法 / 动态规划四大类。本变更开**第 5 个顶层大类「回溯与搜索」**——全站缺失的大算法范式：**递归试探 + 剪枝 + 回溯**。首发 **N 皇后**：在 N×N 棋盘上放 N 个皇后，使两两不在同行、同列、同对角线。
- **教学点**：逐列放皇后，每列从上到下试每一行；能放（不与已放皇后冲突）就放下并递归下一列；一列无处可放就<strong>回溯</strong>——退回上一列、挪动那里的皇后再试。这是「深度优先搜索 + 约束剪枝」的经典范例。
- **新可视化原语**：图算法用 GraphView、DP 用 MatrixView，回溯需展示<strong>棋盘 + 放置/冲突/回溯</strong>过程——本变更新建 **BoardView 棋盘轨**（第 9 条轨）。**该轨为后续回溯题（数独、排列组合、迷宫）铺路**。

## 三个地基决策

1. **开「回溯与搜索」新顶层大类**：`Docs/Menu/hooks.ts` + `Home/Main/hooks.ts` 各加第 5 个顶层分类「回溯与搜索」（首项 N 皇后）。顶层分类数 4→5，改 TC-HOOK-01-1/02-1（新增分类断言）。页归 `views/Article/Algorithm/`。
2. **新建 BoardView 棋盘轨（第 9 轨，additive）**：`AlgorithmPlayer` 加 `<BoardView v-if="current.board">`（同既有 8 轨可插拔模式，零回归）。`BoardTrack` 字段：n（棋盘大小）、queens（每列皇后所在行，null=未放）、tryCell（当前尝试格，琥珀环）、conflictCells（与之冲突的已放皇后，红）。棋盘棋格交错着色、皇后用 ♛。Queens 无柱数组 → array:[]（BarsView 已可选）。
3. **固定 N=4 回溯重走**：4×4 棋盘、逐列试探求**第一个解** queens=[1,3,0,2]（列→行）。init（空盘）→ 每次 tryConflict（试某格但冲突，红显冲突皇后）/ place（不冲突放下）→ 一列穷尽则 backtrack（退列挪皇后）→ solved（4 皇后全放好）。约 32 步。

## 要做什么

1. **框架扩展**（`player/types.ts` + `AlgorithmPlayer.vue` + 新 `BoardView.vue`，additive）：+`BoardTrack`/`Step.board?`/`NQueensExecPoint`；`<BoardView v-if>`。补 `TC-VIZ-BOARDVIEW-*` + `TC-PLAYER-BOARD-*`。
2. **算法模块**（`src/algorithms/queens.module.ts` + `queens.ts`〈N + oracle 首解〉 + `queens.sources.ts` 4 语言）：回溯重走。约 32 步。
3. **新页面**（`src/views/Article/Algorithm/Queens.vue`）：Article 正文（什么是 N 皇后 / 回溯怎么做〈试探-剪枝-回溯〉/ 为什么能剪枝 / 应用〈约束满足、数独、排列〉）+ AlgorithmPlayer。
4. **新大类接线**：路由 `/docs/n-queens`（name='n-queens'）；菜单 + 首页各加「回溯与搜索」大类 + N 皇后项（新 queens.svg 图标）。
5. **TC-HOOK**：TC-HOOK-01-1/02-1 顶层分类 4→5、新增「回溯与搜索」分类含 n-queens。
6. **测试与文档**：L3/L4/L5；回写三索引（新 Case）、roadmap（回溯大类首发）。

## 不做什么（边界）

- **不改 GraphView / MatrixView / 图算法 / DP / 15 排序 / 15 结构**（BoardView 纯新增轨）。
- **不做全部解枚举 / 决策树完整可视化 / 可调 N**（只求第一个解、棋盘视图；决策树留待后续）。
- 固定 N=4，主线呈现回溯过程。

## 业务规则 / 约束

- **数据**：N=4，逐列求第一个解 queens=[1,3,0,2]（列 0→行 1、列 1→行 3、列 2→行 0、列 3→行 2）。
- **可视化**：BoardView（4×4 交错棋格 + 已放皇后 ♛ + 当前尝试格 tryCell 琥珀 + 冲突皇后 conflictCells 红）+ vars（当前列/尝试行、已放皇后、状态）。
- **向后兼容硬约束**：BoardTrack/Step.board?/NQueensExecPoint 追加；`<BoardView v-if>` 可插拔 → 既有 8 轨 + 6 图算法 + 2 DP + 15 排序 + 15 结构零改动通过。仅 TC-HOOK-01-1/02-1 因新增顶层分类而改。
- 沿用 pnpm / ESLint / Prettier / type-check 门禁；覆盖率门槛（聚合 ≥70%/≥60%）。
- 提交直接落 `main`；信息中文，结尾带 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`。
- 发版双轨：push Pages + 手动 deploy.sh 自域名。
- 缺陷修复铁律：先写失败用例，再改代码，再验证。

## 验收口径

- [x] N 皇后页 `/docs/n-queens`：**正文 + 交互可视化（BoardView 棋盘）+ 多语言代码播放器**三件齐全。真机三件同屏。
- [x] **互动**：单步看到——空盘、逐列试探（琥珀格）、冲突（红显冲突皇后）、放下（♛）、无处可放则回溯（退列挪皇后）、末步 4 皇后互不攻击的解 [1,3,0,2]。真机 32 步、步 4 冲突红显、末步 4 ♛ 解 [1,3,0,2]。
- [x] 代码播放器 4 语言（ts/python/go/rust）随执行点同步高亮。真机首步 178 Shiki token。
- [x] **零回归**：既有 8 轨 + 6 图算法 + 2 DP + 15 排序 + 15 结构全绿；新增 BoardView 纯 additive。单测 1074 绿、e2e 47 绿。
- [x] **新增「回溯与搜索」顶层大类**（菜单 + 首页），TC-HOOK-01-1/02-1 更新（分类 4→5）；新 queens.svg；三索引 + roadmap 回写。
- [x] BoardView 为通用棋盘轨（n / queens / tryCell / conflictCells），**后续回溯题（数独/排列/迷宫）可复用或借鉴**。

## 开放问题

- 无天然柱数组 → array:[]（BarsView 隐藏）。
- 步粒度：init + 每次试探一步（tryConflict/place）+ 回溯一步 + solved ≈ 32 步（N=4 首解）。
- 只求第一个解（避免步数爆炸）；正文说明「继续回溯可枚举全部解」。

## 变更历史

- 2026-07-03：创建。开「回溯与搜索」第 5 顶层大类，首发 N 皇后（N=4）。**新建第 9 条 BoardView 棋盘轨**（通用棋盘原语，为回溯题铺路）+ 固定 4×4 回溯重走求首解 [1,3,0,2] + 4 语言 sources。唯一新轨 additive（可插拔，零回归）。新页 + 新大类接线 + TC-HOOK（分类 4→5）。编号 055。按 skip-visual-confirmation 直接进文档+TDD。
