// src/algorithms/editdist.ts
// 编辑距离（Levenshtein）固定两串 + 二维 DP oracle。DP 大类首发（C-053）。

export const SOURCE = 'SAT'; // 行（源串）
export const TARGET = 'SUN'; // 列（目标串）

/** 二维 DP 求完整编辑距离表（oracle），右下角 = 编辑距离 */
export function editDistTrace(): number[][] {
  const m = SOURCE.length;
  const n = TARGET.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let j = 0; j <= n; j++) dp[0][j] = j; // 空串 → 前 j：插入 j 次
  for (let i = 0; i <= m; i++) dp[i][0] = i; // 前 i → 空串：删除 i 次
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (SOURCE[i - 1] === TARGET[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}
