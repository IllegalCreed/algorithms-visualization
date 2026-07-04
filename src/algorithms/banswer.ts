// src/algorithms/banswer.ts
// 二分答案 oracle。查找第 4 页（C-094，纯复用主柱轨——柱子=候选答案）。
// 珂珂吃香蕉 piles=[3,6,7,11]、h=8：可行序列 ✗✗✗✓✓…（k≥4），答案 4。

export const BA_PILES = [3, 6, 7, 11];
export const BA_H = 8;
export const BA_MAX = 11; // 答案空间上界 = max(piles)

/** 速度 k 下吃完全部的耗时 Σ ceil(pile / k)。 */
export function hoursAt(k: number): number {
  return BA_PILES.reduce((s, p) => s + Math.ceil(p / k), 0);
}

/** 线性扫独立真值：第一个可行速度。 */
export function bruteMinSpeed(): number {
  for (let k = 1; k <= BA_MAX; k++) if (hoursAt(k) <= BA_H) return k;
  return -1;
}

export interface BaProbe {
  lo: number;
  hi: number;
  mid: number;
  hours: number;
  ok: boolean; // 可行：hours <= h
}

export interface BaTrace {
  probes: BaProbe[];
  result: number; // lo == hi 相遇点 = 最小可行答案
}

/** 答案空间上的 lower_bound（谓词 = 可行性）轨迹。 */
export function baTrace(): BaTrace {
  let lo = 1;
  let hi = BA_MAX;
  const probes: BaProbe[] = [];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const hours = hoursAt(mid);
    const ok = hours <= BA_H;
    probes.push({ lo, hi, mid, hours, ok });
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  return { probes, result: lo };
}
