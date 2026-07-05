// src/algorithms/fft.ts —— FFT oracle（C-107）：迭代蝶形逐层轨迹 + 直算 DFT 对拍
/** 固定输入：多项式 1+2x+3x²+4x³ 补零到 8 点 */
export const FFT_A = [1, 2, 3, 4, 0, 0, 0, 0];
export const FFT_N = 8;

interface C {
  re: number;
  im: number;
}

const add = (x: C, y: C): C => ({ re: x.re + y.re, im: x.im + y.im });
const sub = (x: C, y: C): C => ({ re: x.re - y.re, im: x.im - y.im });
const mul = (x: C, y: C): C => ({
  re: x.re * y.re - x.im * y.im,
  im: x.re * y.im + x.im * y.re,
});

/** 复数格式化：2 位小数、去 -0、纯实/纯虚简写（'10'、'-3i'、'1-3i'） */
export function fmtC(z: C): string {
  const r = (v: number): number => {
    const x = Math.round(v * 100) / 100;
    return Object.is(x, -0) ? 0 : x;
  };
  const re = r(z.re);
  const im = r(z.im);
  if (im === 0) return `${re}`;
  const ims = im === 1 ? 'i' : im === -1 ? '-i' : `${im}i`;
  if (re === 0) return ims;
  return `${re}${im > 0 ? '+' : ''}${ims}`;
}

/** 3 位二进制位反转 */
export function bitRev3(x: number): number {
  return ((x & 1) << 2) | (x & 2) | ((x & 4) >> 2);
}

export interface FftTrace {
  input: number[];
  rev: number[]; // 位反转序（第 i 线放 a[rev[i]]）
  layers: string[][]; // [重排后, L=2 后, L=4 后, L=8 后]
}

/** 迭代 Cooley-Tukey（DIT）：位反转重排 + 三层蝶形 (u,v)→(u+ωv, u−ωv) */
export function fftTrace(): FftTrace {
  const n = FFT_N;
  const rev = Array.from({ length: n }, (_, i) => bitRev3(i));
  const A: C[] = rev.map((r) => ({ re: FFT_A[r], im: 0 }));
  const layers: string[][] = [A.map(fmtC)];
  for (let L = 2; L <= n; L *= 2) {
    const half = L / 2;
    const ang = (-2 * Math.PI) / L;
    for (let st = 0; st < n; st += L) {
      for (let k = 0; k < half; k++) {
        const w: C = { re: Math.cos(ang * k), im: Math.sin(ang * k) };
        const u = A[st + k];
        const v = mul(A[st + k + half], w);
        A[st + k] = add(u, v);
        A[st + k + half] = sub(u, v);
      }
    }
    layers.push(A.map(fmtC));
  }
  return { input: [...FFT_A], rev, layers };
}

/** 独立真值：按定义直算 DFT——X[k] = Σ a[j]·e^{-2πijk/n} */
export function dftBrute(): string[] {
  const n = FFT_N;
  const out: string[] = [];
  for (let k = 0; k < n; k++) {
    let s: C = { re: 0, im: 0 };
    for (let j = 0; j < n; j++) {
      const ang = (-2 * Math.PI * j * k) / n;
      s = add(s, mul({ re: FFT_A[j], im: 0 }, { re: Math.cos(ang), im: Math.sin(ang) }));
    }
    out.push(fmtC(s));
  }
  return out;
}
