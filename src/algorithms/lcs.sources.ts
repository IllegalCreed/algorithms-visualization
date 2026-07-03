import type { LangSource, LcsExecPoint } from '@/components/player/types';

const ts = `function lcs(x: string, y: string): string {
  const m = x.length, n = y.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (x[i - 1] === y[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1; // 相同：左上 + 1
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);       // 不同：上/左较大
    }
  }
  let i = m, j = n, s = "";
  while (i > 0 && j > 0) {                        // 回溯恢复 LCS
    if (x[i - 1] === y[j - 1]) { s = x[i - 1] + s; i--; j--; }    // 收字符走对角
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;   // 往大的上/左走
    else j--;
  }
  return s;
}`;

const python = `def lcs(x, y):
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i-1] == y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1              # 相同：左上 + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])   # 不同：上/左较大
    i, j, s = m, n, ""
    while i > 0 and j > 0:                               # 回溯恢复 LCS
        if x[i-1] == y[j-1]:
            s = x[i-1] + s; i -= 1; j -= 1               # 收字符走对角
        elif dp[i-1][j] >= dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    return s`;

const go = `func lcs(x, y string) string {
\tm, n := len(x), len(y)
\tdp := make([][]int, m+1)
\tfor i := range dp {
\t\tdp[i] = make([]int, n+1)
\t}
\tfor i := 1; i <= m; i++ {
\t\tfor j := 1; j <= n; j++ {
\t\t\tif x[i-1] == y[j-1] {
\t\t\t\tdp[i][j] = dp[i-1][j-1] + 1         // 相同：左上 + 1
\t\t\t} else if dp[i-1][j] >= dp[i][j-1] {
\t\t\t\tdp[i][j] = dp[i-1][j]               // 不同：上/左较大
\t\t\t} else {
\t\t\t\tdp[i][j] = dp[i][j-1]
\t\t\t}
\t\t}
\t}
\ti, j, s := m, n, ""
\tfor i > 0 && j > 0 {                        // 回溯恢复 LCS
\t\tif x[i-1] == y[j-1] {
\t\t\ts = string(x[i-1]) + s; i--; j--       // 收字符走对角
\t\t} else if dp[i-1][j] >= dp[i][j-1] {
\t\t\ti--
\t\t} else {
\t\t\tj--
\t\t}
\t}
\treturn s
}`;

const rust = `fn lcs(x: &str, y: &str) -> String {
    let (xs, ys): (Vec<char>, Vec<char>) = (x.chars().collect(), y.chars().collect());
    let (m, n) = (xs.len(), ys.len());
    let mut dp = vec![vec![0; n + 1]; m + 1];
    for i in 1..=m {
        for j in 1..=n {
            if xs[i - 1] == ys[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;           // 相同：左上 + 1
            } else {
                dp[i][j] = dp[i - 1][j].max(dp[i][j - 1]); // 不同：上/左较大
            }
        }
    }
    let (mut i, mut j, mut s) = (m, n, String::new());
    while i > 0 && j > 0 {                                 // 回溯恢复 LCS
        if xs[i - 1] == ys[j - 1] {
            s.insert(0, xs[i - 1]); i -= 1; j -= 1;        // 收字符走对角
        } else if dp[i - 1][j] >= dp[i][j - 1] {
            i -= 1;
        } else {
            j -= 1;
        }
    }
    s
}`;

export const lcsSources: LangSource<LcsExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 3, match: 6, mismatch: 7, fillDone: 9, trace: 12, done: 16 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 3, match: 7, mismatch: 9, fillDone: 10, trace: 13, done: 18 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 5, match: 10, mismatch: 12, fillDone: 17, trace: 21, done: 28 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 4, match: 8, mismatch: 10, fillDone: 13, trace: 17, done: 24 },
  },
];
