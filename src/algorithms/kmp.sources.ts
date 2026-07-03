import type { KmpExecPoint, LangSource } from '@/components/player/types';

const ts = `function buildLps(pat: string): number[] {
  const lps = new Array(pat.length).fill(0);
  let len = 0, i = 1;
  while (i < pat.length) {
    if (pat[i] === pat[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  return lps;
}
function kmpSearch(text: string, pat: string): number[] {
  const n = text.length, m = pat.length;
  const lps = buildLps(pat);
  const res: number[] = [];
  let i = 0, j = 0;
  while (i < n) {
    if (text[i] === pat[j]) {
      i++; j++;
      if (j === m) { res.push(i - m); j = lps[j - 1]; } // 命中
    } else if (j > 0) {
      j = lps[j - 1];                    // 失配：跳转，i 不回退
    } else {
      i++;                               // j=0 失配：文本前进
    }
  }
  return res;
}`;

const python = `def build_lps(pat):
    lps = [0] * len(pat)
    length, i = 0, 1
    while i < len(pat):
        if pat[i] == pat[length]:
            length += 1; lps[i] = length; i += 1
        elif length > 0:
            length = lps[length - 1]
        else:
            lps[i] = 0; i += 1
    return lps
def kmp_search(text, pat):
    n, m = len(text), len(pat)
    lps = build_lps(pat)
    res = []
    i = j = 0
    while i < n:
        if text[i] == pat[j]:
            i += 1; j += 1
            if j == m:
                res.append(i - m); j = lps[j - 1]   # 命中
        elif j > 0:
            j = lps[j - 1]                           # 失配：跳转，i 不回退
        else:
            i += 1                                   # j=0 失配：文本前进
    return res`;

const go = `func buildLps(pat string) []int {
\tlps := make([]int, len(pat))
\tlength, i := 0, 1
\tfor i < len(pat) {
\t\tif pat[i] == pat[length] {
\t\t\tlength++; lps[i] = length; i++
\t\t} else if length > 0 {
\t\t\tlength = lps[length-1]
\t\t} else {
\t\t\tlps[i] = 0; i++
\t\t}
\t}
\treturn lps
}
func kmpSearch(text, pat string) []int {
\tn, m := len(text), len(pat)
\tlps := buildLps(pat)
\tres := []int{}
\ti, j := 0, 0
\tfor i < n {
\t\tif text[i] == pat[j] {
\t\t\ti++; j++
\t\t\tif j == m {
\t\t\t\tres = append(res, i-m); j = lps[j-1] // 命中
\t\t\t}
\t\t} else if j > 0 {
\t\t\tj = lps[j-1]                    // 失配：跳转，i 不回退
\t\t} else {
\t\t\ti++                             // j=0 失配：文本前进
\t\t}
\t}
\treturn res
}`;

const rust = `fn build_lps(pat: &[u8]) -> Vec<usize> {
    let mut lps = vec![0; pat.len()];
    let (mut len, mut i) = (0, 1);
    while i < pat.len() {
        if pat[i] == pat[len] {
            len += 1; lps[i] = len; i += 1;
        } else if len > 0 {
            len = lps[len - 1];
        } else {
            lps[i] = 0; i += 1;
        }
    }
    lps
}
fn kmp_search(text: &[u8], pat: &[u8]) -> Vec<usize> {
    let (n, m) = (text.len(), pat.len());
    let lps = build_lps(pat);
    let mut res = Vec::new();
    let (mut i, mut j) = (0, 0);
    while i < n {
        if text[i] == pat[j] {
            i += 1; j += 1;
            if j == m { res.push(i - m); j = lps[j - 1]; } // 命中
        } else if j > 0 {
            j = lps[j - 1];                    // 失配：跳转，i 不回退
        } else {
            i += 1;                            // j=0 失配：文本前进
        }
    }
    res
}`;

export const kmpSources: LangSource<KmpExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 15, match: 18, jump: 21, advance: 23, found: 19, done: 26 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 16, match: 19, jump: 23, advance: 25, found: 21, done: 26 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 19, match: 22, jump: 27, advance: 29, found: 24, done: 32 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 19, match: 22, jump: 25, advance: 27, found: 23, done: 30 },
  },
];
