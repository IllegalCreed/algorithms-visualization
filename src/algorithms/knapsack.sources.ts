import type { LangSource, KnapsackExecPoint } from '@/components/player/types';

const ts = `function knapsack(w: number[], v: number[], W: number): number {
  const m = w.length;
  const dp = Array.from({ length: m + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let c = 1; c <= W; c++) {
      if (w[i - 1] > c) {
        dp[i][c] = dp[i - 1][c];
      } else {
        dp[i][c] = Math.max(
          dp[i - 1][c], dp[i - 1][c - w[i - 1]] + v[i - 1]);
      }
    }
  }
  return dp[m][W];
}`;

const python = `def knapsack(w, v, W):
    m = len(w)
    dp = [[0] * (W + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for c in range(1, W + 1):
            if w[i - 1] > c:
                dp[i][c] = dp[i - 1][c]
            else:
                dp[i][c] = max(
                    dp[i - 1][c], dp[i - 1][c - w[i - 1]] + v[i - 1])
    return dp[m][W]`;

const go = `func knapsack(w, v []int, W int) int {
\tm := len(w)
\tdp := make([][]int, m+1)
\tfor i := range dp {
\t\tdp[i] = make([]int, W+1)
\t}
\tfor i := 1; i <= m; i++ {
\t\tfor c := 1; c <= W; c++ {
\t\t\tif w[i-1] > c {
\t\t\t\tdp[i][c] = dp[i-1][c]
\t\t\t} else {
\t\t\t\tdp[i][c] = max(dp[i-1][c], dp[i-1][c-w[i-1]]+v[i-1])
\t\t\t}
\t\t}
\t}
\treturn dp[m][W]
}`;

const rust = `fn knapsack(w: &[usize], v: &[usize], cap: usize) -> usize {
    let m = w.len();
    let mut dp = vec![vec![0; cap + 1]; m + 1];
    for i in 1..=m {
        for c in 1..=cap {
            if w[i - 1] > c {
                dp[i][c] = dp[i - 1][c];
            } else {
                dp[i][c] = dp[i - 1][c].max(dp[i - 1][c - w[i - 1]] + v[i - 1]);
            }
        }
    }
    dp[m][cap]
}`;

export const knapsackSources: LangSource<KnapsackExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 3, cellSkip: 7, cellChoose: 9, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 3, cellSkip: 7, cellChoose: 9, done: 11 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 3, cellSkip: 10, cellChoose: 12, done: 16 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 3, cellSkip: 7, cellChoose: 9, done: 13 },
  },
];
