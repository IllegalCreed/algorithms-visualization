// src/algorithms/lcs.ts
// 最长公共子序列固定两串 + DP 表 + 回溯 oracle。动态规划大类第 3 页（C-060，填表 + 回溯恢复解）。

export const LCS_X = 'ABCD';
export const LCS_Y = 'ACDF';

/** 完整 DP 表：dp[i][j] = X 前 i 个与 Y 前 j 个的 LCS 长度 */
export function lcsDp(): number[][] {
  const m = LCS_X.length;
  const n = LCS_Y.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (LCS_X[i - 1] === LCS_Y[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

/** LCS 长度（右下角） */
export function lcsLength(): number {
  const dp = lcsDp();
  return dp[LCS_X.length][LCS_Y.length];
}

/** 回溯路径格序列（从右下角回走到边界，匹配走对角、否则往大的上/左走） */
export function lcsPath(): [number, number][] {
  const dp = lcsDp();
  const path: [number, number][] = [];
  let i = LCS_X.length;
  let j = LCS_Y.length;
  while (i > 0 && j > 0) {
    path.push([i, j]);
    if (LCS_X[i - 1] === LCS_Y[j - 1]) {
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return path;
}

/** 回溯恢复出的 LCS 字符串 */
export function lcsString(): string {
  const dp = lcsDp();
  let i = LCS_X.length;
  let j = LCS_Y.length;
  let s = '';
  while (i > 0 && j > 0) {
    if (LCS_X[i - 1] === LCS_Y[j - 1]) {
      s = LCS_X[i - 1] + s;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return s;
}
