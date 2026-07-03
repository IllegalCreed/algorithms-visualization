// src/algorithms/bellman-ford.ts
// Bellman-Ford 固定含负权有向图（无负环）+ 纯逻辑 oracle。图数据供 module + oracle 共用。

export interface BFVertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface BFEdge {
  key: string; // `${from}-${to}`
  from: number;
  to: number;
  w: number;
}

const LABELS = ['A', 'B', 'C', 'D', 'E'];
const POS: [number, number][] = [
  [50, 150], // A 源，左
  [180, 60], // B 上
  [180, 240], // C 下
  [330, 60], // D 右上
  [330, 240], // E 右下
];

export const BF_VERTICES: BFVertex[] = LABELS.map((label, id) => ({
  id,
  label,
  x: POS[id][0],
  y: POS[id][1],
}));

// 边序刻意"逆序"（远端边在前），使松弛逐轮向外传播，需走满 V−1=4 轮。含负权 B→C=-3、D→E=-2，无负环。
const RAW: [number, number, number][] = [
  [3, 4, -2], // D→E
  [2, 3, 2], // C→D
  [2, 4, 4], // C→E
  [1, 2, -3], // B→C（负权）
  [1, 3, 6], // B→D
  [0, 1, 4], // A→B
  [0, 2, 5], // A→C
];
export const BF_EDGES: BFEdge[] = RAW.map(([from, to, w]) => ({
  key: `${from}-${to}`,
  from,
  to,
  w,
}));

export const BF_SOURCE = 0;

export interface BellmanFordTrace {
  dist: number[]; // 各点最短距离终值 [0,4,1,3,1]
  prev: (number | null)[]; // 最短路树前驱
}

export function bellmanFordTrace(): BellmanFordTrace {
  const n = BF_VERTICES.length;
  const dist = Array.from({ length: n }, () => Infinity);
  const prev: (number | null)[] = Array.from({ length: n }, () => null);
  dist[BF_SOURCE] = 0;
  for (let k = 0; k < n - 1; k++) {
    for (const e of BF_EDGES) {
      if (dist[e.from] + e.w < dist[e.to]) {
        dist[e.to] = dist[e.from] + e.w;
        prev[e.to] = e.from;
      }
    }
  }
  return { dist, prev };
}
