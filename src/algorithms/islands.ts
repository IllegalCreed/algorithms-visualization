// src/algorithms/islands.ts
// 岛屿数量固定网格 + 四连通 Flood Fill oracle。回溯与搜索网格搜索第 2 页（C-066，复用 MazeView 轨）。
// 1 = 陆地，0 = 水；四连通的陆地为一个岛。

export const ISLAND_GRID = [
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 0, 1],
  [1, 0, 0, 0],
];

/** 四连通方向：上、下、左、右 */
export const ISLAND_DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/** DFS Flood Fill 数四连通陆地块个数（oracle）。本网格 = 3 个岛。 */
export function islandCount(): number {
  const rows = ISLAND_GRID.length;
  const cols = ISLAND_GRID[0].length;
  const seen = Array.from({ length: rows }, () => Array<boolean>(cols).fill(false));
  const flood = (r: number, c: number): void => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (ISLAND_GRID[r][c] === 0 || seen[r][c]) return;
    seen[r][c] = true;
    for (const [dr, dc] of ISLAND_DIRS) flood(r + dr, c + dc);
  };
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (ISLAND_GRID[r][c] === 1 && !seen[r][c]) {
        count++;
        flood(r, c);
      }
    }
  }
  return count;
}
