// src/algorithms/treedp.ts
// 树形 DP 打家劫舍 III oracle。动态规划第 9 页（C-100，纯复用 MatrixView——节点两态表）。
// 层序 [4,1,5,3,6]：后序 3→4→1→2→0，根 (13,14) → max=14 = 暴力枚举不相邻子集。

export const TD_VALS = [4, 1, 5, 3, 6];

const kids = (i: number): number[] => [2 * i + 1, 2 * i + 2].filter((k) => k < TD_VALS.length);

export interface TdFill {
  i: number;
  val: number;
  kids: number[];
  sel: number; // 选它
  notv: number; // 不选它
}

/** 后序填表（order 与每节点两态全记录）。 */
export function treeDpFills(): { order: number[]; fills: TdFill[]; best: number } {
  const order: number[] = [];
  const post = (i: number): void => {
    for (const k of kids(i)) post(k);
    order.push(i);
  };
  post(0);
  const dp = new Map<number, [number, number]>();
  const fills: TdFill[] = [];
  for (const i of order) {
    const ks = kids(i);
    const sel = TD_VALS[i] + ks.reduce((s, k) => s + dp.get(k)![1], 0);
    const notv = ks.reduce((s, k) => s + Math.max(...dp.get(k)!), 0);
    dp.set(i, [sel, notv]);
    fills.push({ i, val: TD_VALS[i], kids: ks, sel, notv });
  }
  const [rs, rn] = dp.get(0)!;
  return { order, fills, best: Math.max(rs, rn) };
}

/** 暴力枚举全部不相邻（父子不同时选）子集（独立真值）。 */
export function bruteRob(): number {
  const n = TD_VALS.length;
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let ok = true;
    let sum = 0;
    for (let i = 0; i < n && ok; i++) {
      if (!(mask & (1 << i))) continue;
      sum += TD_VALS[i];
      for (const k of kids(i)) if (mask & (1 << k)) ok = false;
    }
    if (ok) best = Math.max(best, sum);
  }
  return best;
}
