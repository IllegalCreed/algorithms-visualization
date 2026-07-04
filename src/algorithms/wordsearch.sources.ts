import type { LangSource, WordSearchExecPoint } from '@/components/player/types';

const ts = `function exist(board: string[][], word: string): boolean {
  const R = board.length, C = board[0].length;
  const dfs = (r: number, c: number, k: number): boolean => {
    if (board[r][c] !== word[k]) return false;      // 字母不符
    if (k === word.length - 1) return true;         // 拼完 → 命中
    const tmp = board[r][c]; board[r][c] = '#';      // 标记已用（防复用）
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C &&
          dfs(nr, nc, k + 1)) { board[r][c] = tmp; return true; }
    }
    board[r][c] = tmp;                              // 撤销标记，回溯
    return false;
  };
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (dfs(r, c, 0)) return true;                // 从每个格子尝试起点
  return false;
}`;

const python = `def exist(board, word):
    R, C = len(board), len(board[0])
    def dfs(r, c, k):
        if board[r][c] != word[k]:            # 字母不符
            return False
        if k == len(word) - 1:                # 拼完 → 命中
            return True
        tmp = board[r][c]; board[r][c] = '#'   # 标记已用（防复用）
        for dr, dc in ((-1,0),(1,0),(0,-1),(0,1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and dfs(nr, nc, k + 1):
                board[r][c] = tmp; return True
        board[r][c] = tmp                     # 撤销标记，回溯
        return False
    for r in range(R):
        for c in range(C):
            if dfs(r, c, 0):                  # 从每个格子尝试起点
                return True
    return False`;

const go = `func exist(board [][]byte, word string) bool {
\tR, C := len(board), len(board[0])
\tvar dfs func(r, c, k int) bool
\tdfs = func(r, c, k int) bool {
\t\tif board[r][c] != word[k] { // 字母不符
\t\t\treturn false
\t\t}
\t\tif k == len(word)-1 { // 拼完 → 命中
\t\t\treturn true
\t\t}
\t\ttmp := board[r][c]; board[r][c] = '#' // 标记已用
\t\tdirs := [4][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}
\t\tfor _, d := range dirs {
\t\t\tnr, nc := r+d[0], c+d[1]
\t\t\tif nr >= 0 && nr < R && nc >= 0 && nc < C && dfs(nr, nc, k+1) {
\t\t\t\tboard[r][c] = tmp; return true
\t\t\t}
\t\t}
\t\tboard[r][c] = tmp // 撤销标记，回溯
\t\treturn false
\t}
\tfor r := 0; r < R; r++ {
\t\tfor c := 0; c < C; c++ {
\t\t\tif dfs(r, c, 0) { // 从每个格子尝试起点
\t\t\t\treturn true
\t\t\t}
\t\t}
\t}
\treturn false
}`;

const rust = `fn exist(board: &mut Vec<Vec<char>>, word: &str) -> bool {
    let (rr, cc) = (board.len() as i32, board[0].len() as i32);
    let w: Vec<char> = word.chars().collect();
    fn dfs(b: &mut Vec<Vec<char>>, r: i32, c: i32, k: usize, w: &[char], rr: i32, cc: i32) -> bool {
        if b[r as usize][c as usize] != w[k] { return false; } // 字母不符
        if k == w.len() - 1 { return true; }                   // 拼完 → 命中
        let tmp = b[r as usize][c as usize];
        b[r as usize][c as usize] = '#';                       // 标记已用
        for (dr, dc) in [(-1, 0), (1, 0), (0, -1), (0, 1)] {
            let (nr, nc) = (r + dr, c + dc);
            if nr >= 0 && nr < rr && nc >= 0 && nc < cc && dfs(b, nr, nc, k + 1, w, rr, cc) {
                b[r as usize][c as usize] = tmp; return true;
            }
        }
        b[r as usize][c as usize] = tmp; // 撤销标记，回溯
        false
    }
    for r in 0..rr {
        for c in 0..cc {
            if dfs(board, r, c, 0, &w, rr, cc) { return true; } // 从每个格子尝试起点
        }
    }
    false
}`;

export const wordSearchSources: LangSource<WordSearchExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 17, match: 10, mismatch: 4, backtrack: 12, found: 5 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 17, match: 11, mismatch: 4, backtrack: 13, found: 6 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 24, match: 15, mismatch: 5, backtrack: 19, found: 8 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 20, match: 11, mismatch: 5, backtrack: 15, found: 6 },
  },
];
