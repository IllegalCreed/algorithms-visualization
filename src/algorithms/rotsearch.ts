// src/algorithms/rotsearch.ts
// 旋转数组搜索 oracle。查找第 3 页（C-093，纯复用主柱轨——判半二分）。
// [13,15,17,1,3,5,7,9,11]：t=5 三步命中 idx5；t=15 两步命中 idx1。

export const ROT_ARRAY = [13, 15, 17, 1, 3, 5, 7, 9, 11];
export const RS_T1 = 5;
export const RS_T2 = 15;

/** 线性扫独立真值。 */
export function linearIndex(arr: number[], t: number): number {
  for (let i = 0; i < arr.length; i++) if (arr[i] === t) return i;
  return -1;
}

export interface RsProbe {
  lo: number;
  hi: number;
  mid: number;
  val: number;
  sortedHalf: 'left' | 'right'; // 哪半完好有序
  inSorted: boolean; // 目标是否落在有序半的范围
}

export interface RsTrace {
  probes: RsProbe[];
  hit: { lo: number; hi: number; mid: number } | null;
  index: number;
}

/** 判半二分轨迹（与 linearIndex 对拍）。 */
export function rotTrace(arr: number[], t: number): RsTrace {
  let lo = 0;
  let hi = arr.length - 1;
  const probes: RsProbe[] = [];
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = arr[mid];
    if (val === t) return { probes, hit: { lo, hi, mid }, index: mid };
    if (arr[lo] <= val) {
      const inSorted = arr[lo] <= t && t < val;
      probes.push({ lo, hi, mid, val, sortedHalf: 'left', inSorted });
      if (inSorted) hi = mid - 1;
      else lo = mid + 1;
    } else {
      const inSorted = val < t && t <= arr[hi];
      probes.push({ lo, hi, mid, val, sortedHalf: 'right', inSorted });
      if (inSorted) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return { probes, hit: null, index: -1 };
}
