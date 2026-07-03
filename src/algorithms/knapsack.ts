// src/algorithms/knapsack.ts
// 0-1 背包固定物品 + 容量 + 二维 DP oracle。DP 大类 DP2（C-054）。

export const ITEM_LABELS = ['A', 'B', 'C', 'D'];
export const WEIGHTS = [2, 3, 4, 5]; // 各物品重量
export const VALUES = [3, 4, 5, 6]; // 各物品价值
export const CAPACITY = 5; // 背包容量

/** 二维 DP 求 0-1 背包完整表（oracle），右下角 = 最大价值 */
export function knapsackTrace(): number[][] {
  const m = ITEM_LABELS.length;
  const W = CAPACITY;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let w = 1; w <= W; w++) {
      if (WEIGHTS[i - 1] > w) {
        dp[i][w] = dp[i - 1][w]; // 装不下 → 不取
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - WEIGHTS[i - 1]] + VALUES[i - 1]);
      }
    }
  }
  return dp;
}
