# 测试用例：数独（C-20260704-071，约束回溯 · 新建 SudokuView）

> Status: verified
> Stable ID: C-20260704-071
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Design: ./design.md
> 适用层级：L3（sudoku.module）/ L4（SudokuView + 播放器接线 + Sudoku 页 + TC-HOOK）/ L5（e2e）
> 命名空间：新增 `TC-VIZ-SUDOKUVIEW-*`、`TC-PLAYER-SUDOKU-*`、`TC-SDK-MOD-*`、`TC-VIEW-SDK-*`、`TC-E2E-SDK-01`；**改** `TC-HOOK`（回溯 children）

## L4 —— `SudokuView` 数独轨（`src/components/SudokuView.spec.ts`，新增）

| 用例 ID              | 场景          | 期望                                                                   |
| -------------------- | ------------- | ---------------------------------------------------------------------- |
| TC-VIZ-SUDOKUVIEW-01 | 盘面渲染      | `n=4` → 16 `.sudoku-cell`；给定格数 = given 中 true 数量 → `.sk-given` |
| TC-VIZ-SUDOKUVIEW-02 | 当前格 + 试填 | `current=[2,1]`,`tryNum=3` → 1 `.sk-current`，该格显示 `3`             |
| TC-VIZ-SUDOKUVIEW-03 | 冲突/填入态   | `status='reject'` → 1 `.sk-reject`；`status='place'` → 1 `.sk-place`   |

## L4 —— 播放器接线（`src/components/player/AlgorithmPlayer.spec.ts`，追加）

| 用例 ID             | 场景           | 期望                                        |
| ------------------- | -------------- | ------------------------------------------- |
| TC-PLAYER-SUDOKU-01 | step 带 sudoku | 当前步含 `sudoku` → 渲染 `SudokuView`       |
| TC-PLAYER-SUDOKU-02 | 零回归         | 排序 step 无 `sudoku` → 不渲染 `SudokuView` |

## L3 —— `sudoku.module`（`src/algorithms/sudoku.module.spec.ts`）

固定 4×4 迷你数独（5 空）；oracle `sudokuSolution()`=`[[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]]`。

| 用例 ID       | 场景              | 期望                                                                          |
| ------------- | ----------------- | ----------------------------------------------------------------------------- |
| TC-SDK-MOD-01 | 末步 done + 终盘  | 末步 `done`、`sudoku.solved`；末步 `grid` 深等 `sudokuSolution()`             |
| TC-SDK-MOD-02 | 步合法 + 带数独轨 | 每步 `point ∈ {init,reject,place,backtrack,done}` 且带 `sudoku`、`array===[]` |
| TC-SDK-MOD-03 | 给定不变          | 每步给定格的值恒等于初始谜题（回溯不动 given）                                |
| TC-SDK-MOD-04 | 含真回溯          | `backtrack` 步数 ≥ 2（先填错、走死路、撤销回退）                              |
| TC-SDK-MOD-05 | place 合法        | 每个 `place` 步：填入的数在其行/列/宫内唯一（不与已填冲突）                   |
| TC-SDK-MOD-06 | reject 冲突       | 每个 `reject` 步：`tryNum` 与当前格所在行/列/宫的某个已填数相同（确有冲突）   |
| TC-SDK-MOD-07 | backtrack 清空    | 每个 `backtrack` 步该格 `grid` 被清空（变 null）且该格非给定                  |
| TC-SDK-MOD-08 | 每步盘面合法      | 每步 `grid` 已填部分满足行/列/宫无重复（合法中间态）                          |
| TC-SDK-MOD-09 | 终盘每空格已填    | 末步 `grid` 无 null，且每行/列/宫为 1..4 全排列                               |
| TC-SDK-MOD-10 | vars 展示         | 某步 vars 文本含盘尺寸 `4` 与当前格坐标                                       |
| TC-SDK-MOD-11 | 四语言 + 行号     | sources 含 ts/python/go/rust；每语言每 point 行号在源码行数内                 |
| TC-SDK-MOD-12 | module 元信息     | `title` 含「数独」；`initialInput()` = `[]`                                   |

## L4 —— `Sudoku` 视图（`src/views/Article/Algorithm/Sudoku.spec.ts`，新增）

| 用例 ID        | 场景          | 期望                                              |
| -------------- | ------------- | ------------------------------------------------- |
| TC-VIEW-SDK-01 | 正文 + 播放器 | 含 `Article`、含 `AlgorithmPlayer`                |
| TC-VIEW-SDK-02 | 数独轨        | h1 含「数独」；渲染 `SudokuView`；无 `.bars-view` |
| TC-VIEW-SDK-03 | 全模板同屏    | 正文含「回溯」+ SudokuView 同屏                   |

## L4 —— TC-HOOK（回溯与搜索第 8 项）

| 用例 ID | 改动                                                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-HOOK | Home + Menu：`data[4]` children url = `['n-queens','subsets','permutations','combination-sum','maze','number-of-islands','word-search','sudoku']` |

## L5 —— 数独页 e2e（`e2e/sudoku.e2e.ts`，新增）

| 用例 ID       | 场景          | 操作                                   | 期望                                                                                                                                                             |
| ------------- | ------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC-E2E-SDK-01 | 全模板 + 互动 | 访问 `/docs/sudoku`；`.scrub` 拖到末步 | 正文 `.article h1` 含「数独」；`.sudoku-view` 可见；16 `.sudoku-cell`；无 `.bars-view`；拖末步 16 格全有数字（0 空）+ caption 含「完成」/「解」；真机 Shiki 着色 |

## 回归

- 既有 13 轨 + 7 图算法 + 6 DP + 回溯 7 页 + 字符串 4 页 + 15 排序 + 15 结构现有 Case **零改动**全绿。
- **SudokuView 为新增独立轨**：其它算法不设 `Step.sudoku` → 不渲染，`TC-PLAYER-*` 既有断言与所有算法零回归；AlgorithmPlayer 仅加一行 `v-if`。
- TC-HOOK 其余不变；仅回溯 children 追加 `sudoku`。
- 覆盖率：聚合 statements/lines ≥70%、branches/functions 维持高位。

## 自测报告

- **执行**：`pnpm test:unit run --coverage` → **1351 用例全绿**；`pnpm exec playwright test sudoku n-queens` → **2/2 绿**。
- **本单新增 21 Case 全绿**：`TC-VIZ-SUDOKUVIEW-01..03`（L4）3 + `TC-PLAYER-SUDOKU-01/02`（L4）2 + `TC-SDK-MOD-01..12`（L3）12 + `TC-VIEW-SDK-01..03`（L4）3 + `TC-E2E-SDK-01`（L5）1；**改** `TC-HOOK`（回溯 children +sudoku）menu+home 各 1。
- **关键断言实测**：末步 solved + 终盘=sudokuSolution()（TC-SDK-MOD-01）；给定不变（TC-03）；含真回溯 backtrack≥2（TC-04）；place 合法/reject 冲突（TC-05/06）；backtrack 清空且非给定（TC-07）；每步盘面合法（TC-08）。
- **真机自检**：宫线/给定加粗、2 次回溯、终盘正确，与设计一致。
- **覆盖**：statements 95.25% / branches 94.76%，超门槛。

## 变更历史

- 2026-07-04：创建（draft → approved）。
- 2026-07-04：交付验收（approved → verified）。回填自测报告；21 Case + 改 2 HOOK 全绿。
