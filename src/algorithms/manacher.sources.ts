import type { LangSource, ManacherExecPoint } from '@/components/player/types';

const ts = `function manacher(str: string): string {
  let t = '#';
  for (const ch of str) t += ch + '#';   // 预处理：插 #
  const n = t.length;
  const p = new Array(n).fill(0);
  let c = 0, r = 0;                       // 最右回文中心 c、右边界 r
  for (let i = 0; i < n; i++) {
    if (i < r) p[i] = Math.min(r - i, p[2 * c - i]); // 对称性复用
    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n &&
           t[i - p[i] - 1] === t[i + p[i] + 1]) p[i]++; // 中心扩展
    if (i + p[i] > r) { c = i; r = i + p[i]; }
  }
  let best = 0, ci = 0;
  for (let i = 0; i < n; i++) if (p[i] > best) { best = p[i]; ci = i; }
  return str.substr((ci - best) / 2, best);
}`;

const python = `def manacher(s):
    t = '#' + '#'.join(s) + '#'            # 预处理：插 #
    n = len(t)
    p = [0] * n
    c = r = 0                              # 最右回文中心 c、右边界 r
    for i in range(n):
        if i < r:
            p[i] = min(r - i, p[2 * c - i])  # 对称性复用
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n \\
              and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1                       # 中心扩展
        if i + p[i] > r:
            c, r = i, i + p[i]
    ci = max(range(n), key=lambda i: p[i])
    start = (ci - p[ci]) // 2
    return s[start:start + p[ci]]`;

const go = `func manacher(s string) string {
\tt := "#"
\tfor _, ch := range s {
\t\tt += string(ch) + "#" // 预处理：插 #
\t}
\tn := len(t)
\tp := make([]int, n)
\tc, r := 0, 0 // 最右回文中心 c、右边界 r
\tfor i := 0; i < n; i++ {
\t\tif i < r {
\t\t\tp[i] = min(r-i, p[2*c-i]) // 对称性复用
\t\t}
\t\tfor i-p[i]-1 >= 0 && i+p[i]+1 < n && t[i-p[i]-1] == t[i+p[i]+1] {
\t\t\tp[i]++ // 中心扩展
\t\t}
\t\tif i+p[i] > r {
\t\t\tc, r = i, i+p[i]
\t\t}
\t}
\tbest, ci := 0, 0
\tfor i := 0; i < n; i++ {
\t\tif p[i] > best {
\t\t\tbest, ci = p[i], i
\t\t}
\t}
\tstart := (ci - best) / 2
\treturn s[start : start+best]
}`;

const rust = `fn manacher(s: &str) -> String {
    let mut t = String::from("#");
    for ch in s.chars() {
        t.push(ch); t.push('#'); // 预处理：插 #
    }
    let b: Vec<char> = t.chars().collect();
    let n = b.len() as i32;
    let mut p = vec![0i32; n as usize];
    let (mut c, mut r) = (0i32, 0i32); // 最右回文中心 c、右边界 r
    for i in 0..n {
        if i < r {
            p[i as usize] = (r - i).min(p[(2 * c - i) as usize]); // 对称性复用
        }
        while i - p[i as usize] - 1 >= 0 && i + p[i as usize] + 1 < n
            && b[(i - p[i as usize] - 1) as usize] == b[(i + p[i as usize] + 1) as usize] {
            p[i as usize] += 1; // 中心扩展
        }
        if i + p[i as usize] > r { c = i; r = i + p[i as usize]; }
    }
    let (mut best, mut ci) = (0i32, 0i32);
    for i in 0..n {
        if p[i as usize] > best { best = p[i as usize]; ci = i; }
    }
    let start = ((ci - best) / 2) as usize;
    s.chars().skip(start).take(best as usize).collect()
}`;

export const manacherSources: LangSource<ManacherExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 3, mirror: 8, expand: 10, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, mirror: 8, expand: 11, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 4, mirror: 11, expand: 15, done: 28 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 4, mirror: 12, expand: 16, done: 25 },
  },
];
