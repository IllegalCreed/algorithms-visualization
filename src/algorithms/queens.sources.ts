import type { LangSource, NQueensExecPoint } from '@/components/player/types';

const ts = `function solveNQueens(n: number): number[] {
  const queens: number[] = Array(n).fill(-1);
  const safe = (row: number, col: number): boolean => {
    for (let c = 0; c < col; c++)
      if (queens[c] === row ||
          Math.abs(queens[c] - row) === Math.abs(c - col))
        return false;
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
  return queens;
}`;

const python = `def solve_n_queens(n):
    queens = [-1] * n
    def safe(row, col):
        for c in range(col):
            if queens[c] == row or \\
               abs(queens[c] - row) == abs(c - col):
                return False
        return True
    def solve(col):
        if col == n:
            return True
        for row in range(n):
            if safe(row, col):
                queens[col] = row
                if solve(col + 1):
                    return True
                queens[col] = -1
        return False
    solve(0)
    return queens`;

const go = `func solveNQueens(n int) []int {
\tqueens := make([]int, n)
\tfor i := range queens {
\t\tqueens[i] = -1
\t}
\tsafe := func(row, col int) bool {
\t\tfor c := 0; c < col; c++ {
\t\t\tif queens[c] == row ||
\t\t\t\tabs(queens[c]-row) == abs(c-col) {
\t\t\t\treturn false
\t\t\t}
\t\t}
\t\treturn true
\t}
\tvar solve func(col int) bool
\tsolve = func(col int) bool {
\t\tif col == n {
\t\t\treturn true
\t\t}
\t\tfor row := 0; row < n; row++ {
\t\t\tif safe(row, col) {
\t\t\t\tqueens[col] = row
\t\t\t\tif solve(col + 1) {
\t\t\t\t\treturn true
\t\t\t\t}
\t\t\t\tqueens[col] = -1
\t\t\t}
\t\t}
\t\treturn false
\t}
\tsolve(0)
\treturn queens
}`;

const rust = `fn solve_n_queens(n: usize) -> Vec<i32> {
    let mut queens = vec![-1i32; n];
    fn safe(queens: &[i32], row: i32, col: usize) -> bool {
        for c in 0..col {
            if queens[c] == row
                || (queens[c] - row).abs() == (c as i32 - col as i32).abs() {
                return false;
            }
        }
        true
    }
    fn solve(queens: &mut Vec<i32>, n: usize, col: usize) -> bool {
        if col == n {
            return true;
        }
        for row in 0..n as i32 {
            if safe(queens, row, col) {
                queens[col] = row;
                if solve(queens, n, col + 1) {
                    return true;
                }
                queens[col] = -1;
            }
        }
        false
    }
    solve(&mut queens, n, 0);
    queens
}`;

export const queensSources: LangSource<NQueensExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 2, tryConflict: 6, place: 14, backtrack: 16, solved: 11 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, tryConflict: 6, place: 14, backtrack: 17, solved: 11 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, tryConflict: 9, place: 22, backtrack: 26, solved: 18 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, tryConflict: 6, place: 18, backtrack: 22, solved: 14 },
  },
];
