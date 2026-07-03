// src/algorithms/completeknapsack.ts
// 完全背包固定物品 + 容量 + 二维 DP oracle。DP 大类第 5 页（C-065）。
// 与 0-1 背包唯一差别：「取」来自本行 dp[i][w-wt]（同一物品可无限次重复取）。

export const ITEM_LABELS = ['A', 'B', 'C'];
export const WEIGHTS = [2, 3, 4]; // 各物品重量
export const VALUES = [5, 6, 7]; // 各物品价值
export const CAPACITY = 6; // 背包容量

/** 二维 DP 求完全背包完整表（oracle），右下角 = 最大价值（本例 15 = A 拿 3 次） */
export function completeKnapsackTrace(): number[][] {
  const m = ITEM_LABELS.length;
  const W = CAPACITY;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let w = 1; w <= W; w++) {
      if (WEIGHTS[i - 1] > w) {
        dp[i][w] = dp[i - 1][w]; // 装不下 → 沿用上一行
      } else {
        // 取来自本行 dp[i][…]（区别于 0-1 的 dp[i-1][…]）：取完还能再取同一件
        dp[i][w] = Math.max(dp[i - 1][w], dp[i][w - WEIGHTS[i - 1]] + VALUES[i - 1]);
      }
    }
  }
  return dp;
}
