import type { LangSource, LinearSieveExecPoint } from '@/components/player/types';

// 外层 i 遍历所有数（不只素数）。对已知素数 p 划掉 i×p 并记 spf[i×p]=p；
// 一旦 i%p==0 就停——保证 i×p 的最小质因子恰是 p，于是每个合数只被划一次，严格 O(N)。
const ts = `function linearSieve(n: number): { primes: number[]; spf: number[] } {
  const isComp = new Array(n + 1).fill(false);
  const spf = new Array(n + 1).fill(0);
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (!isComp[i]) primes.push(i);        // i 没被划 → 素数
    for (const p of primes) {
      if (i * p > n) break;                // 越界停
      isComp[i * p] = true;                // 划掉 i×p（只此一次）
      spf[i * p] = p;                      // 它的最小质因子就是 p
      if (i % p === 0) break;              // p 是 i 的最小质因子 → 停
    }
  }
  return { primes, spf };
}`;

const python = `def linear_sieve(n):
    is_comp = [False] * (n + 1)
    spf = [0] * (n + 1)
    primes = []
    for i in range(2, n + 1):
        if not is_comp[i]: primes.append(i)    # i 没被划 → 素数
        for p in primes:
            if i * p > n: break                # 越界停
            is_comp[i * p] = True              # 划掉 i×p（只此一次）
            spf[i * p] = p                     # 它的最小质因子就是 p
            if i % p == 0: break               # p 是 i 的最小质因子 → 停
    return primes, spf`;

const go = `func linearSieve(n int) ([]int, []int) {
\tisComp := make([]bool, n+1)
\tspf := make([]int, n+1)
\tprimes := []int{}
\tfor i := 2; i <= n; i++ {
\t\tif !isComp[i] { primes = append(primes, i) } // i 没被划 → 素数
\t\tfor _, p := range primes {
\t\t\tif i*p > n { break }                        // 越界停
\t\t\tisComp[i*p] = true                          // 划掉 i×p（只此一次）
\t\t\tspf[i*p] = p                                // 它的最小质因子就是 p
\t\t\tif i%p == 0 { break }                       // p 是 i 的最小质因子 → 停
\t\t}
\t}
\treturn primes, spf
}`;

const rust = `fn linear_sieve(n: usize) -> (Vec<usize>, Vec<usize>) {
    let mut is_comp = vec![false; n + 1];
    let mut spf = vec![0usize; n + 1];
    let mut primes: Vec<usize> = Vec::new();
    for i in 2..=n {
        if !is_comp[i] { primes.push(i); }           // i 没被划 → 素数
        for &p in &primes.clone() {
            if i * p > n { break; }                  // 越界停
            is_comp[i * p] = true;                   // 划掉 i×p（只此一次）
            spf[i * p] = p;                          // 它的最小质因子就是 p
            if i % p == 0 { break; }                 // p 是 i 的最小质因子 → 停
        }
    }
    (primes, spf)
}`;

export const linearSieveSources: LangSource<LinearSieveExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建数组 / mark=划 i×p / rest=外层遍历所有 i / done=返回
    lineMap: { init: 2, mark: 9, rest: 5, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, mark: 9, rest: 5, done: 12 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, mark: 9, rest: 5, done: 14 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, mark: 9, rest: 5, done: 14 },
  },
];
