// src/algorithms/phi.ts
// 欧拉函数 oracle。数学与数论第 7 页（C-089，纯复用 SieveView 互质筛网格）。
// n=12=2²·3 → 互质集 {1,5,7,11}、φ(12)=4；res 链 12→6→4。

export const PHI_N = 12;
export const PHI_COLS = 6;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** 暴力独立真值：gcd 逐个数与 n 互质的清单。 */
export function phiBruteList(n: number): number[] {
  const out: number[] = [];
  for (let v = 1; v <= n; v++) if (gcd(v, n) === 1) out.push(v);
  return out;
}

export function phiBrute(n: number): number {
  return phiBruteList(n).length;
}

/** 试除公式版：res 从 n 出发，每个不同质因子 p 做 res -= res/p。 */
export function phiFormula(n: number): { res: number; factors: number[] } {
  let res = n;
  const factors: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p !== 0) continue;
    factors.push(p);
    res -= res / p;
    while (m % p === 0) m /= p;
  }
  if (m > 1) {
    factors.push(m);
    res -= res / m;
  }
  return { res, factors };
}

export interface PhiCross {
  p: number; // 质因子
  newly: number[]; // 本轮新划掉的数（增量）
  resAfter: number; // 记账后的 res
}

/** 每个质因子的新划集合 + 幸存者（与暴力对拍）。 */
export function phiCrossSets(): { crosses: PhiCross[]; survivors: number[] } {
  const { factors } = phiFormula(PHI_N);
  const crossed = new Set<number>();
  const crosses: PhiCross[] = [];
  let res = PHI_N;
  for (const p of factors) {
    const newly: number[] = [];
    for (let v = p; v <= PHI_N; v += p) {
      if (!crossed.has(v)) {
        crossed.add(v);
        newly.push(v);
      }
    }
    res -= res / p;
    crosses.push({ p, newly, resAfter: res });
  }
  const survivors: number[] = [];
  for (let v = 1; v <= PHI_N; v++) if (!crossed.has(v)) survivors.push(v);
  return { crosses, survivors };
}
