import type { LangSource, StoneExecPoint } from '@/components/player/types';

// 区间 DP：dp[i][j] = min_k(dp[i][k] + dp[k+1][j]) + sum(i..j)，len 由短及长。
const ts = `function stoneMerge(a: number[]): number {
  const n = a.length;
  const pre = [0];
  for (const x of a) pre.push(pre[pre.length - 1] + x);
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++)        // 区间由短及长
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++)           // 枚举分割点
        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j]);
      dp[i][j] += pre[j + 1] - pre[i];      // 本次合并代价 = 区间和
    }
  return dp[0][n - 1];
}`;

const python = `def stone_merge(a):
    n = len(a)
    pre = [0]
    for x in a:
        pre.append(pre[-1] + x)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):       # 区间由短及长
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = min(dp[i][k] + dp[k + 1][j]
                           for k in range(i, j))   # 枚举分割点
            dp[i][j] += pre[j + 1] - pre[i]        # 本次合并代价
    return dp[0][n - 1]`;

const go = `func stoneMerge(a []int) int {
\tn := len(a)
\tpre := make([]int, n+1)
\tfor i, x := range a {
\t\tpre[i+1] = pre[i] + x
\t}
\tdp := make([][]int, n)
\tfor i := range dp {
\t\tdp[i] = make([]int, n)
\t}
\tfor length := 2; length <= n; length++ { // 区间由短及长
\t\tfor i := 0; i+length-1 < n; i++ {
\t\t\tj := i + length - 1
\t\t\tdp[i][j] = 1 << 60
\t\t\tfor k := i; k < j; k++ { // 枚举分割点
\t\t\t\tdp[i][j] = min(dp[i][j], dp[i][k]+dp[k+1][j])
\t\t\t}
\t\t\tdp[i][j] += pre[j+1] - pre[i] // 本次合并代价
\t\t}
\t}
\treturn dp[0][n-1]
}`;

const rust = `fn stone_merge(a: &[i64]) -> i64 {
    let n = a.len();
    let mut pre = vec![0i64; n + 1];
    for (i, &x) in a.iter().enumerate() {
        pre[i + 1] = pre[i] + x;
    }
    let mut dp = vec![vec![0i64; n]; n];
    for len in 2..=n {                       // 区间由短及长
        for i in 0..=(n - len) {
            let j = i + len - 1;
            dp[i][j] = i64::MAX;
            for k in i..j {                  // 枚举分割点
                dp[i][j] = dp[i][j].min(dp[i][k] + dp[k + 1][j]);
            }
            dp[i][j] += pre[j + 1] - pre[i]; // 本次合并代价
        }
    }
    dp[0][n - 1]
}`;

export const stoneSources: LangSource<StoneExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建表 / pair=len 循环起步 / split=枚举分割点 / done=返回
    lineMap: { init: 5, pair: 6, split: 10, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 6, pair: 7, split: 10, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 7, pair: 11, split: 15, done: 21 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 7, pair: 8, split: 12, done: 18 },
  },
];
