import type { LangSource, KruskalExecPoint } from '@/components/player/types';

const ts = `function kruskal(edges: [number, number, number][], n: number): number {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) x = parent[x];
    return x;
  };
  let weight = 0;
  for (const [u, v, w] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) continue;
    parent[ru] = rv;
    weight += w;
  }
  return weight;
}`;

const python = `def kruskal(edges, n):
    edges.sort(key=lambda e: e[2])
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x
    weight = 0
    for u, v, w in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            continue
        parent[ru] = rv
        weight += w
    return weight`;

const go = `func kruskal(edges [][3]int, n int) int {
\tsort.Slice(edges, func(i, j int) bool {
\t\treturn edges[i][2] < edges[j][2]
\t})
\tparent := make([]int, n)
\tfor i := range parent {
\t\tparent[i] = i
\t}
\tvar find func(int) int
\tfind = func(x int) int {
\t\tfor parent[x] != x {
\t\t\tx = parent[x]
\t\t}
\t\treturn x
\t}
\tweight := 0
\tfor _, e := range edges {
\t\tru, rv := find(e[0]), find(e[1])
\t\tif ru == rv {
\t\t\tcontinue
\t\t}
\t\tparent[ru] = rv
\t\tweight += e[2]
\t}
\treturn weight
}`;

const rust = `fn kruskal(mut edges: Vec<(usize, usize, i32)>, n: usize) -> i32 {
    edges.sort_by_key(|e| e.2);
    let mut parent: Vec<usize> = (0..n).collect();
    fn find(parent: &mut Vec<usize>, mut x: usize) -> usize {
        while parent[x] != x {
            x = parent[x];
        }
        x
    }
    let mut weight = 0;
    for (u, v, w) in edges {
        let (ru, rv) = (find(&mut parent, u), find(&mut parent, v));
        if ru == rv {
            continue;
        }
        parent[ru] = rv;
        weight += w;
    }
    weight
}`;

export const kruskalSources: LangSource<KruskalExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 2, consider: 9, reject: 11, accept: 12, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, consider: 9, reject: 11, accept: 13, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, consider: 17, reject: 19, accept: 22, done: 25 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, consider: 11, reject: 13, accept: 16, done: 19 },
  },
];
