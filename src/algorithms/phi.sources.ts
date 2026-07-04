import type { LangSource, PhiExecPoint } from '@/components/player/types';

// 欧拉函数试除版：res 从 n 出发，每遇到一个新质因子 p 就 res -= res/p（乘 1−1/p），
// 除尽 p 的幂再继续；循环结束若还剩 >1 的 m，它是最后一个大质因子。
const ts = `function phi(n: number): number {
  let res = n;                      // 从 n 出发记账
  for (let p = 2; p * p <= n; p++) {
    if (n % p !== 0) continue;      // 试除：找质因子
    res -= res / p;                 // 乘 (1 − 1/p)：按比例划掉
    while (n % p === 0) n /= p;     // 除尽这个质因子
  }
  if (n > 1) res -= res / n;        // 还剩一个大质因子
  return res;                       // 幸存者个数 = φ(n)
}`;

const python = `def phi(n):
    res = n                    # 从 n 出发记账
    p = 2
    while p * p <= n:
        if n % p == 0:         # 试除：找质因子
            res -= res // p    # 乘 (1 − 1/p)：按比例划掉
            while n % p == 0:
                n //= p        # 除尽这个质因子
        p += 1
    if n > 1:
        res -= res // n        # 还剩一个大质因子
    return res                 # 幸存者个数 = φ(n)`;

const go = `func phi(n int) int {
\tres := n                   // 从 n 出发记账
\tfor p := 2; p*p <= n; p++ {
\t\tif n%p != 0 {
\t\t\tcontinue // 试除：找质因子
\t\t}
\t\tres -= res / p           // 乘 (1 − 1/p)：按比例划掉
\t\tfor n%p == 0 {
\t\t\tn /= p // 除尽这个质因子
\t\t}
\t}
\tif n > 1 {
\t\tres -= res / n // 还剩一个大质因子
\t}
\treturn res // 幸存者个数 = φ(n)
}`;

const rust = `fn phi(mut n: u64) -> u64 {
    let mut res = n;               // 从 n 出发记账
    let mut p = 2;
    while p * p <= n {
        if n % p == 0 {            // 试除：找质因子
            res -= res / p;        // 乘 (1 − 1/p)：按比例划掉
            while n % p == 0 {
                n /= p;            // 除尽这个质因子
            }
        }
        p += 1;
    }
    if n > 1 {
        res -= res / n;            // 还剩一个大质因子
    }
    res                            // 幸存者个数 = φ(n)
}`;

export const phiSources: LangSource<PhiExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=记账起点 / find=试除 / cross=按比例划掉 / survive、done=返回幸存者个数
    lineMap: { init: 2, find: 4, cross: 5, survive: 8, done: 8 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, find: 5, cross: 6, survive: 12, done: 12 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, find: 4, cross: 7, survive: 15, done: 15 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, find: 5, cross: 6, survive: 16, done: 16 },
  },
];
