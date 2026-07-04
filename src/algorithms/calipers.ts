// src/algorithms/calipers.ts
// 旋转卡壳求凸包直径（最远点对）oracle。计算几何第 2 页（C-082，复用 HullView + CH_POINTS）。
// C-081 凸包 [0,1,4,6,5,2] → 直径² 36、点对 (0,3)↔(6,3)、直径 6。

import { CH_POINTS, cross, convexHull } from './convexhull';

/** 两点距离平方（原下标） */
export function dist2(a: number, b: number): number {
  const p = CH_POINTS[a];
  const q = CH_POINTS[b];
  return (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
}

/** 暴力直径（所有点对，对拍用） */
export function bruteDiameter(): { d2: number; pair: [number, number] } {
  let d2 = 0;
  let pair: [number, number] = [0, 0];
  for (let i = 0; i < CH_POINTS.length; i++) {
    for (let j = i + 1; j < CH_POINTS.length; j++) {
      const d = dist2(i, j);
      if (d > d2) {
        d2 = d;
        pair = [i, j];
      }
    }
  }
  return { d2, pair };
}

/** 旋转卡壳：对每条凸包边，对踵点按三角形面积单调前移，检查边两端与对踵点的距离。 */
export function diameter(): { d2: number; pair: [number, number] } {
  const hull = convexHull();
  const m = hull.length;
  const area2 = (a: number, b: number, c: number): number =>
    Math.abs(cross(CH_POINTS[a], CH_POINTS[b], CH_POINTS[c]));
  let j = 1;
  let d2best = 0;
  let pair: [number, number] = [hull[0], hull[1]];
  for (let i = 0; i < m; i++) {
    const ni = (i + 1) % m;
    while (area2(hull[i], hull[ni], hull[(j + 1) % m]) > area2(hull[i], hull[ni], hull[j])) {
      j = (j + 1) % m;
    }
    for (const cand of [hull[i], hull[ni]]) {
      const d = dist2(cand, hull[j]);
      if (d > d2best) {
        d2best = d;
        pair = [cand, hull[j]];
      }
    }
  }
  return { d2: d2best, pair };
}
