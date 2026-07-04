// src/algorithms/bbound.ts
// 二分边界 oracle。查找第 2 页（C-092，纯复用主柱轨——半开区间 lower/upper bound）。
// [1,2,2,2,3,5,5,7,8,9] t=2：lb=1（四探）、ub=4（四探）、等值区间 [1,4) 三个 2。

export const BB_ARRAY = [1, 2, 2, 2, 3, 5, 5, 7, 8, 9];
export const BB_T = 2;

/** 线性扫独立真值：第一个 ≥ t 的下标（不存在返回 n）。 */
export function bruteLb(arr: number[], t: number): number {
  for (let i = 0; i < arr.length; i++) if (arr[i] >= t) return i;
  return arr.length;
}

/** 线性扫独立真值：第一个 > t 的下标（不存在返回 n）。 */
export function bruteUb(arr: number[], t: number): number {
  for (let i = 0; i < arr.length; i++) if (arr[i] > t) return i;
  return arr.length;
}

export interface BbProbe {
  lo: number;
  hi: number;
  mid: number;
  val: number;
  goRight: boolean; // true → lo = mid+1；false → hi = mid
}

export interface BbTrace {
  probes: BbProbe[];
  result: number; // 相遇点 lo == hi
}

/** 半开区间边界二分轨迹。kind='lower'：a[mid] < t 才右走；'upper'：a[mid] <= t 右走。 */
export function boundTrace(arr: number[], t: number, kind: 'lower' | 'upper'): BbTrace {
  let lo = 0;
  let hi = arr.length;
  const probes: BbProbe[] = [];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const val = arr[mid];
    const goRight = kind === 'lower' ? val < t : val <= t;
    probes.push({ lo, hi, mid, val, goRight });
    if (goRight) lo = mid + 1;
    else hi = mid;
  }
  return { probes, result: lo };
}
