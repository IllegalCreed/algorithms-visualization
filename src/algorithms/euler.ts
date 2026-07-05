// src/algorithms/euler.ts —— 欧拉路径 Hierholzer oracle（C-105）：栈法轨迹 + 暴力回溯搜路对拍
export const EULER_N = 5;
/** 固定 5 节点 7 边无向图（度数 [2,3,4,3,2]，奇度 {1,3}）；输入序决定贪心走向，保证「中途卡住再走子环」剧情 */
export const EULER_EDGES: [number, number][] = [
  [1, 3],
  [3, 4],
  [4, 2],
  [2, 3],
  [2, 1],
  [1, 0],
  [0, 2],
];

export type EulerEvent =
  | { type: 'walk'; from: number; to: number; eid: number; stack: number[] }
  | { type: 'back'; node: number; stack: number[]; path: number[] };

export interface EulerTrace {
  deg: number[];
  odd: number[];
  start: number;
  events: EulerEvent[];
  path: number[];
}

/** Hierholzer 栈法：沿未用边走（消边压栈），卡住弹栈进路径，栈空后反转 */
export function eulerTrace(): EulerTrace {
  const adj: { v: number; eid: number }[][] = Array.from({ length: EULER_N }, () => []);
  EULER_EDGES.forEach(([u, v], i) => {
    adj[u].push({ v, eid: i });
    adj[v].push({ v: u, eid: i });
  });
  const deg = adj.map((a) => a.length);
  const odd: number[] = [];
  for (let u = 0; u < EULER_N; u++) if (deg[u] % 2 === 1) odd.push(u);
  const start = odd.length ? odd[0] : 0;

  const used = new Array(EULER_EDGES.length).fill(false);
  const stack = [start];
  const path: number[] = [];
  const events: EulerEvent[] = [];
  while (stack.length) {
    const u = stack[stack.length - 1];
    const next = adj[u].find((e) => !used[e.eid]);
    if (next) {
      used[next.eid] = true;
      stack.push(next.v);
      events.push({ type: 'walk', from: u, to: next.v, eid: next.eid, stack: [...stack] });
    } else {
      stack.pop();
      path.push(u);
      events.push({ type: 'back', node: u, stack: [...stack], path: [...path] });
    }
  }
  path.reverse();
  return { deg, odd, start, events, path };
}

/** 验证器：n+1 个点、相邻两点是边、7 边各用一次 */
export function isValidEulerPath(p: number[]): boolean {
  if (p.length !== EULER_EDGES.length + 1) return false;
  const used = new Set<number>();
  for (let i = 0; i + 1 < p.length; i++) {
    const a = p[i];
    const b = p[i + 1];
    const eid = EULER_EDGES.findIndex(
      ([x, y], j) => !used.has(j) && ((x === a && y === b) || (x === b && y === a)),
    );
    if (eid < 0) return false;
    used.add(eid);
  }
  return used.size === EULER_EDGES.length;
}

/** 独立真值：从奇度点起回溯搜一条「7 边各走一次」的路径（与栈法完全不同的搜索方式） */
export function bruteEulerPath(): number[] {
  const m = EULER_EDGES.length;
  const deg = new Array(EULER_N).fill(0);
  EULER_EDGES.forEach(([u, v]) => {
    deg[u]++;
    deg[v]++;
  });
  const odd: number[] = [];
  for (let u = 0; u < EULER_N; u++) if (deg[u] % 2 === 1) odd.push(u);
  const starts = odd.length ? odd : [0];

  const used = new Array(m).fill(false);
  const path: number[] = [];
  const dfs = (u: number, cnt: number): boolean => {
    path.push(u);
    if (cnt === m) return true;
    for (let i = 0; i < m; i++) {
      if (used[i]) continue;
      const [x, y] = EULER_EDGES[i];
      const v = x === u ? y : y === u ? x : -1;
      if (v < 0) continue;
      used[i] = true;
      if (dfs(v, cnt + 1)) return true;
      used[i] = false;
    }
    path.pop();
    return false;
  };
  for (const s of starts) {
    if (dfs(s, 0)) return path;
    path.length = 0;
  }
  return [];
}
