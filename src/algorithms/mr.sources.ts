import type { LangSource, MrExecPoint } from '@/components/player/types';

// 米勒-拉宾：n−1 = 2^s·d，x = a^d 起连续平方。撞到 −1 → 与质数行为一致（通过）；
// 从「非 ±1」平方出 1 → 非平凡平方根 → 合数；走完从未撞 −1 → 合数。
const ts = `function millerRabin(n: number, a: number): boolean {
  let d = n - 1, s = 0;
  while (d % 2 === 0) { d /= 2; s++; }  // n−1 = 2^s·d
  let x = powMod(a, d, n);              // x = a^d
  if (x === 1 || x === n - 1) return true;
  for (let i = 1; i < s; i++) {
    x = (x * x) % n;                    // 平方一步
    if (x === n - 1) return true;       // 撞到 −1 → 通过
    if (x === 1) return false;          // 非平凡平方根 → 合数
  }
  return false;                         // 从未撞到 −1 → 合数
}`;

const python = `def miller_rabin(n, a):
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2; s += 1        # n−1 = 2^s·d
    x = pow(a, d, n)           # x = a^d
    if x in (1, n - 1):
        return True
    for _ in range(s - 1):
        x = x * x % n          # 平方一步
        if x == n - 1:
            return True        # 撞到 −1 → 通过
        if x == 1:
            return False       # 非平凡平方根 → 合数
    return False               # 从未撞到 −1 → 合数`;

const go = `func millerRabin(n, a int) bool {
\td, s := n-1, 0
\tfor d%2 == 0 {
\t\td /= 2
\t\ts++ // n−1 = 2^s·d
\t}
\tx := powMod(a, d, n) // x = a^d
\tif x == 1 || x == n-1 {
\t\treturn true
\t}
\tfor i := 1; i < s; i++ {
\t\tx = x * x % n // 平方一步
\t\tif x == n-1 {
\t\t\treturn true // 撞到 −1 → 通过
\t\t}
\t\tif x == 1 {
\t\t\treturn false // 非平凡平方根 → 合数
\t\t}
\t}
\treturn false // 从未撞到 −1 → 合数
}`;

const rust = `fn miller_rabin(n: u64, a: u64) -> bool {
    let (mut d, mut s) = (n - 1, 0);
    while d % 2 == 0 {
        d /= 2;
        s += 1; // n−1 = 2^s·d
    }
    let mut x = pow_mod(a, d, n); // x = a^d
    if x == 1 || x == n - 1 {
        return true;
    }
    for _ in 1..s {
        x = x * x % n; // 平方一步
        if x == n - 1 {
            return true; // 撞到 −1 → 通过
        }
        if x == 1 {
            return false; // 非平凡平方根 → 合数
        }
    }
    false // 从未撞到 −1 → 合数
}`;

export const mrSources: LangSource<MrExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=入口 / decomp=拆 2 / pow=a^d / square=平方 / verdict=±1 判定 / done=返回
    lineMap: { init: 1, decomp: 3, pow: 4, square: 7, verdict: 8, done: 11 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 1, decomp: 4, pow: 5, square: 9, verdict: 11, done: 14 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 1, decomp: 5, pow: 7, square: 12, verdict: 14, done: 20 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 1, decomp: 5, pow: 7, square: 12, verdict: 14, done: 20 },
  },
];
