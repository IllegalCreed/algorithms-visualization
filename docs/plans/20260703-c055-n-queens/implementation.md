# 实现记录：N 皇后（C-20260703-055，回溯大类首发）

> Status: verified
> Stable ID: C-20260703-055
> Owner: IllegalCreed
> Created: 2026-07-03
> Last reviewed: 2026-07-03
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 BoardView**：types.ts +BoardTrack/Step.board?/NQueensExecPoint；AlgorithmPlayer +`<BoardView v-if>`；先 BoardView.spec（TC-VIZ-BOARDVIEW-01..04）+ AlgorithmPlayer.spec（TC-PLAYER-BOARD-01/02）跑红 → BoardView.vue 跑绿。
2. **T1 module + oracle + sources**（L3）：先 queens.module.spec（TC-QUEENS-MOD-01..12）跑红 → queens.{ts,sources.ts,module.ts}（回溯重走）跑绿。
3. **T2 新页 + 开新大类**：Queens.vue（Article + AlgorithmPlayer）；路由 /docs/n-queens；菜单 + 首页 +「回溯与搜索」大类（新 queens.svg）；改 TC-HOOK-01-1/02-1（分类 4→5）；Queens.spec + n-queens.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + HOOK 文案、roadmap 回溯大类首发）→ 两提交 → 双轨部署。

## 关键实现笔记

- **T0 新建第 9 条 BoardView 轨**：types.ts +`BoardTrack`（n/queens/tryCell/conflictCells）+ `Step.board?` + `NQueensExecPoint`；AlgorithmPlayer +import + `<BoardView v-if="current.board">`（同既有 8 轨可插拔模式，既有轨零改动）。`BoardView.vue` 用 CSS grid 渲染 n×n 交错棋盘（`(row+col)%2` 深/浅）+ 皇后 ♛（`queens[col]===row`）+ `.bc-try`（尝试格琥珀环）/`.bc-conflict`（冲突皇后红）。TC-VIZ-BOARDVIEW 4 + TC-PLAYER-BOARD 2。
- **T1 module + oracle + sources**：`queens.ts`（N=4 + 回溯 oracle `queensTrace` 求首解 [1,3,0,2]）+ `queens.sources.ts`（4 语言 N 皇后回溯）+ `queens.module.ts`（逐列回溯细粒度重走：init 空盘、每行 tryConflict〈冲突，conflictCells 红〉/place〈不冲突放下〉、失败 backtrack〈撤子〉、满盘 solved）。约 **32 步**（init 1 + tryConflict 18 + place 8 + backtrack 4 + solved 1）。
- **T2 新页 + 开新大类**：Queens.vue（Article 正文：N 皇后/回溯试探-剪枝-回退/决策树 DFS/应用〈数独·排列·迷宫〉 + AlgorithmPlayer）；路由 `/docs/n-queens`；**菜单 + 首页各加第 5 顶层大类「回溯与搜索」**（首项 N 皇后，新 `queens.svg`：交错棋盘 + 皇后棋子）；改 TC-HOOK-01-1/02-1（顶层分类 4→5 + 回溯断言）。

### 坑点

- 无坑。BoardView 4 + queens.module 12 首跑即绿；回溯 module 用「place 放子 → 递归失败则 backtrack 撤子」结构，backtrack 步撤掉刚放的皇后（板面减 1），首解 [1,3,0,2] 与 oracle 一致。
- **播放器可插拔轨达 9 条**：Bars/Aux/Stack/Tree/Count/Bucket/Graph/Matrix/**Board**。AlgorithmPlayer 仅 additive 加一行 v-if，既有 8 轨 + 8 算法页（6 图 + 2 DP）+ 15 排序 + 15 结构零改动全绿。棋盘原语通用，后续回溯题（数独/排列/迷宫）可复用或借鉴。

## 自测报告

- **门禁**：`pnpm format:check` ✓ / `lint:check` ✓（0 error）/ `type-check` ✓。
- **单测**：150 文件 **1074 passed**（+21：BoardView 4 + 播放器接棋盘轨 2 + queens.module 12 + Queens 视图 3；TC-HOOK 2 处改）；覆盖率 **Stmt 94.15% / Branch 93.02% / Func 94.29% / Line 94.92%**。既有 8 轨零改动。
- **e2e**：Playwright **47 passed**（+1 TC-E2E-QUEENS-01）。
- **真机自检**（Playwright 脚本，`/docs/n-queens`）：
  - 首步——16 格、**8 深格（交错棋盘）**、counter `1/32`、无 `.bars-view`、0 皇后、Shiki **178 token**。
  - 步 4（B 列试第 2 行冲突）——**tryCell 琥珀 1 + conflictCell 红 1**、字幕「第 B 列试第 2 行：与已放皇后冲突（红），换下一行」。
  - 末步——counter `32/32`、**4 个 ♛（解 [1,3,0,2]，两两不攻击）**、字幕「找到一个解」。
- **零回归**：既有 8 轨 + 6 图算法 + 2 DP + 15 排序 + 15 结构 Case 全绿。

## 变更历史

- 2026-07-03：创建（draft）。
- 2026-07-03：交付完成，翻 verified。T0 新建第 9 条 BoardView 棋盘轨（types +BoardTrack/Step.board?/NQueensExecPoint + AlgorithmPlayer +v-if；BoardView.vue + 6 Case）+ T1 queens.module（逐列回溯 32 步）+ T2 新页 Queens.vue + **开「回溯与搜索」第 5 顶层大类** + 路由/菜单/首页接线 + TC-HOOK（分类 4→5）。**新棋盘原语为回溯题铺路**。门禁全绿（单测 1074 / e2e 47 / 覆盖率 94.15%）；真机首解 [1,3,0,2]、冲突红显、32 步无误。**M6 回溯与搜索大类首发达成。**
