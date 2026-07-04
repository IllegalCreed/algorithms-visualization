import type { AcExecPoint, LangSource } from '@/components/player/types';

// next[s][c]=转移；out[s]=以状态 s 结尾的模式；fail[s]=失配指针（KMP π 的多模式推广）。
// 建 Trie → BFS 建 fail（父的 fail 先算好）→ 文本上匹配（指针不回退、沿 fail 跳、输出链报告重叠命中）。
const ts = `function ahoCorasick(patterns: string[], text: string): [number, number][] {
  const next: Record<string, number>[] = [{}];   // 状态 0 = root
  const out: number[][] = [[]]; const fail = [0];
  for (let pi = 0; pi < patterns.length; pi++) {  // 建 Trie：逐模式插入
    let s = 0;
    for (const c of patterns[pi]) {
      if (next[s][c] === undefined) { next.push({}); out.push([]); fail.push(0); next[s][c] = next.length - 1; }
      s = next[s][c];
    }
    out[s].push(pi);                              // 模式终点
  }
  const q: number[] = [];
  for (const c in next[0]) q.push(next[0][c]);    // BFS 起点：root 的孩子 fail=root
  while (q.length) {
    const u = q.shift()!;
    for (const c in next[u]) {                    // BFS 建 fail
      const v = next[u][c]; q.push(v);
      let f = fail[u];
      while (f && next[f][c] === undefined) f = fail[f]; // 沿父的 fail 找 c 转移
      fail[v] = next[f][c] !== undefined && next[f][c] !== v ? next[f][c] : 0;
      out[v] = out[v].concat(out[fail[v]]);       // 输出链合并
    }
  }
  const hits: [number, number][] = []; let s = 0;
  for (let i = 0; i < text.length; i++) {
    while (s && next[s][text[i]] === undefined) s = fail[s]; // 无转移沿 fail 跳
    s = next[s][text[i]] ?? 0;
    for (const pi of out[s]) hits.push([pi, i]);  // 报告命中（含输出链重叠）
  }
  return hits;
}`;

const python = `def aho_corasick(patterns, text):
    nxt = [{}]; out = [[]]; fail = [0]            # 状态 0 = root
    for pi, pat in enumerate(patterns):           # 建 Trie：逐模式插入
        s = 0
        for c in pat:
            if c not in nxt[s]:
                nxt.append({}); out.append([]); fail.append(0); nxt[s][c] = len(nxt) - 1
            s = nxt[s][c]
        out[s].append(pi)                         # 模式终点
    from collections import deque
    q = deque(nxt[0].values())                    # BFS 起点：root 的孩子 fail=root
    while q:
        u = q.popleft()
        for c, v in nxt[u].items():               # BFS 建 fail
            q.append(v)
            f = fail[u]
            while f and c not in nxt[f]: f = fail[f]   # 沿父的 fail 找 c 转移
            fail[v] = nxt[f][c] if (c in nxt[f] and nxt[f][c] != v) else 0
            out[v] = out[v] + out[fail[v]]         # 输出链合并
    hits = []; s = 0
    for i, c in enumerate(text):
        while s and c not in nxt[s]: s = fail[s]   # 无转移沿 fail 跳
        s = nxt[s].get(c, 0)
        for pi in out[s]: hits.append((pi, i))     # 报告命中（含输出链重叠）
    return hits`;

const go = `func ahoCorasick(patterns []string, text string) [][2]int {
\tnext := []map[byte]int{{}}; out := [][]int{{}}; fail := []int{0} // 状态 0 = root
\tfor pi, pat := range patterns {                // 建 Trie：逐模式插入
\t\ts := 0
\t\tfor i := 0; i < len(pat); i++ {
\t\t\tc := pat[i]
\t\t\tif _, ok := next[s][c]; !ok {
\t\t\t\tnext = append(next, map[byte]int{}); out = append(out, nil); fail = append(fail, 0)
\t\t\t\tnext[s][c] = len(next) - 1
\t\t\t}
\t\t\ts = next[s][c]
\t\t}
\t\tout[s] = append(out[s], pi)                 // 模式终点
\t}
\tq := []int{}
\tfor _, v := range next[0] { q = append(q, v) } // BFS 起点：root 的孩子 fail=root
\tfor len(q) > 0 {
\t\tu := q[0]; q = q[1:]
\t\tfor c, v := range next[u] {                 // BFS 建 fail
\t\t\tq = append(q, v)
\t\t\tf := fail[u]
\t\t\tfor f != 0 { if _, ok := next[f][c]; ok { break }; f = fail[f] } // 沿 fail 找转移
\t\t\tif w, ok := next[f][c]; ok && w != v { fail[v] = w } else { fail[v] = 0 }
\t\t\tout[v] = append(out[v], out[fail[v]]...)  // 输出链合并
\t\t}
\t}
\thits := [][2]int{}; s := 0
\tfor i := 0; i < len(text); i++ {
\t\tc := text[i]
\t\tfor s != 0 { if _, ok := next[s][c]; ok { break }; s = fail[s] } // 无转移沿 fail 跳
\t\tif w, ok := next[s][c]; ok { s = w } else { s = 0 }
\t\tfor _, pi := range out[s] { hits = append(hits, [2]int{pi, i}) } // 报告命中
\t}
\treturn hits
}`;

const rust = `fn aho_corasick(patterns: &[&str], text: &str) -> Vec<(usize, usize)> {
    use std::collections::{HashMap, VecDeque};
    let mut next: Vec<HashMap<u8, usize>> = vec![HashMap::new()]; // 状态 0 = root
    let mut out: Vec<Vec<usize>> = vec![vec![]]; let mut fail = vec![0usize];
    for (pi, pat) in patterns.iter().enumerate() {  // 建 Trie：逐模式插入
        let mut s = 0;
        for &c in pat.as_bytes() {
            if !next[s].contains_key(&c) {
                next.push(HashMap::new()); out.push(vec![]); fail.push(0);
                let id = next.len() - 1; next[s].insert(c, id);
            }
            s = next[s][&c];
        }
        out[s].push(pi);                            // 模式终点
    }
    let mut q: VecDeque<usize> = next[0].values().cloned().collect(); // BFS 起点
    while let Some(u) = q.pop_front() {
        let cs: Vec<u8> = next[u].keys().cloned().collect();
        for c in cs {                               // BFS 建 fail
            let v = next[u][&c]; q.push_back(v);
            let mut f = fail[u];
            while f != 0 && !next[f].contains_key(&c) { f = fail[f]; } // 沿 fail 找转移
            fail[v] = match next[f].get(&c) { Some(&w) if w != v => w, _ => 0 };
            let add = out[fail[v]].clone(); out[v].extend(add); // 输出链合并
        }
    }
    let mut hits = vec![]; let mut s = 0;
    for (i, &c) in text.as_bytes().iter().enumerate() {
        while s != 0 && !next[s].contains_key(&c) { s = fail[s]; } // 无转移沿 fail 跳
        s = *next[s].get(&c).unwrap_or(&0);
        for &pi in &out[s] { hits.push((pi, i)); }  // 报告命中
    }
    hits
}`;

export const ahoCorasickSources: LangSource<AcExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // insert=建 Trie / fail=BFS 沿 fail 找转移 / match=无转移沿 fail 跳 / hit=报告命中 / done=返回
    lineMap: { insert: 4, fail: 19, match: 26, hit: 28, done: 30 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { insert: 3, fail: 17, match: 22, hit: 24, done: 25 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { insert: 3, fail: 22, match: 30, hit: 32, done: 34 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { insert: 5, fail: 22, match: 29, hit: 31, done: 33 },
  },
];
