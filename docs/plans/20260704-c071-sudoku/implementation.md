# 实现记录：数独（C-20260704-071，约束回溯 · 新建 SudokuView）

> Status: verified
> Stable ID: C-20260704-071
> Owner: IllegalCreed
> Created: 2026-07-04
> Last reviewed: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> Test cases: ./test-cases.md

## 实现顺序（TDD：每步先红后绿）

1. **T0 新轨 + 类型 + 接线**（L4）：types.ts +`SudokuTrack`/`SudokuExecPoint`/`Step.sudoku?`；先 SudokuView.spec + AlgorithmPlayer.spec 追加跑红 → 新建 SudokuView.vue（n×n + 宫线 + given/current/reject/place 态）+ AlgorithmPlayer 接线跑绿。
2. **T1 module + oracle + sources**（L3）：先 sudoku.module.spec（TC-SDK-MOD-01..12）跑红 → sudoku.{ts,sources.ts,module.ts}（约束检查 + 回溯）跑绿。
3. **T2 新页 + 接线**：Sudoku.vue；路由 /docs/sudoku；菜单 + 首页「回溯与搜索」第 8 项（新 sudoku.svg）；改 TC-HOOK（回溯 children +sudoku）；Sudoku.spec + sudoku.e2e。
4. 全门禁 → 真机自检 → 回写（三索引新 Case + roadmap 回溯棋盘约束第 2 例）→ 两提交 → 双轨部署。

## 关键实现笔记

- **新建第 14 条 SudokuView 数独轨（additive 可插拔）**：CSS grid 渲染 n×n，`bx-t`/`bx-l` 在第 box 行/列加粗宫线；`sk-given` 给定加粗、`sk-current` 当前格琥珀环、`sk-reject` 冲突红、`sk-place` 填入绿；空当前格显示 `tryNum`。AlgorithmPlayer +import + 一行 `<SudokuView v-if="current.sudoku">`，其它算法不设 `Step.sudoku` → 不渲染，零回归。
- **约束回溯逐事件重走**：内部数值盘 work（0=空），DFS 按行列序找空格试 1..n：`sudokuValid`（行/列/宫无 v）→ `place`（填入、绿、下探）；冲突 → `reject`（红、换下一个）；递归失败回退时 `grid[r][c]=0` → `backtrack`（撤销、清空该格）。固定 4×4 迷你数独 5 空唯一解 → 22 步含 **2 次真回溯**〔(2,1) 先填 1 走到 (2,3) 死路 → 撤销 (2,2)、(2,1) → 改填 (2,1)=3〕。oracle `sudokuSolution()` 独立回溯对拍。
- **四语言 sources**：TS/Python/Go/Rust 标准数独回溯（isValid + solve），lineMap 对齐 init/reject/place/backtrack/done。

## 自测报告

- **门禁**：`format:check` ✓ / `lint:check` ✓ / `type-check` ✓ / `test:unit run --coverage` **1351/1351 全绿**、聚合 statements 95.25% · branches 94.76%；`sudoku.*`/`SudokuView.vue` 覆盖良好。
- **e2e（真机 Playwright/Chromium）**：`sudoku` + 回归 `n-queens` **2/2 通过**——4×4=16 格、无柱数组、Shiki、拖末步 16 格全填 + 字幕含完成。
- **真机视觉自检（1 图眼验）**：第 12/22 步——(2,2) 琥珀环（刚撤销 4 变空）、给定加粗（11 格）、宫线分隔四宫、字幕「(2,2) 填 4 后走不通：撤销、回退」；末步 22/22——终盘 1234/3412/2341/4123（= oracle）、16 格全填、字幕「数独完成」。
- **回归**：SudokuView 为新增独立轨；N 皇后/子集/排列/组合总和/迷宫/岛屿/单词搜索及所有既有算法零回归；仅 TC-HOOK（回溯 children）追加 sudoku；播放器可插拔轨 13→14。

## 变更历史

- 2026-07-04：创建（draft）。
- 2026-07-04：交付验收（draft → verified）。回填关键笔记 + 自测报告；21 Case + 改 2 HOOK 全绿、双轨部署。
