// src/algorithms/ternary.ts
// 三分查找 oracle。查找第 5 页（C-095，纯复用主柱轨——单峰双探针）。
// [1,4,7,9,12,10,6,3,2]：四探 丢右/丢左/丢左/丢右 → 峰 idx 4（12）。

export const TER_ARRAY = [1, 4, 7, 9, 12, 10, 6, 3, 2];

/** argmax 独立真值。 */
export function brutePeak(arr: number[]): number {
  let best = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
  return best;
}

/** 严格单峰断言：先严格升后严格降（恰一个峰）。 */
export function isUnimodal(arr: number[]): boolean {
  const p = brutePeak(arr);
  for (let i = 1; i <= p; i++) if (arr[i] <= arr[i - 1]) return false;
  for (let i = p + 1; i < arr.length; i++) if (arr[i] >= arr[i - 1]) return false;
  return true;
}

export interface TerProbe {
  lo: number;
  hi: number;
  m1: number;
  m2: number;
  v1: number;
  v2: number;
  dropRight: boolean; // true → 丢右侧 1/3（hi=m2−1）；false → 丢左侧（lo=m1+1）
}

export interface TerTrace {
  probes: TerProbe[];
  result: number; // lo == hi 峰顶
}

/** 三分查找轨迹（与 brutePeak 对拍）。 */
export function terTrace(arr: number[]): TerTrace {
  let lo = 0;
  let hi = arr.length - 1;
  const probes: TerProbe[] = [];
  while (lo < hi) {
    const third = Math.floor((hi - lo) / 3);
    const m1 = lo + third;
    const m2 = hi - third;
    const dropRight = !(arr[m1] < arr[m2]);
    probes.push({ lo, hi, m1, m2, v1: arr[m1], v2: arr[m2], dropRight });
    if (dropRight) hi = m2 - 1;
    else lo = m1 + 1;
  }
  return { probes, result: lo };
}
