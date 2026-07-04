import type { LangSource, CoinChangeExecPoint } from '@/components/player/types';

const ts = `function change(amount: number, coins: number[]): number {
  const m = coins.length;
  const dp = Array.from({ length: m + 1 },
    () => Array(amount + 1).fill(0));
  dp[0][0] = 1;                        // 凑 0 元有 1 种：什么都不选
  for (let i = 1; i <= m; i++) {
    const c = coins[i - 1];
    for (let a = 0; a <= amount; a++) {
      dp[i][a] = dp[i - 1][a];         // 不用第 i 种硬币
      if (a >= c) dp[i][a] += dp[i][a - c]; // 用一枚（本行，可再用）
    }
  }
  return dp[m][amount];
}`;

const python = `def change(amount, coins):
    m = len(coins)
    dp = [[0]*(amount+1) for _ in range(m+1)]
    dp[0][0] = 1                       # 凑 0 元有 1 种
    for i in range(1, m+1):
        c = coins[i-1]
        for a in range(amount+1):
            dp[i][a] = dp[i-1][a]      # 不用第 i 种
            if a >= c:
                dp[i][a] += dp[i][a-c] # 用一枚（本行）
    return dp[m][amount]`;

const go = `func change(amount int, coins []int) int {
\tm := len(coins)
\tdp := make([][]int, m+1)
\tfor i := range dp { dp[i] = make([]int, amount+1) }
\tdp[0][0] = 1 // 凑 0 元有 1 种
\tfor i := 1; i <= m; i++ {
\t\tc := coins[i-1]
\t\tfor a := 0; a <= amount; a++ {
\t\t\tdp[i][a] = dp[i-1][a] // 不用第 i 种
\t\t\tif a >= c { dp[i][a] += dp[i][a-c] } // 用一枚（本行）
\t\t}
\t}
\treturn dp[m][amount]
}`;

const rust = `fn change(amount: usize, coins: &[usize]) -> u64 {
    let m = coins.len();
    let mut dp = vec![vec![0u64; amount + 1]; m + 1];
    dp[0][0] = 1; // 凑 0 元有 1 种
    for i in 1..=m {
        let c = coins[i - 1];
        for a in 0..=amount {
            dp[i][a] = dp[i - 1][a];         // 不用第 i 种
            if a >= c { dp[i][a] += dp[i][a - c]; } // 用一枚（本行）
        }
    }
    dp[m][amount]
}`;

export const coinChangeSources: LangSource<CoinChangeExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 5, skip: 9, add: 10, done: 13 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 4, skip: 8, add: 10, done: 11 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 5, skip: 9, add: 10, done: 13 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 4, skip: 8, add: 9, done: 12 },
  },
];
