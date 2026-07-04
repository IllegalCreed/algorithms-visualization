import type { GcdExecPoint, LangSource } from '@/components/player/types';

// 辗转相除：gcd(a,b) = gcd(b, a mod b)，反复取模到余数为 0，此时被除数就是最大公约数。
// 几何上 = 反复从 a×b 矩形长边切下最大正方形，最后的最小正方形边长即 gcd。
const ts = `function gcd(a: number, b: number): number {
  while (b !== 0) {          // 余数不为 0 就继续切
    const r = a % b;         // a 除以 b 的余数（= 切完正方形后剩下的边）
    a = b;                   // 除数变被除数
    b = r;                   // 余数变除数
  }
  return a;                  // b=0 时 a 就是最大公约数（最小正方形边长）
}`;

const python = `def gcd(a, b):
    while b != 0:            # 余数不为 0 就继续切
        a, b = b, a % b      # 除数变被除数、余数变除数
    return a                 # b=0 时 a 就是最大公约数（最小正方形边长）`;

const go = `func gcd(a, b int) int {
\tfor b != 0 {              // 余数不为 0 就继续切
\t\ta, b = b, a%b          // 除数变被除数、余数变除数
\t}
\treturn a                 // b=0 时 a 就是最大公约数（最小正方形边长）
}`;

const rust = `fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {           // 余数不为 0 就继续切
        let r = a % b;       // a 除以 b 的余数
        a = b;               // 除数变被除数
        b = r;               // 余数变除数
    }
    a                        // b=0 时 a 就是最大公约数（最小正方形边长）
}`;

export const gcdSources: LangSource<GcdExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=开始循环 / cut=取模（切正方形）/ done=返回 gcd
    lineMap: { init: 2, cut: 3, done: 7 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, cut: 3, done: 4 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, cut: 3, done: 5 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, cut: 3, done: 7 },
  },
];
