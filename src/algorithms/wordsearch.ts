// src/algorithms/wordsearch.ts
// 单词搜索固定网格 + 目标词 + DFS 回溯 oracle。回溯与搜索网格搜索第 3 页（C-068，复用 MazeView 字母网格轨）。

export const WORD_BOARD = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
];

export const WORD_TARGET = 'ADEE';

/** 四连通方向：上、下、左、右 */
export const WORD_DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const ROWS = WORD_BOARD.length;
const COLS = WORD_BOARD[0].length;
const key = (r: number, c: number) => r + ',' + c;

/** DFS 回溯求路径：命中返回路径（转换串上的格序列），未命中返回 null */
function search(): [number, number][] | null {
  const path: [number, number][] = [];
  const used = new Set<string>();
  const dfs = (r: number, c: number, k: number): boolean => {
    path.push([r, c]);
    used.add(key(r, c));
    if (k === WORD_TARGET.length - 1) return true;
    for (const [dr, dc] of WORD_DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < ROWS &&
        nc >= 0 &&
        nc < COLS &&
        !used.has(key(nr, nc)) &&
        WORD_BOARD[nr][nc] === WORD_TARGET[k + 1]
      ) {
        if (dfs(nr, nc, k + 1)) return true;
      }
    }
    path.pop();
    used.delete(key(r, c));
    return false;
  };
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (WORD_BOARD[r][c] === WORD_TARGET[0] && dfs(r, c, 0)) {
        return path.map((p) => [p[0], p[1]] as [number, number]);
      }
    }
  }
  return null;
}

/** 单词是否存在（oracle）。本例 ADEE → true */
export function wordExists(): boolean {
  return search() !== null;
}

/** 命中路径（oracle）。本例 → [[2,0],[2,1],[2,2],[2,3]]（底行 A→D→E→E） */
export function wordPath(): [number, number][] {
  return search() ?? [];
}
