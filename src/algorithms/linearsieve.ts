// src/algorithms/linearsieve.ts
// 线性筛（欧拉筛）固定实例 + oracle。数学与数论第 2 页（C-078，复用 SieveView + spf 角标）。
// 每个合数只被它的最小质因子划一次 → 严格 O(N)。N=30 → 素数 2,3,5,7,11,13,17,19,23,29。

export const LS_N = 30;
export const LS_COLS = 6;

/** 试除法求最小质因子（对拍用）；x<2 记 0，素数返回自身。 */
export function smallestPrimeFactor(x: number): number {
  if (x < 2) return 0;
  for (let d = 2; d * d <= x; d++) if (x % d === 0) return d;
  return x;
}

/** 线性筛：外层 i 遍历所有数，对素数 p 划 i×p、spf[i×p]=p，i%p==0 即停（保证只划一次）。 */
export function linearSieve(): { primes: number[]; spf: number[] } {
  const isComp = new Array<boolean>(LS_N + 1).fill(false);
  const spf = new Array<number>(LS_N + 1).fill(0);
  const primes: number[] = [];
  for (let i = 2; i <= LS_N; i++) {
    if (!isComp[i]) primes.push(i);
    for (const p of primes) {
      if (i * p > LS_N) break;
      isComp[i * p] = true;
      spf[i * p] = p;
      if (i % p === 0) break; // p 是 i 的最小质因子 → 停，保证 i×p 只被 p 划一次
    }
  }
  return { primes, spf };
}
