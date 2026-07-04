// src/algorithms/lcparray.ts
// LCP/height 数组 Kasai oracle。字符串大类第 6 页（C-073，扩展 SuffixArrayView LCP 模式），复用 C-072 后缀数组。

import { SA_STR, suffixArray } from './suffixarray';

/** sa 的逆：rank[起点 i] = 后缀 i 在 sa 中的排序位次 */
export function saRank(): number[] {
  const sa = suffixArray();
  const rank = new Array<number>(sa.length);
  sa.forEach((p, idx) => (rank[p] = idx));
  return rank;
}

/** Kasai 算法求 LCP（height）数组：lcp[i] = LCP(sa[i-1], sa[i])，lcp[0]=0。banana → [0,1,3,0,0,2] */
export function kasaiLcp(): number[] {
  const s = SA_STR;
  const n = s.length;
  const sa = suffixArray();
  const rank = saRank();
  const lcp = new Array<number>(n).fill(0);
  let h = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] > 0) {
      const j = sa[rank[i] - 1];
      while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
      lcp[rank[i]] = h;
      if (h > 0) h--;
    } else {
      h = 0;
    }
  }
  return lcp;
}
