import type { LangSource, SudokuExecPoint } from '@/components/player/types';

const ts = `function solveSudoku(grid: number[][], n: number, box: number): boolean {
  const valid = (r: number, c: number, v: number): boolean => {
    for (let i = 0; i < n; i++)
      if (grid[r][i] === v || grid[i][c] === v) return false;
    const br = Math.floor(r / box) * box, bc = Math.floor(c / box) * box;
    for (let i = br; i < br + box; i++)
      for (let j = bc; j < bc + box; j++)
        if (grid[i][j] === v) return false;
    return true;
  };
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 0) {              // 找到一个空格
        for (let v = 1; v <= n; v++) {
          if (valid(r, c, v)) {            // 合法 → 填；不合法 → 换下一个
            grid[r][c] = v;                // 填入
            if (solveSudoku(grid, n, box)) return true;
            grid[r][c] = 0;                // 走不通 → 撤销、回退
          }
        }
        return false;                      // 1..n 都填不了 → 死路
      }
  return true;                             // 无空格 → 完成
}`;

const python = `def solve(grid, n, box):
    def valid(r, c, v):
        for i in range(n):
            if grid[r][i] == v or grid[i][c] == v:
                return False
        br, bc = (r // box) * box, (c // box) * box
        for i in range(br, br + box):
            for j in range(bc, bc + box):
                if grid[i][j] == v: return False
        return True
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 0:            # 空格
                for v in range(1, n + 1):
                    if valid(r, c, v):     # 合法 → 填 / 换
                        grid[r][c] = v     # 填入
                        if solve(grid, n, box): return True
                        grid[r][c] = 0     # 撤销、回退
                return False               # 死路
    return True                            # 完成`;

const go = `func solve(grid [][]int, n, box int) bool {
\tvalid := func(r, c, v int) bool {
\t\tfor i := 0; i < n; i++ {
\t\t\tif grid[r][i] == v || grid[i][c] == v { return false }
\t\t}
\t\tbr, bc := (r/box)*box, (c/box)*box
\t\tfor i := br; i < br+box; i++ {
\t\t\tfor j := bc; j < bc+box; j++ {
\t\t\t\tif grid[i][j] == v { return false }
\t\t\t}
\t\t}
\t\treturn true
\t}
\tfor r := 0; r < n; r++ {
\t\tfor c := 0; c < n; c++ {
\t\t\tif grid[r][c] == 0 { // 空格
\t\t\t\tfor v := 1; v <= n; v++ {
\t\t\t\t\tif valid(r, c, v) { // 合法 → 填 / 换
\t\t\t\t\t\tgrid[r][c] = v // 填入
\t\t\t\t\t\tif solve(grid, n, box) { return true }
\t\t\t\t\t\tgrid[r][c] = 0 // 撤销、回退
\t\t\t\t\t}
\t\t\t\t}
\t\t\t\treturn false // 死路
\t\t\t}
\t\t}
\t}
\treturn true // 完成
}`;

const rust = `fn solve(grid: &mut Vec<Vec<i32>>, n: usize, b: usize) -> bool {
    fn valid(grid: &Vec<Vec<i32>>, r: usize, c: usize, v: i32, n: usize, b: usize) -> bool {
        for i in 0..n {
            if grid[r][i] == v || grid[i][c] == v { return false; }
        }
        let (br, bc) = ((r / b) * b, (c / b) * b);
        for i in br..br + b {
            for j in bc..bc + b {
                if grid[i][j] == v { return false; }
            }
        }
        true
    }
    for r in 0..n {
        for c in 0..n {
            if grid[r][c] == 0 { // 空格
                for v in 1..=n as i32 {
                    if valid(grid, r, c, v, n, b) { // 合法 → 填 / 换
                        grid[r][c] = v; // 填入
                        if solve(grid, n, b) { return true; }
                        grid[r][c] = 0; // 撤销、回退
                    }
                }
                return false; // 死路
            }
        }
    }
    true // 完成
}`;

export const sudokuSources: LangSource<SudokuExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 13, reject: 15, place: 16, backtrack: 18, done: 23 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 13, reject: 15, place: 16, backtrack: 18, done: 20 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 16, reject: 18, place: 19, backtrack: 21, done: 28 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 16, reject: 18, place: 19, backtrack: 21, done: 28 },
  },
];
