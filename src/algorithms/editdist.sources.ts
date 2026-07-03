import type { LangSource, EditDistExecPoint } from '@/components/player/types';

const ts = `function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`;

const python = `def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(m + 1):
        dp[i][0] = i
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`;

const go = `func editDistance(a, b string) int {
\tm, n := len(a), len(b)
\tdp := make([][]int, m+1)
\tfor i := range dp {
\t\tdp[i] = make([]int, n+1)
\t}
\tfor j := 0; j <= n; j++ {
\t\tdp[0][j] = j
\t}
\tfor i := 0; i <= m; i++ {
\t\tdp[i][0] = i
\t}
\tfor i := 1; i <= m; i++ {
\t\tfor j := 1; j <= n; j++ {
\t\t\tif a[i-1] == b[j-1] {
\t\t\t\tdp[i][j] = dp[i-1][j-1]
\t\t\t} else {
\t\t\t\tdp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
\t\t\t}
\t\t}
\t}
\treturn dp[m][n]
}`;

const rust = `fn edit_distance(a: &str, b: &str) -> usize {
    let (a, b) = (a.as_bytes(), b.as_bytes());
    let (m, n) = (a.len(), b.len());
    let mut dp = vec![vec![0; n + 1]; m + 1];
    for j in 0..=n {
        dp[0][j] = j;
    }
    for i in 0..=m {
        dp[i][0] = i;
    }
    for i in 1..=m {
        for j in 1..=n {
            if a[i - 1] == b[j - 1] {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + dp[i - 1][j - 1].min(dp[i - 1][j]).min(dp[i][j - 1]);
            }
        }
    }
    dp[m][n]
}`;

export const editDistSources: LangSource<EditDistExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 4, cellMatch: 9, cellDiff: 12, done: 16 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 4, cellMatch: 11, cellDiff: 13, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 7, cellMatch: 16, cellDiff: 18, done: 22 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 5, cellMatch: 14, cellDiff: 16, done: 20 },
  },
];
