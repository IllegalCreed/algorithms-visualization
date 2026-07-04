// src/algorithms/mr.ts
// 米勒-拉宾 oracle。数学与数论第 8 页（C-090，纯复用 MatrixView 平方链表）。
// 41：40=2³·5，链 32→40(=−1) 通过；561=3·11·17 卡迈克尔：560=2⁴·35，链 263→166→67→1，
// 67²≡1 非平凡平方根 → 合数（而 2^560≡1 骗过费马）。

export const MR_CASES = [
  { n: 41, a: 2 },
  { n: 561, a: 2 },
];

/** 试除独立真值。 */
export function isPrimeBrute(n: number): boolean {
  if (n < 2) return false;
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
  return true;
}

/** 快速幂取模（数值均在安全整数内）。 */
export function powMod(a: number, e: number, m: number): number {
  let base = a % m;
  let res = 1;
  let k = e;
  while (k > 0) {
    if (k % 2 === 1) res = (res * base) % m;
    base = (base * base) % m;
    k = Math.floor(k / 2);
  }
  return res;
}

/** n−1 = 2^s · d（d 为奇数）。 */
export function decompose(n: number): { s: number; d: number } {
  let d = n - 1;
  let s = 0;
  while (d % 2 === 0) {
    d /= 2;
    s++;
  }
  return { s, d };
}

export interface MrResult {
  s: number;
  d: number;
  chain: number[]; // x₀ = a^d 起的平方链（early-exit 截断）
  verdict: 'probable-prime' | 'composite';
  reason: 'direct' | 'hit-minus-1' | 'nontrivial-sqrt' | 'never-minus-1';
}

/** 单底数米勒-拉宾：返回平方链与判定（early-exit）。 */
export function mrChain(n: number, a: number): MrResult {
  const { s, d } = decompose(n);
  let x = powMod(a, d, n);
  const chain = [x];
  if (x === 1 || x === n - 1) {
    return { s, d, chain, verdict: 'probable-prime', reason: 'direct' };
  }
  for (let i = 1; i <= s; i++) {
    x = (x * x) % n;
    chain.push(x);
    if (x === n - 1) return { s, d, chain, verdict: 'probable-prime', reason: 'hit-minus-1' };
    if (x === 1) return { s, d, chain, verdict: 'composite', reason: 'nontrivial-sqrt' };
  }
  return { s, d, chain, verdict: 'composite', reason: 'never-minus-1' };
}
