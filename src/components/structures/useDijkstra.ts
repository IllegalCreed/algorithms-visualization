/** 固定带权有向图 + Dijkstra 单源最短路（源 A=0），纯逻辑可单测 */
export interface DVertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface DEdge {
  from: number;
  to: number;
  w: number;
}
export interface DijkstraStep {
  justSettled: number | null; // 本步确定的点（step0 为 null）
  settled: number[]; // 到本步为止已确定的点（按确定顺序）
  dist: number[]; // 距离表快照（Infinity 表示不可达）
  relaxed: DEdge[]; // 本步成功松弛（降低 dist）的边
}
export interface DijkstraResult {
  order: number[];
  dist: number[];
  prev: (number | null)[];
  steps: DijkstraStep[];
}
export interface UseDijkstra {
  vertices: DVertex[];
  edges: DEdge[];
  adj: DEdge[][];
  source: number;
  run: () => DijkstraResult;
  pathTo: (v: number) => number[];
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
// 布局坐标：A 左中、B/D 上、C/E 下、F 右中（让最短路大致左→右展开）
const POS: [number, number][] = [
  [50, 150],
  [160, 70],
  [160, 230],
  [290, 70],
  [290, 230],
  [410, 150],
];
// 9 条有向带权边
const EDGES: DEdge[] = [
  { from: 0, to: 1, w: 4 },
  { from: 0, to: 2, w: 1 },
  { from: 2, to: 1, w: 2 },
  { from: 2, to: 3, w: 5 },
  { from: 1, to: 3, w: 1 },
  { from: 1, to: 4, w: 7 },
  { from: 3, to: 4, w: 3 },
  { from: 3, to: 5, w: 6 },
  { from: 4, to: 5, w: 2 },
];
const SOURCE = 0;

export function useDijkstra(): UseDijkstra {
  const vertices: DVertex[] = LABELS.map((label, id) => ({
    id,
    label,
    x: POS[id][0],
    y: POS[id][1],
  }));
  // 出边邻接表
  const adj: DEdge[][] = vertices.map((v) => EDGES.filter((e) => e.from === v.id));

  const run = (): DijkstraResult => {
    const n = vertices.length;
    const dist = Array.from({ length: n }, () => Infinity);
    const prev: (number | null)[] = Array.from({ length: n }, () => null);
    const done = Array.from({ length: n }, () => false);
    const order: number[] = [];
    dist[SOURCE] = 0;

    const steps: DijkstraStep[] = [
      { justSettled: null, settled: [], dist: [...dist], relaxed: [] },
    ];

    for (let k = 0; k < n; k++) {
      // 取未确定中 dist 最小的点
      let u = -1;
      for (let i = 0; i < n; i++) {
        if (!done[i] && dist[i] !== Infinity && (u === -1 || dist[i] < dist[u])) u = i;
      }
      if (u === -1) break; // 余下不可达
      done[u] = true;
      order.push(u);
      // 松弛出边
      const relaxed: DEdge[] = [];
      for (const e of adj[u]) {
        if (dist[u] + e.w < dist[e.to]) {
          dist[e.to] = dist[u] + e.w;
          prev[e.to] = u;
          relaxed.push(e);
        }
      }
      steps.push({ justSettled: u, settled: [...order], dist: [...dist], relaxed });
    }

    return { order, dist, prev, steps };
  };

  const pathTo = (v: number): number[] => {
    const { prev } = run();
    const path: number[] = [];
    let cur: number | null = v;
    while (cur !== null) {
      path.unshift(cur);
      cur = prev[cur];
    }
    return path;
  };

  return { vertices, edges: EDGES, adj, source: SOURCE, run, pathTo };
}
