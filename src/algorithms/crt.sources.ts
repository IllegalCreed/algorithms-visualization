import type { CrtExecPoint, LangSource } from '@/components/player/types';

// 中国剩余定理：模两两互质时，Mᵢ = M/mᵢ 对异模 ≡0、只在第 i 条同余有声音；
// 扩欧求逆 tᵢ 把声音校准成 1；专属项 rᵢ·Mᵢ·tᵢ 相加再 mod M 即唯一解。
const ts = `function crt(rs: number[], ms: number[]): number {
  const M = ms.reduce((p, m) => p * m, 1); // 模两两互质
  let x = 0;
  for (let i = 0; i < ms.length; i++) {
    const Mi = M / ms[i];             // 其余模之积：异模下 ≡ 0
    const ti = modInverse(Mi, ms[i]); // 扩欧求逆：本模下校准成 1
    x += rs[i] * Mi * ti;             // 该同余的专属项
  }
  return x % M;                       // 合并，mod M 内唯一
}`;

const python = `def crt(rs, ms):
    M = 1
    for m in ms: M *= m          # 模两两互质
    x = 0
    for r, m in zip(rs, ms):
        Mi = M // m              # 其余模之积：异模下 ≡ 0
        ti = mod_inverse(Mi, m)  # 扩欧求逆：本模下校准成 1
        x += r * Mi * ti         # 该同余的专属项
    return x % M                 # 合并，mod M 内唯一`;

const go = `func crt(rs, ms []int) int {
\tM := 1
\tfor _, m := range ms { M *= m } // 模两两互质
\tx := 0
\tfor i, m := range ms {
\t\tMi := M / m                 // 其余模之积：异模下 ≡ 0
\t\tti := modInverse(Mi, m)     // 扩欧求逆：本模下校准成 1
\t\tx += rs[i] * Mi * ti        // 该同余的专属项
\t}
\treturn x % M                   // 合并，mod M 内唯一
}`;

const rust = `fn crt(rs: &[i64], ms: &[i64]) -> i64 {
    let m_all: i64 = ms.iter().product(); // 模两两互质
    let mut x = 0;
    for (i, &m) in ms.iter().enumerate() {
        let mi = m_all / m;               // 其余模之积：异模下 ≡ 0
        let ti = mod_inverse(mi, m);      // 扩欧求逆：本模下校准成 1
        x += rs[i] * mi * ti;             // 该同余的专属项
    }
    x % m_all                             // 合并，mod M 内唯一
}`;

export const crtSources: LangSource<CrtExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=求 M / mi=其余模之积 / inv=扩欧求逆 / term=专属项累加 / sum、done=mod M 合并
    lineMap: { init: 2, mi: 5, inv: 6, term: 7, sum: 9, done: 9 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, mi: 6, inv: 7, term: 8, sum: 9, done: 9 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, mi: 6, inv: 7, term: 8, sum: 10, done: 10 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, mi: 5, inv: 6, term: 7, sum: 9, done: 9 },
  },
];
