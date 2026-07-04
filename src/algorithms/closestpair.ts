// src/algorithms/closestpair.ts
// 最近点对（一层分治）oracle。计算几何第 3 页（C-083，复用 HullView + divider/strip）。
// 8 点 → 中线 3.25、δ=右侧 1.803、跨带两次刷新，最近对 [3,5]（(3,4)↔(4,4.5)）距离 √1.25≈1.118。

import type { Pt } from '@/components/player/types';

/** 固定 8 点（已按 x 排序）；最近对下标 [3,5] 跨中线。 */
export const CP_POINTS: Pt[] = [
  { x: 0, y: 0 }, // 0
  { x: 1, y: 3 }, // 1
  { x: 2, y: 1 }, // 2
  { x: 3, y: 4 }, // 3
  { x: 3.5, y: 1.5 }, // 4
  { x: 4, y: 4.5 }, // 5
  { x: 5, y: 0.5 }, // 6
  { x: 6, y: 3 }, // 7
];

export function dist(a: number, b: number): number {
  const p = CP_POINTS[a];
  const q = CP_POINTS[b];
  return Math.hypot(p.x - q.x, p.y - q.y);
}

/** 暴力最近（下标集合内所有点对），对拍用。 */
export function bruteClosest(idx: number[]): { d: number; pair: [number, number] } {
  let d = Infinity;
  let pair: [number, number] = [idx[0], idx[1]];
  for (let i = 0; i < idx.length; i++) {
    for (let j = i + 1; j < idx.length; j++) {
      const dd = dist(idx[i], idx[j]);
      if (dd < d) {
        d = dd;
        pair = [idx[i], idx[j]];
      }
    }
  }
  return { d, pair };
}

/** 一层分治：中线分半、两半暴力得 δ，δ 带内按 y 序近邻扫描合并。 */
export function closestPair(): { d: number; pair: [number, number]; midX: number } {
  const n = CP_POINTS.length;
  const mid = n / 2;
  const midX = (CP_POINTS[mid - 1].x + CP_POINTS[mid].x) / 2;
  const left = bruteClosest([0, 1, 2, 3]);
  const right = bruteClosest([4, 5, 6, 7]);
  let best = left.d < right.d ? left : right;
  const delta0 = best.d;
  const strip = Array.from({ length: n }, (_, i) => i)
    .filter((i) => Math.abs(CP_POINTS[i].x - midX) < delta0)
    .sort((a, b) => CP_POINTS[a].y - CP_POINTS[b].y);
  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length; j++) {
      if (CP_POINTS[strip[j]].y - CP_POINTS[strip[i]].y >= best.d) break;
      const dd = dist(strip[i], strip[j]);
      if (dd < best.d) best = { d: dd, pair: [strip[i], strip[j]] };
    }
  }
  return { d: best.d, pair: best.pair, midX };
}
