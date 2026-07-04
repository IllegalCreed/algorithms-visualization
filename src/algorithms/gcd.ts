// src/algorithms/gcd.ts
// 欧几里得算法（辗转相除求最大公约数）固定实例 + 几何铺砖 oracle。数学与数论第 3 页（C-079，新建 GcdView）。
// gcd(30,18)=6；铺砖：18/12/6/6 四正方形恰好铺满 30×18，最小正方形边长 = gcd。

import type { GcdSquare } from '@/components/player/types';

export const GCD_A = 30;
export const GCD_B = 18;

/** 辗转相除：gcd(a,b)=gcd(b, a mod b)，余 0 即得。 */
export function gcd(a: number, b: number): number {
  while (b !== 0) {
    const r = a % b;
    a = b;
    b = r;
  }
  return a;
}

/** 除法步序列（被除数/除数/商/余数）。gcd(30,18) → 30=1·18+12 / 18=1·12+6 / 12=2·6+0。 */
export function gcdSteps(): { a: number; b: number; q: number; r: number }[] {
  const steps: { a: number; b: number; q: number; r: number }[] = [];
  let a = GCD_A;
  let b = GCD_B;
  while (b !== 0) {
    const q = Math.floor(a / b);
    const r = a % b;
    steps.push({ a, b, q, r });
    a = b;
    b = r;
  }
  return steps;
}

/** 几何铺砖：反复从长边切 ⌊a/b⌋ 个正方形。返回所有正方形 + 每个除法步后的剩余子矩形（degenerate 记 null）。 */
export function gcdTiling(): {
  squares: GcdSquare[];
  remainings: ({ x: number; y: number; w: number; h: number } | null)[];
} {
  const squares: GcdSquare[] = [];
  const remainings: ({ x: number; y: number; w: number; h: number } | null)[] = [];
  let x = 0;
  let y = 0;
  let w = GCD_A;
  let h = GCD_B;
  let a = GCD_A;
  let b = GCD_B;
  let step = 0;
  while (b !== 0) {
    const q = Math.floor(a / b);
    for (let k = 0; k < q; k++) {
      if (w >= h) squares.push({ x: x + k * h, y, size: h, step });
      else squares.push({ x, y: y + k * w, size: w, step });
    }
    if (w >= h) {
      x += q * h;
      w -= q * h;
    } else {
      y += q * w;
      h -= q * w;
    }
    remainings.push(w > 0 && h > 0 ? { x, y, w, h } : null);
    const r = a % b;
    a = b;
    b = r;
    step++;
  }
  return { squares, remainings };
}
