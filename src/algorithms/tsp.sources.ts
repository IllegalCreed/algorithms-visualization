import type { LangSource, TspExecPoint } from '@/components/player/types';

// Held-Karp：dp[mask][i] = 已访 mask、现在城 i 的最短路程；pull 式从 mask∖{i} 转移。
const ts = `function tsp(d: number[][]): number {
  const n = d.length, FULL = (1 << n) - 1;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  dp[1][0] = 0;                                // 从城 0 出发
  for (let mask = 3; mask <= FULL; mask++) {
    if (!(mask & 1)) continue;                 // 必含起点
    for (let i = 1; i < n; i++) {
      if (!(mask & (1 << i))) continue;
      const prev = mask ^ (1 << i);            // 去掉 i 的前置集合
      for (let j = 0; j < n; j++)              // 上一站 j
        if (prev & (1 << j))
          dp[mask][i] = Math.min(dp[mask][i], dp[prev][j] + d[j][i]);
    }
  }
  let best = Infinity;
  for (let i = 1; i < n; i++)                  // 回到起点收尾
    best = Math.min(best, dp[FULL][i] + d[i][0]);
  return best;
}`;

const python = `def tsp(d):
    n = len(d)
    FULL = (1 << n) - 1
    INF = float('inf')
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0                        # 从城 0 出发
    for mask in range(3, FULL + 1):
        if not mask & 1:
            continue                    # 必含起点
        for i in range(1, n):
            if not mask & (1 << i):
                continue
            prev = mask ^ (1 << i)      # 去掉 i 的前置集合
            for j in range(n):          # 上一站 j
                if prev & (1 << j):
                    dp[mask][i] = min(dp[mask][i], dp[prev][j] + d[j][i])
    return min(dp[FULL][i] + d[i][0]    # 回到起点收尾
               for i in range(1, n))`;

const go = `func tsp(d [][]int) int {
\tn := len(d)
\tFULL := (1 << n) - 1
\tINF := 1 << 60
\tdp := make([][]int, 1<<n)
\tfor m := range dp {
\t\tdp[m] = make([]int, n)
\t\tfor i := range dp[m] {
\t\t\tdp[m][i] = INF
\t\t}
\t}
\tdp[1][0] = 0 // 从城 0 出发
\tfor mask := 3; mask <= FULL; mask++ {
\t\tif mask&1 == 0 {
\t\t\tcontinue // 必含起点
\t\t}
\t\tfor i := 1; i < n; i++ {
\t\t\tif mask&(1<<i) == 0 {
\t\t\t\tcontinue
\t\t\t}
\t\t\tprev := mask ^ (1 << i) // 去掉 i 的前置集合
\t\t\tfor j := 0; j < n; j++ { // 上一站 j
\t\t\t\tif prev&(1<<j) != 0 {
\t\t\t\t\tdp[mask][i] = min(dp[mask][i], dp[prev][j]+d[j][i])
\t\t\t\t}
\t\t\t}
\t\t}
\t}
\tbest := INF
\tfor i := 1; i < n; i++ { // 回到起点收尾
\t\tbest = min(best, dp[FULL][i]+d[i][0])
\t}
\treturn best
}`;

const rust = `fn tsp(d: &[Vec<i64>]) -> i64 {
    let n = d.len();
    let full = (1usize << n) - 1;
    let mut dp = vec![vec![i64::MAX; n]; 1 << n];
    dp[1][0] = 0;                              // 从城 0 出发
    for mask in 3..=full {
        if mask & 1 == 0 {
            continue;                          // 必含起点
        }
        for i in 1..n {
            if mask & (1 << i) == 0 {
                continue;
            }
            let prev = mask ^ (1 << i);        // 去掉 i 的前置集合
            for j in 0..n {                    // 上一站 j
                if prev & (1 << j) != 0 && dp[prev][j] < i64::MAX {
                    dp[mask][i] = dp[mask][i].min(dp[prev][j] + d[j][i]);
                }
            }
        }
    }
    (1..n).map(|i| dp[full][i] + d[i][0]).min().unwrap() // 回起点收尾
}`;

export const tspSources: LangSource<TspExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=起点状态 / fill=转移取 min / close=回边收尾 / done=返回
    lineMap: { init: 4, fill: 12, close: 17, done: 18 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 6, fill: 16, close: 17, done: 17 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 12, fill: 24, close: 31, done: 33 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 5, fill: 17, close: 22, done: 22 },
  },
];
