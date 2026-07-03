// src/algorithms/topo.ts
// 拓扑排序固定非平凡 DAG（6 点 7 边，无环）+ Kahn oracle。图数据供 module + oracle 共用。

export interface TopoVertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface TopoEdge {
  key: string; // `${from}-${to}`
  from: number;
  to: number;
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const POS: [number, number][] = [
  [200, 60], // A
  [200, 150], // B
  [60, 90], // C 源
  [200, 240], // D
  [60, 210], // E 源
  [380, 150], // F 汇
];

export const TOPO_VERTICES: TopoVertex[] = LABELS.map((label, id) => ({
  id,
  label,
  x: POS[id][0],
  y: POS[id][1],
}));

// 有向无环图：C→A, C→B, E→B, E→D, A→F, B→F, D→F（拓扑序非平凡 C→A→E→B→D→F）
const RAW: [number, number][] = [
  [2, 0], // C→A
  [2, 1], // C→B
  [4, 1], // E→B
  [4, 3], // E→D
  [0, 5], // A→F
  [1, 5], // B→F
  [3, 5], // D→F
];
export const TOPO_EDGES: TopoEdge[] = RAW.map(([from, to]) => ({ key: `${from}-${to}`, from, to }));

export interface TopoTrace {
  order: number[]; // 拓扑序 [2,0,4,1,3,5]
  inDegree: number[]; // 初始入度 [1,2,0,1,0,3]
}

export function topoTrace(): TopoTrace {
  const n = TOPO_VERTICES.length;
  const indeg = Array.from({ length: n }, () => 0);
  for (const e of TOPO_EDGES) indeg[e.to]++;
  const inDegree = [...indeg];

  const order: number[] = [];
  const removed = Array.from({ length: n }, () => false);
  while (order.length < n) {
    // 取入度 0 且下标最小的点
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!removed[i] && indeg[i] === 0) {
        u = i;
        break;
      }
    }
    if (u === -1) break; // 有环（本固定图无环，不会触发）
    removed[u] = true;
    order.push(u);
    for (const e of TOPO_EDGES) if (e.from === u) indeg[e.to]--;
  }
  return { order, inDegree };
}
