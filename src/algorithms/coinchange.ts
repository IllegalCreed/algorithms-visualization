// src/algorithms/coinchange.ts
// 硬币找零方案数固定硬币 + 金额 + 二维计数 DP oracle。DP 大类第 6 页（C-070，复用 MatrixView）。
// 每种硬币无限枚，dp[i][a] = 用前 i 种硬币凑出金额 a 的方案数。

export const COINS = [1, 2, 5];
export const COIN_AMOUNT = 5;

/** 二维计数 DP（oracle）：dp[0][0]=1；dp[i][a]=dp[i-1][a] + (a>=面额 ? dp[i][a-面额] : 0)。右下角 = 方案数（本例 4） */
export function coinChangeTrace(): number[][] {
  const m = COINS.length;
  const W = COIN_AMOUNT;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(W + 1).fill(0));
  dp[0][0] = 1;
  for (let i = 1; i <= m; i++) {
    const c = COINS[i - 1];
    for (let a = 0; a <= W; a++) {
      dp[i][a] = dp[i - 1][a]; // 不用第 i 种硬币
      if (a >= c) dp[i][a] += dp[i][a - c]; // 用一枚第 i 种（本行，可再用）
    }
  }
  return dp;
}
