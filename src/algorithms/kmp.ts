// src/algorithms/kmp.ts
// KMP 固定文本/模式 + 部分匹配表(LPS) + 匹配 oracle。字符串大类首发（C-062，KmpView 新轨）。

export const KMP_TEXT = 'abababcab';
export const KMP_PATTERN = 'ababc';

/** 部分匹配表 LPS：lps[k] = pattern[0..k] 最长「既是真前缀又是真后缀」的长度 */
export function kmpLps(): number[] {
  const p = KMP_PATTERN;
  const m = p.length;
  const lps = Array<number>(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    if (p[i] === p[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  return lps;
}

/** KMP 匹配：返回所有命中的起点（文本下标） */
export function kmpMatches(): number[] {
  const t = KMP_TEXT;
  const p = KMP_PATTERN;
  const n = t.length;
  const m = p.length;
  const lps = kmpLps();
  const res: number[] = [];
  let i = 0;
  let j = 0;
  while (i < n) {
    if (t[i] === p[j]) {
      i++;
      j++;
      if (j === m) {
        res.push(i - m);
        j = lps[j - 1];
      }
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return res;
}
