// src/algorithms/sudoku.ts
// 数独固定 4×4 迷你谜题 + 约束回溯 oracle。回溯棋盘约束第 2 例（C-071，新建 SudokuView）。
// 0 = 空格；行/列/宫（2×2）内 1..4 不重复。

export const SUDOKU_N = 4;
export const SUDOKU_BOX = 2;

/** 固定 4×4 谜题（5 空、唯一解，回溯含 2 次真回退） */
export const SUDOKU_PUZZLE = [
  [0, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 0, 0, 0],
  [4, 0, 2, 3],
];

/** v 填在 (r,c) 是否合法：行/列/宫内无 v */
export function sudokuValid(grid: number[][], r: number, c: number, v: number): boolean {
  for (let i = 0; i < SUDOKU_N; i++) {
    if (grid[r][i] === v || grid[i][c] === v) return false;
  }
  const br = Math.floor(r / SUDOKU_BOX) * SUDOKU_BOX;
  const bc = Math.floor(c / SUDOKU_BOX) * SUDOKU_BOX;
  for (let i = br; i < br + SUDOKU_BOX; i++) {
    for (let j = bc; j < bc + SUDOKU_BOX; j++) {
      if (grid[i][j] === v) return false;
    }
  }
  return true;
}

/** 回溯解出终盘（oracle）。→ [[1,2,3,4],[3,4,1,2],[2,3,4,1],[4,1,2,3]] */
export function sudokuSolution(): number[][] {
  const grid = SUDOKU_PUZZLE.map((row) => [...row]);
  const blanks: [number, number][] = [];
  for (let r = 0; r < SUDOKU_N; r++)
    for (let c = 0; c < SUDOKU_N; c++) if (grid[r][c] === 0) blanks.push([r, c]);
  const dfs = (k: number): boolean => {
    if (k === blanks.length) return true;
    const [r, c] = blanks[k];
    for (let v = 1; v <= SUDOKU_N; v++) {
      if (sudokuValid(grid, r, c, v)) {
        grid[r][c] = v;
        if (dfs(k + 1)) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  };
  dfs(0);
  return grid;
}
