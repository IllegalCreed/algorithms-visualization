import type { LangSource, RabinKarpExecPoint } from '@/components/player/types';

const ts = `function rabinKarp(text: string, pat: string): number[] {
  const n = text.length, m = pat.length;
  const B = 10, M = 997;
  const val = (ch: string) => ch.charCodeAt(0) - 96;
  let patHash = 0, winHash = 0, pow = 1;
  for (let k = 0; k < m; k++) {
    patHash = (patHash * B + val(pat[k])) % M;   // 模式哈希
    winHash = (winHash * B + val(text[k])) % M;  // 首窗口哈希
    if (k < m - 1) pow = (pow * B) % M;
  }
  const res: number[] = [];
  for (let i = 0; i + m <= n; i++) {
    if (winHash === patHash) {                    // 哈希命中
      if (text.slice(i, i + m) === pat) {         // 逐字符验证
        res.push(i);
      }
    }
    if (i + m < n) {                              // 滚动更新 O(1)
      winHash = ((winHash - val(text[i]) * pow) * B + val(text[i + m])) % M;
      winHash = ((winHash % M) + M) % M;
    }
  }
  return res;
}`;

const python = `def rabin_karp(text, pat):
    n, m = len(text), len(pat)
    B, M = 10, 997
    val = lambda ch: ord(ch) - 96
    pat_hash = win_hash = 0
    pow_ = 1
    for k in range(m):
        pat_hash = (pat_hash * B + val(pat[k])) % M     # 模式哈希
        win_hash = (win_hash * B + val(text[k])) % M    # 首窗口哈希
        if k < m - 1:
            pow_ = (pow_ * B) % M
    res = []
    for i in range(n - m + 1):
        if win_hash == pat_hash:                        # 哈希命中
            if text[i:i+m] == pat:                      # 逐字符验证
                res.append(i)
        if i + m < n:                                   # 滚动更新 O(1)
            win_hash = ((win_hash - val(text[i]) * pow_) * B + val(text[i+m])) % M
    return res`;

const go = `func rabinKarp(text, pat string) []int {
\tn, m := len(text), len(pat)
\tconst B, M = 10, 997
\tval := func(ch byte) int { return int(ch) - 96 }
\tpatHash, winHash, pow := 0, 0, 1
\tfor k := 0; k < m; k++ {
\t\tpatHash = (patHash*B + val(pat[k])) % M    // 模式哈希
\t\twinHash = (winHash*B + val(text[k])) % M   // 首窗口哈希
\t\tif k < m-1 {
\t\t\tpow = (pow * B) % M
\t\t}
\t}
\tres := []int{}
\tfor i := 0; i+m <= n; i++ {
\t\tif winHash == patHash {                    // 哈希命中
\t\t\tif text[i:i+m] == pat {                  // 逐字符验证
\t\t\t\tres = append(res, i)
\t\t\t}
\t\t}
\t\tif i+m < n {                               // 滚动更新 O(1)
\t\t\twinHash = ((winHash-val(text[i])*pow)*B + val(text[i+m])) % M
\t\t\twinHash = ((winHash % M) + M) % M
\t\t}
\t}
\treturn res
}`;

const rust = `fn rabin_karp(text: &[u8], pat: &[u8]) -> Vec<usize> {
    let (n, m) = (text.len(), pat.len());
    let (b, md) = (10i64, 997i64);
    let val = |c: u8| (c as i64) - 96;
    let (mut pat_hash, mut win_hash, mut pow) = (0i64, 0i64, 1i64);
    for k in 0..m {
        pat_hash = (pat_hash * b + val(pat[k])) % md;    // 模式哈希
        win_hash = (win_hash * b + val(text[k])) % md;   // 首窗口哈希
        if k < m - 1 { pow = (pow * b) % md; }
    }
    let mut res = Vec::new();
    for i in 0..=(n - m) {
        if win_hash == pat_hash {                         // 哈希命中
            if &text[i..i + m] == pat {                   // 逐字符验证
                res.push(i);
            }
        }
        if i + m < n {                                    // 滚动更新 O(1)
            win_hash = ((win_hash - val(text[i]) * pow) * b + val(text[i + m])) % md;
            win_hash = ((win_hash % md) + md) % md;
        }
    }
    res
}`;

export const rabinKarpSources: LangSource<RabinKarpExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 7, skip: 19, hashHit: 13, verify: 14, found: 15, done: 23 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 8, skip: 18, hashHit: 14, verify: 15, found: 16, done: 19 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 7, skip: 21, hashHit: 15, verify: 16, found: 17, done: 25 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 7, skip: 19, hashHit: 13, verify: 14, found: 15, done: 23 },
  },
];
