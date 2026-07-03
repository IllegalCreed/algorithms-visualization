// src/algorithms/boyermoore.ts
// Boyer-Moore 固定文本/模式 + 坏字符表 + 匹配 oracle。字符串大类第 3 页（C-064，复用 KmpView 轨）。

export const BM_TEXT = 'abcabxabc';
export const BM_PATTERN = 'abc';

/** 坏字符表：last[c] = 字符 c 在模式中最右出现下标（不在则查不到，视作 -1） */
export function bmLast(): Record<string, number> {
  const last: Record<string, number> = {};
  for (let i = 0; i < BM_PATTERN.length; i++) last[BM_PATTERN[i]] = i;
  return last;
}

/** Boyer-Moore 坏字符规则匹配：返回所有命中起点（文本下标） */
export function bmMatches(): number[] {
  const t = BM_TEXT;
  const p = BM_PATTERN;
  const n = t.length;
  const m = p.length;
  const last = bmLast();
  const res: number[] = [];
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && p[j] === t[s + j]) j--;
    if (j < 0) {
      res.push(s);
      s += 1;
    } else {
      s += Math.max(1, j - (last[t[s + j]] ?? -1));
    }
  }
  return res;
}
