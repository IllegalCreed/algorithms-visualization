// src/algorithms/crt.ts
// 中国剩余定理 oracle。数学与数论第 6 页（C-087，纯复用 MatrixView 构造表）。
// 孙子算经 [2,3,2]/[3,5,7] → M=105、Mᵢ=35/21/15、tᵢ=2/1/1、项 140/63/30、合计 233 → x=23。

import { extGcd } from './extgcd';

export const CRT_RS = [2, 3, 2];
export const CRT_MS = [3, 5, 7];

/** 暴力独立真值：扫 0..M−1 找同时满足所有同余的最小非负解。 */
export function crtBrute(rs: number[], ms: number[]): number {
  const M = ms.reduce((p, m) => p * m, 1);
  for (let v = 0; v < M; v++) {
    if (rs.every((r, i) => v % ms[i] === r)) return v;
  }
  return -1;
}

/** a 在模 m 下的逆元（gcd(a,m)=1 时存在）；复用扩欧的 Bézout 系数。 */
export function modInverse(a: number, m: number): number {
  const { x } = extGcd(((a % m) + m) % m, m);
  return ((x % m) + m) % m;
}

export interface CrtRow {
  r: number;
  m: number;
  Mi: number; // M / m：其余模之积
  ti: number; // Mi 在模 m 下的逆
  term: number; // r · Mi · ti
}

/** 构造表：每条同余一行 {r, m, Mᵢ, tᵢ, 项}。 */
export function crtRows(): CrtRow[] {
  const M = CRT_MS.reduce((p, m) => p * m, 1);
  return CRT_RS.map((r, i) => {
    const m = CRT_MS[i];
    const Mi = M / m;
    const ti = modInverse(Mi, m);
    return { r, m, Mi, ti, term: r * Mi * ti };
  });
}

/** 构造法求解：各专属项相加再 mod M（与 crtBrute 对拍）。 */
export function crtSolve(): { M: number; sum: number; x: number } {
  const M = CRT_MS.reduce((p, m) => p * m, 1);
  const sum = crtRows().reduce((p, row) => p + row.term, 0);
  return { M, sum, x: sum % M };
}
