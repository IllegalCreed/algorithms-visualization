import type { ExtGcdExecPoint, LangSource } from '@/components/player/types';

// 扩展欧几里得：下行做除法链；基例 b=0 时 gcd=a，显然 a·1+0·0=a 即 (x,y)=(1,0)；
// 回代：下层 b·x'+r·y'=g，代入 r=a−q·b 得 a·y'+b·(x'−q·y')=g → (x,y)=(y', x'−q·y')。
const ts = `function extGcd(a: number, b: number): [number, number, number] {
  if (b === 0)                       // 基例：gcd = a
    return [a, 1, 0];                // a·1 + 0·0 = a → (x,y)=(1,0)
  const q = Math.floor(a / b);       // 下行：一步除法
  const [g, x1, y1] = extGcd(b, a % b); // 递归求下层
  return [g, y1, x1 - q * y1];       // 回代：(x,y) = (y', x'−q·y')
}`;

const python = `def ext_gcd(a, b):
    if b == 0:                    # 基例：gcd = a
        return a, 1, 0            # a·1 + 0·0 = a → (x,y)=(1,0)
    q = a // b                    # 下行：一步除法
    g, x1, y1 = ext_gcd(b, a % b) # 递归求下层
    return g, y1, x1 - q * y1     # 回代：(x,y) = (y', x'−q·y')`;

const go = `func extGcd(a, b int) (int, int, int) {
\tif b == 0 {                    // 基例：gcd = a
\t\treturn a, 1, 0               // a·1 + 0·0 = a → (x,y)=(1,0)
\t}
\tq := a / b                     // 下行：一步除法
\tg, x1, y1 := extGcd(b, a%b)    // 递归求下层
\treturn g, y1, x1 - q*y1        // 回代：(x,y) = (y', x'−q·y')
}`;

const rust = `fn ext_gcd(a: i64, b: i64) -> (i64, i64, i64) {
    if b == 0 {                    // 基例：gcd = a
        return (a, 1, 0);          // a·1 + 0·0 = a → (x,y)=(1,0)
    }
    let q = a / b;                 // 下行：一步除法
    let (g, x1, y1) = ext_gcd(b, a % b); // 递归求下层
    (g, y1, x1 - q * y1)           // 回代：(x,y) = (y', x'−q·y')
}`;

export const extGcdSources: LangSource<ExtGcdExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=入口 / down=一步除法 / base=b=0 基例 / up=回代 / done=返回
    lineMap: { init: 1, down: 4, base: 3, up: 6, done: 6 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 1, down: 4, base: 3, up: 6, done: 6 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 1, down: 5, base: 3, up: 7, done: 7 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 1, down: 5, base: 3, up: 7, done: 7 },
  },
];
