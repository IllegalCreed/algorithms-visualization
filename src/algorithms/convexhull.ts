// src/algorithms/convexhull.ts
// 凸包（Andrew 单调链）固定实例 + 叉积 oracle。计算几何大类首发（C-081，新建 HullView）。
// 7 点 → 凸包 6 点 [0,1,4,6,5,2]，内部点 (3,3) 排除。

import type { Pt } from '@/components/player/types';

/** 固定 7 点，已按 (x,y) 排序；下标 3 = (3,3) 是内部点。 */
export const CH_POINTS: Pt[] = [
  { x: 0, y: 3 }, // 0
  { x: 2, y: 0 }, // 1
  { x: 2, y: 5 }, // 2
  { x: 3, y: 3 }, // 3（内部点）
  { x: 4, y: 0 }, // 4
  { x: 4, y: 5 }, // 5
  { x: 6, y: 3 }, // 6
];

/** 叉积 (A−O)×(B−O)：>0 左转（逆时针），<0 右转（顺时针），=0 共线。 */
export function cross(o: Pt, a: Pt, b: Pt): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

/** Andrew 单调链：构下凸壳 + 上凸壳，非左转即弹栈。返回凸包点下标（逆时针）。 */
export function convexHull(): number[] {
  const n = CH_POINTS.length;
  const idx = Array.from({ length: n }, (_, i) => i); // 已排序

  const halfHull = (order: number[]): number[] => {
    const st: number[] = [];
    for (const i of order) {
      while (
        st.length >= 2 &&
        cross(CH_POINTS[st[st.length - 2]], CH_POINTS[st[st.length - 1]], CH_POINTS[i]) <= 0
      ) {
        st.pop();
      }
      st.push(i);
    }
    return st;
  };

  const lower = halfHull(idx);
  const upper = halfHull([...idx].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]; // [0,1,4,6,5,2]
}
