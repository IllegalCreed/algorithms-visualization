import type { BoyerMooreExecPoint, LangSource } from '@/components/player/types';

const ts = `function boyerMoore(text: string, pat: string): number[] {
  const n = text.length, m = pat.length;
  const last: Record<string, number> = {};
  for (let i = 0; i < m; i++) last[pat[i]] = i;   // 坏字符表
  const res: number[] = [];
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pat[j] === text[s + j]) j--;  // 从右往左比
    if (j < 0) {
      res.push(s);                                 // 全匹配 → 命中
      s += 1;
    } else {
      const bc = text[s + j];                      // 坏字符
      s += Math.max(1, j - (last[bc] ?? -1));      // 大步右移
    }
  }
  return res;
}`;

const python = `def boyer_moore(text, pat):
    n, m = len(text), len(pat)
    last = {}
    for i in range(m):
        last[pat[i]] = i                       # 坏字符表
    res = []
    s = 0
    while s <= n - m:
        j = m - 1
        while j >= 0 and pat[j] == text[s + j]:  # 从右往左比
            j -= 1
        if j < 0:
            res.append(s)                        # 全匹配 → 命中
            s += 1
        else:
            bc = text[s + j]                     # 坏字符
            s += max(1, j - last.get(bc, -1))    # 大步右移
    return res`;

const go = `func boyerMoore(text, pat string) []int {
\tn, m := len(text), len(pat)
\tlast := map[byte]int{}
\tfor i := 0; i < m; i++ {
\t\tlast[pat[i]] = i    // 坏字符表
\t}
\tres := []int{}
\ts := 0
\tfor s <= n-m {
\t\tj := m - 1
\t\tfor j >= 0 && pat[j] == text[s+j] {   // 从右往左比
\t\t\tj--
\t\t}
\t\tif j < 0 {
\t\t\tres = append(res, s)   // 全匹配 → 命中
\t\t\ts++
\t\t} else {
\t\t\tbc := text[s+j]        // 坏字符
\t\t\tlp, ok := last[bc]
\t\t\tif !ok {
\t\t\t\tlp = -1
\t\t\t}
\t\t\tshift := j - lp
\t\t\tif shift < 1 {
\t\t\t\tshift = 1
\t\t\t}
\t\t\ts += shift             // 大步右移
\t\t}
\t}
\treturn res
}`;

const rust = `fn boyer_moore(text: &[u8], pat: &[u8]) -> Vec<usize> {
    let (n, m) = (text.len(), pat.len());
    let mut last = [-1i32; 256];
    for i in 0..m {
        last[pat[i] as usize] = i as i32;   // 坏字符表
    }
    let mut res = Vec::new();
    let mut s = 0i32;
    while s <= (n - m) as i32 {
        let mut j = (m - 1) as i32;
        while j >= 0 && pat[j as usize] == text[(s + j) as usize] {   // 从右往左比
            j -= 1;
        }
        if j < 0 {
            res.push(s as usize);   // 全匹配 → 命中
            s += 1;
        } else {
            let bc = text[(s + j) as usize];        // 坏字符
            s += (j - last[bc as usize]).max(1);    // 大步右移
        }
    }
    res
}`;

export const boyerMooreSources: LangSource<BoyerMooreExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 8, match: 9, badChar: 15, found: 11, done: 18 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 9, match: 10, badChar: 17, found: 13, done: 18 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 10, match: 11, badChar: 27, found: 15, done: 30 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 10, match: 11, badChar: 19, found: 15, done: 22 },
  },
];
