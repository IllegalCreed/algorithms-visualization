// src/algorithms/queens.ts
// N 皇后固定 N + 回溯 oracle（第一个解）。回溯与搜索大类首发（C-055）。

export const QUEENS_N = 4;

/** 逐列回溯求第一个解，返回 queens[col]=row（[1,3,0,2]） */
export function queensTrace(): number[] {
  const n = QUEENS_N;
  const queens: number[] = Array(n).fill(-1);
  const safe = (row: number, col: number): boolean => {
    for (let c = 0; c < col; c++) {
      const r = queens[c];
      if (r === row || Math.abs(r - row) === Math.abs(c - col)) return false;
    }
    return true;
  };
  const solve = (col: number): boolean => {
    if (col === n) return true;
    for (let row = 0; row < n; row++) {
      if (safe(row, col)) {
        queens[col] = row;
        if (solve(col + 1)) return true;
        queens[col] = -1;
      }
    }
    return false;
  };
  solve(0);
  return [...queens];
}
