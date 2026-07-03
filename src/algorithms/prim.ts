// src/algorithms/prim.ts
// Prim oracle：复用 useKruskal 的固定无向图，从起点 A 生长选最小横切边，作正确性参照。
// 与 kruskalTrace() 在同一张图上应得到相同的 MST 边集（序可不同）。
import { useKruskal } from '@/components/structures/useKruskal';

export interface PrimTrace {
  order: string[]; // 边加入顺序（['AC','BC','BD','DE','DF']）
  mstEdges: string[]; // MST 边 id（= order）
  totalWeight: number; // MST 总权（18）
}

export function primTrace(start = 0): PrimTrace {
  const { vertices, edges } = useKruskal();
  const inTree = new Set<number>([start]);
  const order: string[] = [];
  let weight = 0;
  while (inTree.size < vertices.length) {
    let best: (typeof edges)[number] | null = null;
    for (const e of edges) {
      const crossing = inTree.has(e.u) !== inTree.has(e.v); // 恰一端在树内
      if (crossing && (!best || e.w < best.w)) best = e;
    }
    if (!best) break; // 图不连通（本固定图连通，不会触发）
    inTree.add(inTree.has(best.u) ? best.v : best.u);
    order.push(best.id);
    weight += best.w;
  }
  return { order, mstEdges: [...order], totalWeight: weight };
}
