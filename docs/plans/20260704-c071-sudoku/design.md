# 设计：数独（C-20260704-071，约束回溯 · 新建 SudokuView）

> Status: verified
> Stable ID: C-20260704-071
> Owner: IllegalCreed
> Created: 2026-07-04
> Requirements: ./requirements.md
> Test cases: ./test-cases.md
> Implementation: ./implementation.md

## 总体思路

新建第 14 条播放器轨 SudokuView（数独轨），additive 可插拔。数独用「试填 + 约束检查 + 回溯」逐步重走，产出 `Step<SudokuExecPoint>`。

## T0：类型 + SudokuView + 播放器接线

`types.ts`：

```ts
export interface SudokuTrack {
  n: number; // 4
  box: number; // 2（宫边长 = √n）
  given: boolean[][]; // 是否初始给定（加粗、不可改）
  grid: (number | null)[][]; // 当前填充（null=空）
  current?: [number, number] | null; // 当前格（琥珀环）
  tryNum?: number | null; // 当前试填的数字
  status?: 'reject' | 'place' | 'backtrack' | null; // 当前动作 → 红/绿/退
  solved?: boolean;
}

export type SudokuExecPoint = 'init' | 'reject' | 'place' | 'backtrack' | 'done';
```

`Step` +`sudoku?: SudokuTrack`。`SudokuView.vue`：CSS grid 渲染 `n×n`，每 `box` 格加粗宫线；给定格 `sk-given`（粗）、当前格 `sk-current`（琥珀环）、`reject` 红、`place` 绿。`AlgorithmPlayer.vue` +import + `<SudokuView v-if="current.sudoku">`。

## T1：oracle + module + sources

`sudoku.ts`（固定 4×4）：

```ts
export const SUDOKU_N = 4;
export const SUDOKU_BOX = 2;
export const SUDOKU_PUZZLE = [[0,2,3,4],[3,4,1,2],[2,0,0,0],[4,0,2,3]]; // 0=空
export function sudokuSolution(): number[][] { … } // [[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]]
```

`sudoku.module.ts`：`buildSudokuSteps(): Step<SudokuExecPoint>[]`

- `init`：展示初始盘（given 加粗、空格空）。
- 按行列序找空格，试 `v=1..n`：`valid(r,c,v)`（行/列/宫无 v）→ `place`（填 v、绿）递归下一个；否则 `reject`（红、换下一个 v）；一格 1..n 都不行 → `backtrack`（撤销**上一个填入**、清空该格、回退）。
- `done`：`solved=true`，caption 给终盘。5 个空格、约 **22 步**含 **2 次 backtrack**（(2,1) 先填 1 走死路、回退改填 3）。`vars`：盘尺寸、当前格、试填数、已填空格数。

`sudoku.sources.ts`：TS/Python/Go/Rust 四语言标准数独回溯（`isValid` + `solve`），`lineMap` 覆盖 init/reject/place/backtrack/done。

## T2：页面 + 接线

`Sudoku.vue`：`Article` 正文（标题「数独」+ 副标「回溯与搜索 · 约束满足」）：讲清行/列/宫三重约束、试填-冲突-回退、与 N 皇后（放置型）对照（填数型）；`<AlgorithmPlayer :module="sudokuModule" />`；结语点出约束传播（MRV/位运算）为进阶。

接线：路由 `/docs/sudoku`；菜单 + 首页「回溯与搜索」children **第 8 项**（末尾）；新 `sudoku.svg`；改 `TC-HOOK`（回溯 children +sudoku）。

## 复用与零回归

- 新增 SudokuView 独立轨，其它算法 `Step.sudoku` 未设即不渲染 → 零回归；AlgorithmPlayer 仅加一行 `v-if`。

## 变更历史

- 2026-07-04：创建（draft → approved）。新建 SudokuView 数独轨（第 14 轨）；固定 4×4 迷你数独 5 空、22 步含 2 回溯，与 N 皇后互补。
- 2026-07-04：交付验收（approved → verified）。实现与设计一致：SudokuView n×n + 宫线 + given/current/reject/place 态；sudoku.module 约束回溯逐事件 22 步含 2 backtrack，oracle sudokuSolution()=[[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]]；4 语言 sources lineMap 对齐 init/reject/place/backtrack/done；AlgorithmPlayer 加一行 v-if 零回归。
