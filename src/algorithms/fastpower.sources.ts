import type { LangSource, PowerExecPoint } from '@/components/player/types';

// 快速幂：从低位到高位扫描指数 n 的二进制。底数反复平方得 a¹→a²→a⁴→a⁸，
// 当前位为 1 就把当前平方乘进结果。共 O(log n) 次乘法。模幂只需每步再取一次模。
const ts = `function fastPow(a: number, n: number): number {
  let result = 1;
  let base = a;
  while (n > 0) {              // 从低位到高位扫描 n 的二进制
    if (n & 1) result *= base; // 当前位为 1 → 把当前平方乘入结果
    base *= base;             // 底数平方：a → a² → a⁴ → a⁸
    n >>= 1;                  // 右移，看下一位
  }
  return result;
}`;

const python = `def fast_pow(a, n):
    result = 1
    base = a
    while n > 0:              # 从低位到高位扫描 n 的二进制
        if n & 1:            # 当前位为 1 → 把当前平方乘入结果
            result *= base
        base *= base         # 底数平方：a → a² → a⁴ → a⁸
        n >>= 1              # 右移，看下一位
    return result`;

const go = `func fastPow(a, n int) int {
\tresult := 1
\tbase := a
\tfor n > 0 {                // 从低位到高位扫描 n 的二进制
\t\tif n&1 == 1 { result *= base } // 当前位为 1 → 乘入结果
\t\tbase *= base            // 底数平方：a → a² → a⁴ → a⁸
\t\tn >>= 1                 // 右移，看下一位
\t}
\treturn result
}`;

const rust = `fn fast_pow(a: u64, mut n: u64) -> u64 {
    let mut result = 1;
    let mut base = a;
    while n > 0 {              // 从低位到高位扫描 n 的二进制
        if n & 1 == 1 { result *= base; } // 当前位为 1 → 乘入结果
        base *= base;          // 底数平方：a → a² → a⁴ → a⁸
        n >>= 1;               // 右移，看下一位
    }
    result
}`;

export const fastPowerSources: LangSource<PowerExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=初始化 / mul=位 1 乘入 / skip=底数平方（位 0 只平方）/ done=返回
    lineMap: { init: 2, mul: 5, skip: 6, done: 9 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, mul: 6, skip: 7, done: 9 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, mul: 5, skip: 6, done: 9 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, mul: 5, skip: 6, done: 9 },
  },
];
