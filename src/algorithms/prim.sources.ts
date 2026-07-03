import type { LangSource, PrimExecPoint } from '@/components/player/types';

const ts = `function prim(edges: [number, number, number][], n: number, start: number): number {
  const inTree = Array(n).fill(false);
  inTree[start] = true;
  let weight = 0, count = 1;
  while (count < n) {
    let best: [number, number, number] | null = null;
    for (const [u, v, w] of edges) {
      if (inTree[u] !== inTree[v] && (best === null || w < best[2])) best = [u, v, w];
    }
    if (best === null) break;
    const nv = inTree[best[0]] ? best[1] : best[0];
    inTree[nv] = true;
    weight += best[2];
    count++;
  }
  return weight;
}`;

const python = `def prim(edges, n, start):
    in_tree = [False] * n
    in_tree[start] = True
    weight, count = 0, 1
    while count < n:
        best = None
        for u, v, w in edges:
            if in_tree[u] != in_tree[v] and (best is None or w < best[2]):
                best = (u, v, w)
        if best is None:
            break
        nv = best[1] if in_tree[best[0]] else best[0]
        in_tree[nv] = True
        weight += best[2]
        count += 1
    return weight`;

const go = `func prim(edges [][3]int, n, start int) int {
\tinTree := make([]bool, n)
\tinTree[start] = true
\tweight, count := 0, 1
\tfor count < n {
\t\tbi := -1
\t\tfor i, e := range edges {
\t\t\tif inTree[e[0]] != inTree[e[1]] && (bi < 0 || e[2] < edges[bi][2]) {
\t\t\t\tbi = i
\t\t\t}
\t\t}
\t\tif bi < 0 {
\t\t\tbreak
\t\t}
\t\te := edges[bi]
\t\tnv := e[0]
\t\tif inTree[e[0]] {
\t\t\tnv = e[1]
\t\t}
\t\tinTree[nv] = true
\t\tweight += e[2]
\t\tcount++
\t}
\treturn weight
}`;

const rust = `fn prim(edges: &Vec<(usize, usize, i32)>, n: usize, start: usize) -> i32 {
    let mut in_tree = vec![false; n];
    in_tree[start] = true;
    let (mut weight, mut count) = (0, 1);
    while count < n {
        let mut best: Option<(usize, usize, i32)> = None;
        for &(u, v, w) in edges {
            if in_tree[u] != in_tree[v] && best.map_or(true, |b| w < b.2) {
                best = Some((u, v, w));
            }
        }
        let (u, v, w) = match best {
            Some(e) => e,
            None => break,
        };
        let nv = if in_tree[u] { v } else { u };
        in_tree[nv] = true;
        weight += w;
        count += 1;
    }
    weight
}`;

export const primSources: LangSource<PrimExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 2, selectEdge: 6, addVertex: 11, done: 16 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, selectEdge: 6, addVertex: 12, done: 16 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, selectEdge: 6, addVertex: 15, done: 24 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, selectEdge: 6, addVertex: 16, done: 21 },
  },
];
