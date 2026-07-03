import type { LangSource, MazeExecPoint } from '@/components/player/types';

const ts = `function solveMaze(grid: number[][], sr: number, sc: number, gr: number, gc: number) {
  const visited = new Set<string>();
  const path: [number, number][] = [];
  const dfs = (r: number, c: number): boolean => {
    const key = r + ',' + c;
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return false;
    if (grid[r][c] === 1 || visited.has(key)) return false; // 墙 / 已访问
    visited.add(key);
    path.push([r, c]);                     // 走到 (r,c)
    if (r === gr && c === gc) return true;  // 到达终点
    for (const [dr, dc] of [[1,0],[0,1],[-1,0],[0,-1]]) { // 四个方向
      if (dfs(r + dr, c + dc)) return true;
    }
    path.pop();                             // 死路 → 回溯，退回上一格
    return false;
  };
  dfs(sr, sc);
  return path;
}`;

const python = `def solve_maze(grid, sr, sc, gr, gc):
    visited = set()
    path = []
    def dfs(r, c):
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]):
            return False
        if grid[r][c] == 1 or (r, c) in visited:   # 墙 / 已访问
            return False
        visited.add((r, c))
        path.append((r, c))                     # 走到 (r,c)
        if r == gr and c == gc:                 # 到达终点
            return True
        for dr, dc in ((1,0),(0,1),(-1,0),(0,-1)): # 四个方向
            if dfs(r + dr, c + dc):
                return True
        path.pop()                              # 死路 → 回溯
        return False
    dfs(sr, sc)
    return path`;

const go = `func solveMaze(grid [][]int, sr, sc, gr, gc int) [][2]int {
\tvisited := map[[2]int]bool{}
\tpath := [][2]int{}
\tvar dfs func(r, c int) bool
\tdfs = func(r, c int) bool {
\t\tif r < 0 || r >= len(grid) || c < 0 || c >= len(grid[0]) {
\t\t\treturn false
\t\t}
\t\tif grid[r][c] == 1 || visited[[2]int{r, c}] { // 墙 / 已访问
\t\t\treturn false
\t\t}
\t\tvisited[[2]int{r, c}] = true
\t\tpath = append(path, [2]int{r, c})       // 走到 (r,c)
\t\tif r == gr && c == gc {                  // 到达终点
\t\t\treturn true
\t\t}
\t\tfor _, d := range [][2]int{{1,0},{0,1},{-1,0},{0,-1}} { // 四方向
\t\t\tif dfs(r+d[0], c+d[1]) {
\t\t\t\treturn true
\t\t\t}
\t\t}
\t\tpath = path[:len(path)-1]                // 死路 → 回溯
\t\treturn false
\t}
\tdfs(sr, sc)
\treturn path
}`;

const rust = `fn solve_maze(grid: &[Vec<i32>], sr: usize, sc: usize, gr: usize, gc: usize) -> Vec<(usize, usize)> {
    let mut visited = std::collections::HashSet::new();
    let mut path = Vec::new();
    fn dfs(grid: &[Vec<i32>], r: usize, c: usize, gr: usize, gc: usize,
           visited: &mut std::collections::HashSet<(usize, usize)>, path: &mut Vec<(usize, usize)>) -> bool {
        if grid[r][c] == 1 || visited.contains(&(r, c)) { // 墙 / 已访问
            return false;
        }
        visited.insert((r, c));
        path.push((r, c));                      // 走到 (r,c)
        if r == gr && c == gc {                  // 到达终点
            return true;
        }
        let dirs: [(i32, i32); 4] = [(1,0),(0,1),(-1,0),(0,-1)];
        for (dr, dc) in dirs {
            let nr = r as i32 + dr;
            let nc = c as i32 + dc;
            if nr >= 0 && nr < grid.len() as i32 && nc >= 0 && nc < grid[0].len() as i32
                && dfs(grid, nr as usize, nc as usize, gr, gc, visited, path) {
                return true;
            }
        }
        path.pop();                             // 死路 → 回溯
        return false;
    }
    dfs(grid, sr, sc, gr, gc, &mut visited, &mut path);
    path
}`;

export const mazeSources: LangSource<MazeExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 9, move: 9, deadend: 11, backtrack: 14, goal: 10, done: 18 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 10, move: 10, deadend: 13, backtrack: 16, goal: 11, done: 19 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 13, move: 13, deadend: 17, backtrack: 22, goal: 14, done: 26 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 10, move: 10, deadend: 15, backtrack: 23, goal: 11, done: 27 },
  },
];
