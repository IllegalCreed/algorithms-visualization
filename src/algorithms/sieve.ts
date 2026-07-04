// src/algorithms/sieve.ts
// 埃拉托斯特尼筛固定实例 + 素数 oracle。数学与数论大类首发（C-077，新建 SieveView 数字网格轨）。
// N=30 → 素数 2,3,5,7,11,13,17,19,23,29（10 个）。

export const SIEVE_N = 30;
export const SIEVE_COLS = 6;

/** 试除法判素（对拍用） */
export function isPrimeTrial(x: number): boolean {
  if (x < 2) return false;
  for (let i = 2; i * i <= x; i++) if (x % i === 0) return false;
  return true;
}

/** 埃氏筛：从 2 起，每个未标记的数是素数，划掉它从 p² 起的倍数；筛到 √N 即可。 */
export function sievePrimes(): number[] {
  const isComposite = new Array<boolean>(SIEVE_N + 1).fill(false);
  const primes: number[] = [];
  for (let p = 2; p <= SIEVE_N; p++) {
    if (!isComposite[p]) {
      primes.push(p);
      for (let m = p * p; m <= SIEVE_N; m += p) isComposite[m] = true;
    }
  }
  return primes;
}
