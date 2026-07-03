// src/algorithms/floyd.ts
// Floyd-Warshall 固定 4 点有向带权图（含环 → 全点对可达）+ 纯逻辑 oracle。图数据供 module + oracle 共用。

export const FLOYD_LABELS = ['A', 'B', 'C', 'D'];
export const FLOYD_N = FLOYD_LABELS.length;

// 有向带权边 [from, to, w]（含环 D→A，故所有点对最终可达）
export const FLOYD_EDGES: [number, number, number][] = [
  [0, 1, 3], // A→B
  [0, 2, 6], // A→C
  [1, 2, 2], // B→C
  [1, 3, 4], // B→D
  [2, 3, 1], // C→D
  [3, 0, 5], // D→A
];

/** 初始邻接矩阵：对角 0、有边取权、其余 null（∞） */
export function floydInitMatrix(): (number | null)[][] {
  const n = FLOYD_N;
  const m: (number | null)[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : null)),
  );
  for (const [u, v, w] of FLOYD_EDGES) m[u][v] = w;
  return m;
}

/** 三重循环求全源最短距离矩阵（oracle） */
export function floydTrace(): (number | null)[][] {
  const n = FLOYD_N;
  const d = floydInitMatrix();
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (d[i][k] === null || d[k][j] === null) continue;
        const via = d[i][k]! + d[k][j]!;
        if (d[i][j] === null || via < d[i][j]!) d[i][j] = via;
      }
    }
  }
  return d;
}
