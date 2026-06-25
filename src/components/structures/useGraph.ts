export interface Vertex {
  id: number;
  label: string;
  x: number;
  y: number;
}
export interface TraverseStep {
  visit: number; // 本步访问的顶点
  frontier: number[]; // 访问后队列/栈的当前内容
}
export interface UseGraph {
  vertices: Vertex[]; // 6 个，固定坐标
  edges: [number, number][]; // 7 条无向边（顶点 id 对）
  adj: number[][]; // 邻接表（每个顶点的邻居 id，升序）
  labelOf: (i: number) => string;
  bfs: (start: number) => TraverseStep[]; // 队列：FIFO
  dfs: (start: number) => TraverseStep[]; // 栈：邻居逆序入栈
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
// 六边形布局（无交叉）：A 顶、B/C 上、D/E 下、F 底
const POS: [number, number][] = [
  [230, 42],
  [108, 118],
  [352, 118],
  [108, 244],
  [352, 244],
  [230, 300],
];
// 邻接表：D-E-F 三角环 + A 经 B-D / C-E 两臂下接
const ADJ: number[][] = [
  [1, 2],
  [0, 3],
  [0, 4],
  [1, 4, 5],
  [2, 3, 5],
  [3, 4],
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [4, 5],
];

export function useGraph(): UseGraph {
  const vertices: Vertex[] = LABELS.map((label, id) => ({
    id,
    label,
    x: POS[id][0],
    y: POS[id][1],
  }));
  const labelOf = (i: number): string => LABELS[i];

  const bfs = (start: number): TraverseStep[] => {
    const visited = new Set([start]);
    const q = [start];
    const steps: TraverseStep[] = [];
    while (q.length) {
      const u = q.shift()!;
      for (const v of ADJ[u]) {
        if (!visited.has(v)) {
          visited.add(v);
          q.push(v); // 邻居按序入队（FIFO，一层层）
        }
      }
      steps.push({ visit: u, frontier: [...q] });
    }
    return steps;
  };
  const dfs = (start: number): TraverseStep[] => {
    const visited = new Set([start]);
    const st = [start];
    const steps: TraverseStep[] = [];
    while (st.length) {
      const u = st.pop()!;
      for (const v of [...ADJ[u]].reverse()) {
        if (!visited.has(v)) {
          visited.add(v);
          st.push(v); // 邻居逆序入栈（LIFO，先入先深）
        }
      }
      steps.push({ visit: u, frontier: [...st] });
    }
    return steps;
  };

  return { vertices, edges: EDGES, adj: ADJ, labelOf, bfs, dfs };
}
