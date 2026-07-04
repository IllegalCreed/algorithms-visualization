import type { LangSource, SieveExecPoint } from '@/components/player/types';

// isComposite[x] = x 是否已被划掉（合数）。从 2 起，每个没被划掉的 p 是素数，
// 划掉它从 p² 起的倍数（更小倍数早被更小素数划过）；p²>n 后不再有可划的倍数，剩下都是素数。
const ts = `function sieve(n: number): number[] {
  const isComposite = new Array(n + 1).fill(false);   // 初始都没划掉
  const primes: number[] = [];
  for (let p = 2; p <= n; p++) {
    if (!isComposite[p]) {                            // p 没被划掉 → 素数
      primes.push(p);
      for (let m = p * p; m <= n; m += p)             // 从 p² 起划掉 p 的倍数
        isComposite[m] = true;
    }
  }
  return primes;                                      // 剩下没划掉的都是素数
}`;

const python = `def sieve(n):
    is_composite = [False] * (n + 1)          # 初始都没划掉
    primes = []
    for p in range(2, n + 1):
        if not is_composite[p]:               # p 没被划掉 → 素数
            primes.append(p)
            for m in range(p * p, n + 1, p):  # 从 p² 起划掉 p 的倍数
                is_composite[m] = True
    return primes                             # 剩下没划掉的都是素数`;

const go = `func sieve(n int) []int {
\tisComposite := make([]bool, n+1)          // 初始都没划掉
\tprimes := []int{}
\tfor p := 2; p <= n; p++ {
\t\tif !isComposite[p] {                    // p 没被划掉 → 素数
\t\t\tprimes = append(primes, p)
\t\t\tfor m := p * p; m <= n; m += p {      // 从 p² 起划掉 p 的倍数
\t\t\t\tisComposite[m] = true
\t\t\t}
\t\t}
\t}
\treturn primes                             // 剩下没划掉的都是素数
}`;

const rust = `fn sieve(n: usize) -> Vec<usize> {
    let mut is_composite = vec![false; n + 1];   // 初始都没划掉
    let mut primes = Vec::new();
    for p in 2..=n {
        if !is_composite[p] {                    // p 没被划掉 → 素数
            primes.push(p);
            let mut m = p * p;
            while m <= n {                        // 从 p² 起划掉 p 的倍数
                is_composite[m] = true;
                m += p;
            }
        }
    }
    primes                                       // 剩下没划掉的都是素数
}`;

export const sieveSources: LangSource<SieveExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建数组 / prime=检测素数 / mark=划倍数 / rest=同 prime（p²>n 仅检测不划）/ done=返回
    lineMap: { init: 2, prime: 5, mark: 7, rest: 5, done: 11 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, prime: 5, mark: 7, rest: 5, done: 9 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, prime: 5, mark: 7, rest: 5, done: 12 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, prime: 5, mark: 8, rest: 5, done: 14 },
  },
];
