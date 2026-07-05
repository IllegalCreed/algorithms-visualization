// src/algorithms/digitdp.ts
// 数位 DP oracle。动态规划第 10 页（C-101，纯复用 MatrixView——走位表）。
// N=245、禁 4：百位 162 + 十位 36（tight 在 4 断裂）= 198 → 去 0 得 197 = 暴力。

export const DD_N = 245;
export const DD_BAN = 4;

export interface DdRow {
  d: number; // 上界位数字
  cnt: number | null; // 自由分支可选数（tight 已断为 null）
  pow: number | null; // 后缀 9^k
  sub: number | null; // 小计
  tightOk: boolean | null; // 本位能否贴着走（已断为 null）
}

/** 按位走上界（rows 全记录）。 */
export function digitWalk(): { rows: DdRow[]; total: number; ans: number } {
  const ds = [...String(DD_N)].map(Number);
  const rows: DdRow[] = [];
  let total = 0;
  let tight = true;
  for (let i = 0; i < ds.length; i++) {
    const d = ds[i];
    if (!tight) {
      rows.push({ d, cnt: null, pow: null, sub: null, tightOk: null });
      continue;
    }
    const free = ds.length - i - 1;
    let cnt = 0;
    for (let x = 0; x < d; x++) if (x !== DD_BAN) cnt++;
    const pow = 9 ** free;
    const sub = cnt * pow;
    total += sub;
    const tightOk = d !== DD_BAN;
    rows.push({ d, cnt, pow, sub, tightOk });
    if (!tightOk) tight = false;
  }
  if (tight) total += 1; // N 自身合法则计入
  return { rows, total, ans: total - 1 }; // 去掉 0
}

/** 暴力逐个检查（独立真值）。 */
export function bruteCount(): number {
  let c = 0;
  for (let x = 1; x <= DD_N; x++) {
    if (!String(x).includes(String(DD_BAN))) c++;
  }
  return c;
}
