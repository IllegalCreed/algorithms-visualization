// src/algorithms/manacher.ts
// Manacher 固定串 + 转换串 + 半径数组 + 最长回文 oracle。字符串大类第 4 页（C-067，新建 ManacherView 回文轨）。

export const MANACHER_RAW = 'babad';

/** 预处理：字符间插 '#' 统一奇偶回文。babad → #b#a#b#a#d# */
export function manacherTransform(): string {
  return '#' + MANACHER_RAW.split('').join('#') + '#';
}

/** Manacher 半径数组：p[i] = 以转换串下标 i 为中心的回文半径。babad → [0,1,0,3,0,3,0,1,0,1,0] */
export function manacherRadii(): number[] {
  const t = manacherTransform();
  const n = t.length;
  const p = new Array<number>(n).fill(0);
  let c = 0;
  let r = 0; // 当前最右回文的右边界（含），r = c + p[c]
  for (let i = 0; i < n; i++) {
    if (i < r) p[i] = Math.min(r - i, p[2 * c - i]); // 对称性复用
    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && t[i - p[i] - 1] === t[i + p[i] + 1]) p[i]++;
    if (i + p[i] > r) {
      c = i;
      r = i + p[i];
    }
  }
  return p;
}

/** 最长回文子串（原串）：取 p 最大的中心还原。babad → bab */
export function longestPalindrome(): string {
  const p = manacherRadii();
  let best = 0;
  let ci = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] > best) {
      best = p[i];
      ci = i;
    }
  }
  const start = (ci - best) / 2;
  return MANACHER_RAW.substr(start, best);
}
