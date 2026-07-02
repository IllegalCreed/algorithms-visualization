// src/algorithms/kruskal.ts
// Kruskal oracle：复用 useKruskal 的固定图 + 纯逻辑 run() 作正确性参照。
import { useKruskal } from '@/components/structures/useKruskal';

export interface KruskalTrace {
  mstEdges: string[]; // MST 边 id（['AC','BC','DE','BD','DF']）
  totalWeight: number; // MST 总权（18）
  rejected: string[]; // 成环跳过边 id（['AB','CE','EF','CD']）
}

export function kruskalTrace(): KruskalTrace {
  const r = useKruskal().run();
  const last = r.steps[r.steps.length - 1];
  return { mstEdges: r.mstEdges, totalWeight: r.totalWeight, rejected: last.rejected };
}
