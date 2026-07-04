// src/algorithms/fastpower.ts
// 快速幂（二进制取幂）固定实例 + 幂块 oracle。数学与数论第 4 页（C-080，新建 PowerView）。
// a=3, n=13=1101₂ → 3^13=1594323；幂块 3/9/81/6561，选中 3¹·3⁴·3⁸（1+4+8=13）。

import type { PowerBlock } from '@/components/player/types';

export const FP_A = 3;
export const FP_N = 13;

/** 快速幂：指数拆二进制，底数反复平方，位为 1 就乘入结果。O(log n)。 */
export function fastPow(a: number, n: number): number {
  let result = 1;
  let base = a;
  while (n > 0) {
    if (n & 1) result *= base;
    base *= base;
    n >>= 1;
  }
  return result;
}

/** 幂块序列：a^(2^k)，附 n 的第 k 位与是否选中（bit=1）。3^13 → [3(sel),9,81(sel),6561(sel)]。 */
export function powBlocks(): PowerBlock[] {
  const blocks: PowerBlock[] = [];
  let base = FP_A;
  let nn = FP_N;
  let k = 0;
  while (nn > 0) {
    const bit = nn & 1;
    blocks.push({ k, exp: 1 << k, value: base, bit, selected: bit === 1 });
    base *= base;
    nn >>= 1;
    k += 1;
  }
  return blocks;
}
