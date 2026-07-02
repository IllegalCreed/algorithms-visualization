// src/algorithms/dijkstra.ts
// Dijkstra oracle：复用 useDijkstra 的固定图 + 纯逻辑 run() 作正确性参照。
import { useDijkstra } from '@/components/structures/useDijkstra';

export interface DijkstraTrace {
  dist: number[]; // 各点最短距离终值
  order: number[]; // 确定顺序
}

export function dijkstraTrace(): DijkstraTrace {
  const r = useDijkstra().run();
  return { dist: r.dist, order: r.order };
}
