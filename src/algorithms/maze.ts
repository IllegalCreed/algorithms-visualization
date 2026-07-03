// src/algorithms/maze.ts
// 迷宫寻路固定网格 + DFS oracle。回溯与搜索大类第 5 页（C-059，网格搜索 MazeView 新轨）。

/** 0 = 通路，1 = 墙 */
export const MAZE_GRID: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

export const MAZE_START: [number, number] = [0, 0];
export const MAZE_GOAL: [number, number] = [4, 4];

/** DFS 四方向固定顺序：下、右、上、左 */
export const MAZE_DIRS: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

/** 纯 DFS 求一条 起点→终点 的路径（回溯），返回解路径格序列 */
export function mazeSolve(): [number, number][] {
  const rows = MAZE_GRID.length;
  const cols = MAZE_GRID[0].length;
  const visited = new Set<string>();
  const path: [number, number][] = [];
  const dfs = (r: number, c: number): boolean => {
    visited.add(r + ',' + c);
    path.push([r, c]);
    if (r === MAZE_GOAL[0] && c === MAZE_GOAL[1]) return true;
    for (const [dr, dc] of MAZE_DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        MAZE_GRID[nr][nc] === 0 &&
        !visited.has(nr + ',' + nc)
      ) {
        if (dfs(nr, nc)) return true;
      }
    }
    path.pop();
    return false;
  };
  dfs(MAZE_START[0], MAZE_START[1]);
  return path;
}
