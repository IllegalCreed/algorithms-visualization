// src/algorithms/bsearch.ts
// 二分查找 oracle。查找大类首发（C-091，纯复用主柱轨 + ArrowTrack）。
// [1,3,5,7,9,11,13,15,17,19]：17 三探命中下标 8；4 四探区间清空 → −1。

export const BS_ARRAY = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
export const BS_HIT = 17;
export const BS_MISS = 4;

/** 线性扫独立真值。 */
export function linearFind(arr: number[], t: number): number {
  for (let i = 0; i < arr.length; i++) if (arr[i] === t) return i;
  return -1;
}

export interface BsProbe {
  lo: number;
  hi: number;
  mid: number;
  val: number;
  cmp: '=' | '<' | '>'; // arr[mid] 与目标的关系
}

export interface BsTrace {
  found: boolean;
  index: number; // 命中下标；未命中 −1
  probes: BsProbe[];
  finalLo: number; // 未命中时区间清空的 lo/hi（lo > hi）
  finalHi: number;
}

/** 闭区间二分的完整轨迹（与 linearFind 对拍）。 */
export function bsearchTrace(arr: number[], t: number): BsTrace {
  let lo = 0;
  let hi = arr.length - 1;
  const probes: BsProbe[] = [];
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = arr[mid];
    const cmp: BsProbe['cmp'] = val === t ? '=' : val < t ? '<' : '>';
    probes.push({ lo, hi, mid, val, cmp });
    if (cmp === '=') return { found: true, index: mid, probes, finalLo: lo, finalHi: hi };
    if (cmp === '<') lo = mid + 1;
    else hi = mid - 1;
  }
  return { found: false, index: -1, probes, finalLo: lo, finalHi: hi };
}
