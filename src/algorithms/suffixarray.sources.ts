import type { LangSource, SuffixArrayExecPoint } from '@/components/player/types';

const ts = `function suffixArray(s: string): number[] {
  const n = s.length;
  let rank = s.split('').map(c => c.charCodeAt(0)); // 初始 rank = 首字符
  let sa = [...Array(n).keys()];
  const key = (i: number, k: number): [number, number] =>
    [rank[i], i + k < n ? rank[i + k] : -1];
  for (let k = 1; ; k <<= 1) {
    sa.sort((a, b) => {                             // 按 (前 k 位, 后 k 位) 排
      const ka = key(a, k), kb = key(b, k);
      return ka[0] - kb[0] || ka[1] - kb[1];
    });
    const nr = Array(n).fill(0);
    for (let x = 1; x < n; x++) {
      const kp = key(sa[x - 1], k), kq = key(sa[x], k);
      nr[sa[x]] = nr[sa[x - 1]] +                   // 重编 0 基 rank
        (kp[0] !== kq[0] || kp[1] !== kq[1] ? 1 : 0);
    }
    rank = nr;
    if (rank[sa[n - 1]] === n - 1) break;           // rank 全不同 → 收敛
  }
  return sa;
}`;

const python = `def suffix_array(s):
    n = len(s)
    rank = [ord(c) for c in s]            # 初始 rank = 首字符
    sa = list(range(n))
    k = 1
    def key(i):
        return (rank[i], rank[i + k] if i + k < n else -1)
    while True:
        sa.sort(key=key)                  # 按 (前 k 位, 后 k 位) 排
        nr = [0] * n
        for x in range(1, n):
            nr[sa[x]] = nr[sa[x - 1]] + (1 if key(sa[x]) != key(sa[x - 1]) else 0)  # 重编 rank
        rank = nr
        if rank[sa[-1]] == n - 1:         # rank 全不同 → 收敛
            break
        k <<= 1
    return sa`;

const go = `func suffixArray(s string) []int {
\tn := len(s)
\trank := make([]int, n)
\tfor i := 0; i < n; i++ { rank[i] = int(s[i]) } // 初始 rank = 首字符
\tsa := make([]int, n)
\tfor i := range sa { sa[i] = i }
\tkey := func(i, k int) [2]int {
\t\tif i+k < n { return [2]int{rank[i], rank[i+k]} }
\t\treturn [2]int{rank[i], -1}
\t}
\tfor k := 1; ; k <<= 1 {
\t\tsort.Slice(sa, func(a, b int) bool { // 按 (前 k 位, 后 k 位) 排
\t\t\tka, kb := key(sa[a], k), key(sa[b], k)
\t\t\tif ka[0] != kb[0] { return ka[0] < kb[0] }
\t\t\treturn ka[1] < kb[1]
\t\t})
\t\tnr := make([]int, n)
\t\tfor x := 1; x < n; x++ {
\t\t\tkp, kq := key(sa[x-1], k), key(sa[x], k)
\t\t\td := 0
\t\t\tif kp != kq { d = 1 }
\t\t\tnr[sa[x]] = nr[sa[x-1]] + d // 重编 rank
\t\t}
\t\trank = nr
\t\tif rank[sa[n-1]] == n-1 { break } // 收敛
\t}
\treturn sa
}`;

const rust = `fn suffix_array(s: &str) -> Vec<usize> {
    let b = s.as_bytes();
    let n = b.len();
    let mut rank: Vec<i32> = b.iter().map(|&c| c as i32).collect(); // 初始 rank
    let mut sa: Vec<usize> = (0..n).collect();
    let mut k = 1;
    loop {
        let key = |i: usize| (rank[i], if i + k < n { rank[i + k] } else { -1 });
        sa.sort_by_key(|&i| key(i)); // 按 (前 k 位, 后 k 位) 排
        let mut nr = vec![0i32; n];
        for x in 1..n {
            nr[sa[x]] = nr[sa[x - 1]]
                + if key(sa[x]) != key(sa[x - 1]) { 1 } else { 0 }; // 重编 rank
        }
        rank = nr;
        if rank[sa[n - 1]] == (n - 1) as i32 { break; } // 收敛
        k <<= 1;
    }
    sa
}`;

export const suffixArraySources: LangSource<SuffixArrayExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 4, sort: 8, rank: 15, done: 18 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 4, sort: 9, rank: 12, done: 14 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 4, sort: 12, rank: 22, done: 25 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 4, sort: 9, rank: 12, done: 16 },
  },
];
