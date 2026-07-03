import type { LangSource, LisExecPoint } from '@/components/player/types';

const ts = `function longestIncreasingSubseq(a: number[]): number[] {
  const n = a.length;
  const dp = new Array(n).fill(1);               // 每个元素自身长度 1
  const pred = new Array(n).fill(-1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (a[j] < a[i] && dp[j] + 1 > dp[i]) {    // 能接得更长
        dp[i] = dp[j] + 1;
        pred[i] = j;
      }
    }
  }
  let best = 0;
  for (let i = 1; i < n; i++) if (dp[i] > dp[best]) best = i; // 最长在哪结尾
  const lis: number[] = [];
  for (let k = best; k !== -1; k = pred[k]) lis.unshift(a[k]); // 回溯恢复
  return lis;
}`;

const python = `def longest_increasing_subseq(a):
    n = len(a)
    dp = [1] * n                              # 每个元素自身长度 1
    pred = [-1] * n
    for i in range(1, n):
        for j in range(i):
            if a[j] < a[i] and dp[j] + 1 > dp[i]:   # 能接得更长
                dp[i] = dp[j] + 1
                pred[i] = j
    best = 0
    for i in range(1, n):
        if dp[i] > dp[best]:                  # 最长在哪结尾
            best = i
    lis = []
    k = best
    while k != -1:
        lis.insert(0, a[k])                   # 回溯恢复
        k = pred[k]
    return lis`;

const go = `func longestIncreasingSubseq(a []int) []int {
\tn := len(a)
\tdp := make([]int, n)
\tpred := make([]int, n)
\tfor i := range dp {
\t\tdp[i] = 1              // 每个元素自身长度 1
\t\tpred[i] = -1
\t}
\tfor i := 1; i < n; i++ {
\t\tfor j := 0; j < i; j++ {
\t\t\tif a[j] < a[i] && dp[j]+1 > dp[i] { // 能接得更长
\t\t\t\tdp[i] = dp[j] + 1
\t\t\t\tpred[i] = j
\t\t\t}
\t\t}
\t}
\tbest := 0
\tfor i := 1; i < n; i++ {
\t\tif dp[i] > dp[best] { // 最长在哪结尾
\t\t\tbest = i
\t\t}
\t}
\tlis := []int{}
\tfor k := best; k != -1; k = pred[k] {
\t\tlis = append([]int{a[k]}, lis...) // 回溯恢复
\t}
\treturn lis
}`;

const rust = `fn longest_increasing_subseq(a: &[i32]) -> Vec<i32> {
    let n = a.len();
    let mut dp = vec![1; n];               // 每个元素自身长度 1
    let mut pred = vec![-1i32; n];
    for i in 1..n {
        for j in 0..i {
            if a[j] < a[i] && dp[j] + 1 > dp[i] {  // 能接得更长
                dp[i] = dp[j] + 1;
                pred[i] = j as i32;
            }
        }
    }
    let mut best = 0;
    for i in 1..n {
        if dp[i] > dp[best] { best = i; }  // 最长在哪结尾
    }
    let mut lis = Vec::new();
    let mut k = best as i32;
    while k != -1 {
        lis.insert(0, a[k as usize]);      // 回溯恢复
        k = pred[k as usize];
    }
    lis
}`;

export const lisSources: LangSource<LisExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 3, scan: 7, extend: 8, fillDone: 14, result: 16 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 3, scan: 7, extend: 8, fillDone: 12, result: 17 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 6, scan: 11, extend: 12, fillDone: 19, result: 25 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 3, scan: 7, extend: 8, fillDone: 15, result: 20 },
  },
];
