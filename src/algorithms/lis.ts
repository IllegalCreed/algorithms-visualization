// src/algorithms/lis.ts
// 最长递增子序列固定输入 + 一维 DP + 回溯 oracle。动态规划大类第 4 页（C-061，一维 DP）。

export const LIS_INPUT = [1, 3, 2, 4, 3, 5];

/** 一维 DP：dp[i] = 以 a[i] 结尾的最长递增子序列长度；pred[i] = 前驱下标（-1 无） */
export function lisDp(): { dp: number[]; pred: number[] } {
  const a = LIS_INPUT;
  const n = a.length;
  const dp = Array<number>(n).fill(1);
  const pred = Array<number>(n).fill(-1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (a[j] < a[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        pred[i] = j;
      }
    }
  }
  return { dp, pred };
}

/** LIS 长度 = max(dp) */
export function lisLength(): number {
  return Math.max(...lisDp().dp);
}

/** 构成一条 LIS 的下标序列（从 max(dp) 处沿 pred 回溯） */
export function lisIndices(): number[] {
  const { dp, pred } = lisDp();
  let best = 0;
  for (let i = 1; i < dp.length; i++) if (dp[i] > dp[best]) best = i;
  const idx: number[] = [];
  let cur = best;
  while (cur !== -1) {
    idx.unshift(cur);
    cur = pred[cur];
  }
  return idx;
}

/** 构成一条 LIS 的元素值序列 */
export function lisValues(): number[] {
  return lisIndices().map((i) => LIS_INPUT[i]);
}
