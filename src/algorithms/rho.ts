// src/algorithms/rho.ts —— Pollard's Rho oracle（C-108）：龟兔轨迹 + 试除判素对拍
/** 固定实例：8051 = 83 × 97（经典教学数），f(x)=x²+1、x₀=2 —— mod 97 尾 1 环 3 的极简 ρ */
export const RHO_N = 8051;
export const RHO_X0 = 2;

export const rhoF = (x: number): number => (x * x + 1) % RHO_N;

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export interface RhoRace {
  step: number;
  slow: number;
  fast: number;
  slowIdx: number; // slow 在序列 xs 中的下标
  fastIdx: number;
  diff: number;
  g: number;
}

export interface RhoTrace {
  xs: number[]; // 序列 x₀..x₇
  races: RhoRace[];
  factor: number;
  cofactor: number;
}

/** Floyd 龟兔：慢 1 步快 2 步，每步 gcd(|slow−fast|, n) 显影；命中即得因子 */
export function rhoTrace(): RhoTrace {
  const xs = [RHO_X0];
  for (let i = 0; i < 7; i++) xs.push(rhoF(xs[i]));

  const races: RhoRace[] = [];
  let slow = RHO_X0;
  let fast = RHO_X0;
  let si = 0;
  let fi = 0;
  let factor = 1;
  for (let step = 1; step <= 6; step++) {
    slow = rhoF(slow);
    fast = rhoF(rhoF(fast));
    si += 1;
    fi += 2;
    const diff = Math.abs(slow - fast);
    const g = gcd(diff, RHO_N);
    races.push({ step, slow, fast, slowIdx: si, fastIdx: fi, diff, g });
    if (g > 1 && g < RHO_N) {
      factor = g;
      break;
    }
  }
  return { xs, races, factor, cofactor: RHO_N / factor };
}

/** 独立真值：试除判素（√m 内逐个除） */
export function isPrimeBrute(m: number): boolean {
  if (m < 2) return false;
  for (let d = 2; d * d <= m; d++) if (m % d === 0) return false;
  return true;
}
