// src/algorithms/rabinkarp.ts
// Rabin-Karp 固定文本/模式 + 滚动哈希 + 匹配 oracle。字符串大类第 2 页（C-063，复用 KmpView 轨）。

export const RK_TEXT = 'abcabcab';
export const RK_PATTERN = 'cab';
export const RK_BASE = 10;
export const RK_MOD = 997;

/** 字符值：a=1,b=2,c=3（charCode-96） */
export const rkVal = (ch: string): number => ch.charCodeAt(0) - 96;

/** 多项式哈希：hash(s) = (…(s0·B+s1)·B+…+s_{m-1}) mod M */
export function rkHash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * RK_BASE + rkVal(ch)) % RK_MOD;
  return h;
}

/** 每个长度 m 窗口的哈希序列 */
export function rkWindowHashes(): number[] {
  const t = RK_TEXT;
  const m = RK_PATTERN.length;
  const res: number[] = [];
  for (let i = 0; i + m <= t.length; i++) res.push(rkHash(t.slice(i, i + m)));
  return res;
}

/** Rabin-Karp 匹配：哈希相等且逐字符验证通过 → 命中起点 */
export function rkMatches(): number[] {
  const t = RK_TEXT;
  const p = RK_PATTERN;
  const m = p.length;
  const ph = rkHash(p);
  const res: number[] = [];
  for (let i = 0; i + m <= t.length; i++) {
    const window = t.slice(i, i + m);
    if (rkHash(window) === ph && window === p) res.push(i);
  }
  return res;
}
