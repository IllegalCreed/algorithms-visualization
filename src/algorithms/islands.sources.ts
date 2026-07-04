import type { LangSource, IslandsExecPoint } from '@/components/player/types';

const ts = `function numIslands(grid: number[][]): number {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  const flood = (r: number, c: number): void => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] === 0) return;   // 水 / 已访问
    grid[r][c] = 0;                 // 标记为已访问（沉岛）
    flood(r - 1, c); flood(r + 1, c);
    flood(r, c - 1); flood(r, c + 1);
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {       // 命中新陆地
        count++;
        flood(r, c);
      }
    }
  }
  return count;
}`;

const python = `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    def flood(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] == 0:          # 水 / 已访问
            return
        grid[r][c] = 0               # 标记为已访问（沉岛）
        flood(r - 1, c); flood(r + 1, c)
        flood(r, c - 1); flood(r, c + 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:      # 命中新陆地
                count += 1
                flood(r, c)
    return count`;

const go = `func numIslands(grid [][]int) int {
\trows, cols := len(grid), len(grid[0])
\tcount := 0
\tvar flood func(r, c int)
\tflood = func(r, c int) {
\t\tif r < 0 || r >= rows || c < 0 || c >= cols {
\t\t\treturn
\t\t}
\t\tif grid[r][c] == 0 { // 水 / 已访问
\t\t\treturn
\t\t}
\t\tgrid[r][c] = 0 // 标记为已访问（沉岛）
\t\tflood(r-1, c); flood(r+1, c)
\t\tflood(r, c-1); flood(r, c+1)
\t}
\tfor r := 0; r < rows; r++ {
\t\tfor c := 0; c < cols; c++ {
\t\t\tif grid[r][c] == 1 { // 命中新陆地
\t\t\t\tcount++
\t\t\t\tflood(r, c)
\t\t\t}
\t\t}
\t}
\treturn count
}`;

const rust = `fn num_islands(grid: &mut Vec<Vec<i32>>) -> i32 {
    let (rows, cols) = (grid.len() as i32, grid[0].len() as i32);
    let mut count = 0;
    fn flood(g: &mut Vec<Vec<i32>>, r: i32, c: i32, rows: i32, cols: i32) {
        if r < 0 || r >= rows || c < 0 || c >= cols { return; }
        if g[r as usize][c as usize] == 0 { return; } // 水 / 已访问
        g[r as usize][c as usize] = 0;                // 标记为已访问（沉岛）
        flood(g, r - 1, c, rows, cols); flood(g, r + 1, c, rows, cols);
        flood(g, r, c - 1, rows, cols); flood(g, r, c + 1, rows, cols);
    }
    for r in 0..rows {
        for c in 0..cols {
            if grid[r as usize][c as usize] == 1 { // 命中新陆地
                count += 1;
                flood(grid, r, c, rows, cols);
            }
        }
    }
    count
}`;

export const islandsSources: LangSource<IslandsExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { scan: 12, found: 14, flood: 7, done: 19 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { scan: 13, found: 15, flood: 9, done: 17 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { scan: 17, found: 19, flood: 12, done: 24 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { scan: 12, found: 14, flood: 7, done: 19 },
  },
];
