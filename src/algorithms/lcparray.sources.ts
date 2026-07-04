import type { LangSource, LcpExecPoint } from '@/components/player/types';

const ts = `function kasai(s: string, sa: number[]): number[] {
  const n = s.length;
  const rank = new Array(n);
  for (let i = 0; i < n; i++) rank[sa[i]] = i; // sa 的逆
  const lcp = new Array(n).fill(0);
  let h = 0;
  for (let i = 0; i < n; i++) {          // 按原始下标 i 顺序处理
    if (rank[i] > 0) {
      const j = sa[rank[i] - 1];         // 排序前驱后缀
      while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++; // h 只增
      lcp[rank[i]] = h;                  // 填 LCP
      if (h > 0) h--;                    // 去首字符：h 至多减 1
    } else {
      h = 0;                             // rank 0：无前驱
    }
  }
  return lcp;
}`;

const python = `def kasai(s, sa):
    n = len(s)
    rank = [0] * n
    for i, p in enumerate(sa): rank[p] = i   # sa 的逆
    lcp = [0] * n
    h = 0
    for i in range(n):                       # 按原始下标 i 顺序
        if rank[i] > 0:
            j = sa[rank[i] - 1]              # 排序前驱
            while i + h < n and j + h < n and s[i + h] == s[j + h]: h += 1
            lcp[rank[i]] = h                # 填 LCP
            if h > 0: h -= 1               # 去首字符：h 至多减 1
        else:
            h = 0                          # rank 0 无前驱
    return lcp`;

const go = `func kasai(s string, sa []int) []int {
\tn := len(s)
\trank := make([]int, n)
\tfor i, p := range sa { rank[p] = i } // sa 的逆
\tlcp := make([]int, n)
\th := 0
\tfor i := 0; i < n; i++ { // 按原始下标 i 顺序
\t\tif rank[i] > 0 {
\t\t\tj := sa[rank[i]-1] // 排序前驱
\t\t\tfor i+h < n && j+h < n && s[i+h] == s[j+h] { h++ }
\t\t\tlcp[rank[i]] = h // 填 LCP
\t\t\tif h > 0 { h-- } // 去首字符
\t\t} else {
\t\t\th = 0 // rank 0 无前驱
\t\t}
\t}
\treturn lcp
}`;

const rust = `fn kasai(s: &[u8], sa: &[usize]) -> Vec<usize> {
    let n = s.len();
    let mut rank = vec![0usize; n];
    for (i, &p) in sa.iter().enumerate() { rank[p] = i; } // sa 的逆
    let mut lcp = vec![0usize; n];
    let mut h = 0usize;
    for i in 0..n { // 按原始下标 i 顺序
        if rank[i] > 0 {
            let j = sa[rank[i] - 1]; // 排序前驱
            while i + h < n && j + h < n && s[i + h] == s[j + h] { h += 1; }
            lcp[rank[i]] = h; // 填 LCP
            if h > 0 { h -= 1; } // 去首字符
        } else {
            h = 0; // rank 0 无前驱
        }
    }
    lcp
}`;

export const lcpArraySources: LangSource<LcpExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 5, fill: 11, skip: 14, done: 17 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 5, fill: 11, skip: 14, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 5, fill: 11, skip: 14, done: 17 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 5, fill: 11, skip: 14, done: 17 },
  },
];
