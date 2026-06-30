/** 固定无向带权图 + Kruskal 最小生成树（内置并查集判环），纯逻辑可单测 */
export interface KVertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface KEdge {
  id: string; // 端点 label 对，如 'AC'
  u: number;
  v: number;
  w: number;
}
export interface KruskalStep {
  consideredIdx: number; // 本步考虑的边在排序表中的下标（step0 为 -1）
  current: KEdge | null; // 本步考虑的边（step0 为 null）
  accepted: boolean | null; // 加入 / 成环跳过 / step0(null)
  mst: string[]; // 到本步为止已加入 MST 的边 id
  rejected: string[]; // 到本步为止因成环被跳过的边 id
  weight: number; // 当前 MST 权重和
}
export interface KruskalResult {
  steps: KruskalStep[];
  mstEdges: string[];
  totalWeight: number;
}
export interface UseKruskal {
  vertices: KVertex[];
  edges: KEdge[];
  run: () => KruskalResult;
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const POS: [number, number][] = [
  [60, 150],
  [180, 60],
  [180, 240],
  [320, 60],
  [320, 240],
  [440, 150],
];
// 9 条无向带权边，已按权升序（权重两两不同 → 过程确定）
const EDGES: KEdge[] = [
  { id: 'AC', u: 0, v: 2, w: 1 },
  { id: 'BC', u: 1, v: 2, w: 2 },
  { id: 'DE', u: 3, v: 4, w: 3 },
  { id: 'AB', u: 0, v: 1, w: 4 },
  { id: 'BD', u: 1, v: 3, w: 5 },
  { id: 'CE', u: 2, v: 4, w: 6 },
  { id: 'DF', u: 3, v: 5, w: 7 },
  { id: 'EF', u: 4, v: 5, w: 8 },
  { id: 'CD', u: 2, v: 3, w: 9 },
];

export function useKruskal(): UseKruskal {
  const vertices: KVertex[] = LABELS.map((label, id) => ({
    id,
    label,
    x: POS[id][0],
    y: POS[id][1],
  }));

  const run = (): KruskalResult => {
    const parent = vertices.map((v) => v.id);
    const find = (x: number): number => {
      while (parent[x] !== x) x = parent[x];
      return x;
    };

    const mst: string[] = [];
    const rejected: string[] = [];
    let weight = 0;
    const steps: KruskalStep[] = [
      { consideredIdx: -1, current: null, accepted: null, mst: [], rejected: [], weight: 0 },
    ];

    EDGES.forEach((e, idx) => {
      const ru = find(e.u);
      const rv = find(e.v);
      const accepted = ru !== rv;
      if (accepted) {
        parent[ru] = rv; // union
        mst.push(e.id);
        weight += e.w;
      } else {
        rejected.push(e.id);
      }
      steps.push({
        consideredIdx: idx,
        current: e,
        accepted,
        mst: [...mst],
        rejected: [...rejected],
        weight,
      });
    });

    return { steps, mstEdges: [...mst], totalWeight: weight };
  };

  return { vertices, edges: EDGES, run };
}
