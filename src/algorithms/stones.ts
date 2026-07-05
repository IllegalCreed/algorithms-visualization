// src/algorithms/stones.ts
// 石子合并 oracle。动态规划第 7 页（C-098，纯复用 MatrixView——区间 DP 上三角表）。
// [4,1,3,2]：len2 5/4/5 → len3 12(k=0)/10(k=2) → len4 20(k=0) = 暴力枚举全部合并顺序。

export const ST_PILES = [4, 1, 3, 2];

export interface StFill {
  i: number;
  j: number;
  len: number;
  sum: number; // 区间和（本次合并代价）
  cands: { k: number; cost: number }[]; // 各分割点的 dp[i][k]+dp[k+1][j]
  bestK: number;
  val: number; // dp[i][j]
}

/** 区间 DP 填表（len 由短及长；候选与胜者全记录）。 */
export function stonesDp(): { dp: number[][]; fills: StFill[] } {
  const n = ST_PILES.length;
  const pre = [0];
  for (const x of ST_PILES) pre.push(pre[pre.length - 1] + x);
  const sum = (i: number, j: number): number => pre[j + 1] - pre[i];
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const fills: StFill[] = [];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const cands: { k: number; cost: number }[] = [];
      let best = Infinity;
      let bestK = -1;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j];
        cands.push({ k, cost });
        if (cost < best) {
          best = cost;
          bestK = k;
        }
      }
      dp[i][j] = best + sum(i, j);
      fills.push({ i, j, len, sum: sum(i, j), cands, bestK, val: dp[i][j] });
    }
  }
  return { dp, fills };
}

/** 暴力枚举全部相邻合并顺序（独立真值）。 */
export function bruteMerge(seq: number[] = ST_PILES): number {
  if (seq.length === 1) return 0;
  let best = Infinity;
  for (let i = 0; i + 1 < seq.length; i++) {
    const cost = seq[i] + seq[i + 1];
    const next = [...seq.slice(0, i), cost, ...seq.slice(i + 2)];
    best = Math.min(best, cost + bruteMerge(next));
  }
  return best;
}
