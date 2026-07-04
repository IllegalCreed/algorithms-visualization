// src/algorithms/maxflow.ts
// 最大流 Ford-Fulkerson 固定实例 + 残量网络 + 增广路 + 最小割 oracle。图算法第 9 页（C-076，复用 GraphView）。
// s→a:3 s→b:3 a→b:1 a→t:3 b→t:3；4 轮增广（末轮反向边 b→a），最大流 6 = 最小割 {s}|{a,b,t}。

export const MF_S = 0;
export const MF_T = 3;

/** s/a/b/t 菱形布局（viewBox 460×300） */
export const MF_VERTS = [
  { id: 0, label: 's', x: 60, y: 150 },
  { id: 1, label: 'a', x: 230, y: 70 },
  { id: 2, label: 'b', x: 230, y: 230 },
  { id: 3, label: 't', x: 400, y: 150 },
];

/** 原始有向边 + 容量 */
export const MF_EDGES: { from: number; to: number; cap: number }[] = [
  { from: 0, to: 1, cap: 3 }, // s→a
  { from: 0, to: 2, cap: 3 }, // s→b
  { from: 1, to: 2, cap: 1 }, // a→b（贪心陷阱中间边）
  { from: 1, to: 3, cap: 3 }, // a→t
  { from: 2, to: 3, cap: 3 }, // b→t
];

/** 残量图邻居探索序（固定，故意让 a 先探 b 制造贪心陷阱 → 末轮反向边 b→a 反悔） */
const NBR: Record<number, number[]> = {
  0: [1, 2],
  1: [2, 3, 0],
  2: [3, 1, 0],
  3: [1, 2],
};

export interface Augment {
  path: number[];
  bottleneck: number;
  reverse: [number, number][]; // 该路径中反向经过的原边（以「原边 from→to」表示）
}

const key = (u: number, v: number): string => `${u}-${v}`;

/** Ford-Fulkerson（DFS 找增广路）：返回最大流值 + 逐轮增广 + 最小割。 */
export function maxFlow(): {
  value: number;
  rounds: Augment[];
  minCutS: number[];
  cutEdges: [number, number][];
} {
  const n = MF_VERTS.length;
  // 残量容量
  const cap: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const orig = new Set<string>();
  for (const e of MF_EDGES) {
    cap[e.from][e.to] += e.cap;
    orig.add(key(e.from, e.to));
  }

  const rounds: Augment[] = [];
  let value = 0;

  for (;;) {
    // DFS 按固定邻居序找一条增广路
    const parent = new Array<number>(n).fill(-1);
    const visited = new Array<boolean>(n).fill(false);
    visited[MF_S] = true;
    const dfs = (u: number): boolean => {
      if (u === MF_T) return true;
      for (const v of NBR[u]) {
        if (!visited[v] && cap[u][v] > 0) {
          visited[v] = true;
          parent[v] = u;
          if (dfs(v)) return true;
        }
      }
      return false;
    };
    if (!dfs(MF_S)) break;

    // 回溯路径
    const path: number[] = [];
    for (let v = MF_T; v !== -1; v = parent[v]) path.push(v);
    path.reverse();

    let bottleneck = Infinity;
    for (let i = 0; i + 1 < path.length; i++)
      bottleneck = Math.min(bottleneck, cap[path[i]][path[i + 1]]);

    const reverse: [number, number][] = [];
    for (let i = 0; i + 1 < path.length; i++) {
      const u = path[i];
      const v = path[i + 1];
      if (!orig.has(key(u, v))) reverse.push([v, u]); // 反向经过原边 v→u
      cap[u][v] -= bottleneck;
      cap[v][u] += bottleneck;
    }
    value += bottleneck;
    rounds.push({ path, bottleneck, reverse });
  }

  // 最小割：残量图中 S 可达集
  const reachable = new Array<boolean>(n).fill(false);
  const stack = [MF_S];
  reachable[MF_S] = true;
  while (stack.length) {
    const u = stack.pop() as number;
    for (const v of NBR[u]) {
      if (!reachable[v] && cap[u][v] > 0) {
        reachable[v] = true;
        stack.push(v);
      }
    }
  }
  const minCutS: number[] = [];
  for (let i = 0; i < n; i++) if (reachable[i]) minCutS.push(i);
  const cutEdges: [number, number][] = MF_EDGES.filter(
    (e) => reachable[e.from] && !reachable[e.to],
  ).map((e) => [e.from, e.to]);

  return { value, rounds, minCutS, cutEdges };
}
