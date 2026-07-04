// src/algorithms/segint.ts
// 线段相交（跨立试验）oracle。计算几何第 4 页（C-084，复用 HullView + edgeClasses）。
// 三对线段三种结局：规范相交 / 同侧不相交 / 端点相触（D=0 + 框上）。

import type { Pt } from '@/components/player/types';

/** 12 点：3 对线段 × 4 端点（分区放置，一屏同显） */
export const SI_POINTS: Pt[] = [
  // 对 1：规范相交
  { x: 0, y: 0 }, // 0 A
  { x: 2, y: 2 }, // 1 B
  { x: 0, y: 2 }, // 2 C
  { x: 2, y: 0 }, // 3 D
  // 对 2：同侧不相交
  { x: 3, y: 0 }, // 4
  { x: 5, y: 0.6 }, // 5
  { x: 3, y: 1.6 }, // 6
  { x: 5, y: 2.4 }, // 7
  // 对 3：端点相触（(7,1) 在 (6,0)-(8,2) 上）
  { x: 6, y: 0 }, // 8
  { x: 8, y: 2 }, // 9
  { x: 7, y: 1 }, // 10
  { x: 8, y: 0 }, // 11
];

/** 3 对线段（每对两条边的端点下标） */
export const SI_PAIRS: [[number, number], [number, number]][] = [
  [
    [0, 1],
    [2, 3],
  ],
  [
    [4, 5],
    [6, 7],
  ],
  [
    [8, 9],
    [10, 11],
  ],
];

export function cross2(o: Pt, a: Pt, b: Pt): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** 已知共线时，r 是否落在 pq 的包围框内 */
export function onSeg(p: Pt, q: Pt, r: Pt): boolean {
  return (
    Math.min(p.x, q.x) <= r.x &&
    r.x <= Math.max(p.x, q.x) &&
    Math.min(p.y, q.y) <= r.y &&
    r.y <= Math.max(p.y, q.y)
  );
}

export type SegKind = 'proper' | 'touch' | 'none';

/** 跨立试验：D1..D4 两两异号 → 规范相交；某 D=0 且点在框上 → 相触；否则不相交。 */
export function segIntersect(
  a: Pt,
  b: Pt,
  c: Pt,
  d: Pt,
): { hit: boolean; kind: SegKind; ds: [number, number, number, number] } {
  const d1 = cross2(c, d, a);
  const d2 = cross2(c, d, b);
  const d3 = cross2(a, b, c);
  const d4 = cross2(a, b, d);
  if (d1 * d2 < 0 && d3 * d4 < 0) return { hit: true, kind: 'proper', ds: [d1, d2, d3, d4] };
  if (d1 === 0 && onSeg(c, d, a)) return { hit: true, kind: 'touch', ds: [d1, d2, d3, d4] };
  if (d2 === 0 && onSeg(c, d, b)) return { hit: true, kind: 'touch', ds: [d1, d2, d3, d4] };
  if (d3 === 0 && onSeg(a, b, c)) return { hit: true, kind: 'touch', ds: [d1, d2, d3, d4] };
  if (d4 === 0 && onSeg(a, b, d)) return { hit: true, kind: 'touch', ds: [d1, d2, d3, d4] };
  return { hit: false, kind: 'none', ds: [d1, d2, d3, d4] };
}
