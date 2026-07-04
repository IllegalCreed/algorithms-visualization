// src/algorithms/astar.ts
// A* 寻路 oracle。回溯与搜索第 9 页（C-096，纯复用 MazeView——letters 作 f 值标注）。
// 4×6、L 墙 (1,2),(2,2)、S=(1,0)、G=(2,5)：扩展 10 格（BFS 可达 22），路径 8 步 = BFS 最短。

export const AS_ROWS = 4;
export const AS_COLS = 6;
export const AS_WALLS: [number, number][] = [
  [1, 2],
  [2, 2],
];
export const AS_START: [number, number] = [1, 0];
export const AS_GOAL: [number, number] = [2, 5];

const DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const key = (r: number, c: number): string => `${r},${c}`;
const isWall = (r: number, c: number): boolean => AS_WALLS.some(([wr, wc]) => wr === r && wc === c);
const inGrid = (r: number, c: number): boolean => r >= 0 && r < AS_ROWS && c >= 0 && c < AS_COLS;

/** 曼哈顿距离启发（4 向网格下可采纳：绝不高估）。 */
export function manhattan(r: number, c: number): number {
  return Math.abs(r - AS_GOAL[0]) + Math.abs(c - AS_GOAL[1]);
}

export interface AsOpened {
  cell: [number, number];
  g: number;
  h: number;
  f: number;
}

export interface AsExpansion {
  cell: [number, number]; // 本次弹出（f 最小）
  g: number;
  h: number;
  f: number;
  opened: AsOpened[]; // 本次新开/松弛的邻居
}

export interface AsTrace {
  expansions: AsExpansion[]; // 含最后弹出终点那次
  path: [number, number][]; // S..G 最优路径
}

/** A*：优先队列按 (f, h, r, c) 弹出（全确定）；返回扩展序与回溯路径。 */
export function astarTrace(): AsTrace {
  type QE = { f: number; h: number; r: number; c: number };
  const open: QE[] = [];
  const g = new Map<string, number>();
  const parent = new Map<string, [number, number]>();
  const closed = new Set<string>();
  const expansions: AsExpansion[] = [];

  const push = (r: number, c: number): void => {
    const h = manhattan(r, c);
    open.push({ f: g.get(key(r, c))! + h, h, r, c });
  };
  g.set(key(...AS_START), 0);
  push(...AS_START);

  while (open.length) {
    open.sort((a, b) => a.f - b.f || a.h - b.h || a.r - b.r || a.c - b.c);
    const e = open.shift()!;
    if (closed.has(key(e.r, e.c))) continue;
    closed.add(key(e.r, e.c));
    const cur: AsExpansion = {
      cell: [e.r, e.c],
      g: g.get(key(e.r, e.c))!,
      h: e.h,
      f: e.f,
      opened: [],
    };
    expansions.push(cur);
    if (e.r === AS_GOAL[0] && e.c === AS_GOAL[1]) break;
    for (const [dr, dc] of DIRS) {
      const nr = e.r + dr;
      const nc = e.c + dc;
      if (!inGrid(nr, nc) || isWall(nr, nc) || closed.has(key(nr, nc))) continue;
      const ng = cur.g + 1;
      const old = g.get(key(nr, nc));
      if (old === undefined || ng < old) {
        g.set(key(nr, nc), ng);
        parent.set(key(nr, nc), [e.r, e.c]);
        push(nr, nc);
        cur.opened.push({ cell: [nr, nc], g: ng, h: manhattan(nr, nc), f: ng + manhattan(nr, nc) });
      }
    }
  }

  const path: [number, number][] = [AS_GOAL];
  let cur: [number, number] = AS_GOAL;
  while (key(...cur) !== key(...AS_START)) {
    cur = parent.get(key(...cur))!;
    path.push(cur);
  }
  path.reverse();
  return { expansions, path };
}

/** BFS 独立真值：最短步数与可达格数（A* 最优性与「省」的对拍基准）。 */
export function bfsInfo(): { shortest: number; reachable: number } {
  const dist = new Map<string, number>([[key(...AS_START), 0]]);
  const queue: [number, number][] = [AS_START];
  while (queue.length) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (inGrid(nr, nc) && !isWall(nr, nc) && !dist.has(key(nr, nc))) {
        dist.set(key(nr, nc), dist.get(key(r, c))! + 1);
        queue.push([nr, nc]);
      }
    }
  }
  return { shortest: dist.get(key(...AS_GOAL))!, reachable: dist.size };
}
