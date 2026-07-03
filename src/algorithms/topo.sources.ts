import type { LangSource, TopoExecPoint } from '@/components/player/types';

const ts = `function topoSort(edges: [number, number][], n: number): number[] {
  const indeg = Array(n).fill(0);
  for (const [u, v] of edges) indeg[v]++;
  const order: number[] = [];
  const done = Array(n).fill(false);
  while (order.length < n) {
    let u = -1;
    for (let i = 0; i < n; i++)
      if (!done[i] && indeg[i] === 0) { u = i; break; }
    if (u === -1) break;
    done[u] = true;
    order.push(u);
    for (const [a, b] of edges) if (a === u) indeg[b]--;
  }
  return order;
}`;

const python = `def topo_sort(edges, n):
    indeg = [0] * n
    for u, v in edges:
        indeg[v] += 1
    order = []
    done = [False] * n
    while len(order) < n:
        u = -1
        for i in range(n):
            if not done[i] and indeg[i] == 0:
                u = i
                break
        if u == -1:
            break
        done[u] = True
        order.append(u)
        for a, b in edges:
            if a == u:
                indeg[b] -= 1
    return order`;

const go = `func topoSort(edges [][2]int, n int) []int {
\tindeg := make([]int, n)
\tfor _, e := range edges {
\t\tindeg[e[1]]++
\t}
\torder := []int{}
\tdone := make([]bool, n)
\tfor len(order) < n {
\t\tu := -1
\t\tfor i := 0; i < n; i++ {
\t\t\tif !done[i] && indeg[i] == 0 {
\t\t\t\tu = i
\t\t\t\tbreak
\t\t\t}
\t\t}
\t\tif u == -1 {
\t\t\tbreak
\t\t}
\t\tdone[u] = true
\t\torder = append(order, u)
\t\tfor _, e := range edges {
\t\t\tif e[0] == u {
\t\t\t\tindeg[e[1]]--
\t\t\t}
\t\t}
\t}
\treturn order
}`;

const rust = `fn topo_sort(edges: &Vec<(usize, usize)>, n: usize) -> Vec<usize> {
    let mut indeg = vec![0; n];
    for &(_, v) in edges {
        indeg[v] += 1;
    }
    let mut order = Vec::new();
    let mut done = vec![false; n];
    while order.len() < n {
        let mut u = usize::MAX;
        for i in 0..n {
            if !done[i] && indeg[i] == 0 {
                u = i;
                break;
            }
        }
        if u == usize::MAX {
            break;
        }
        done[u] = true;
        order.push(u);
        for &(a, b) in edges {
            if a == u {
                indeg[b] -= 1;
            }
        }
    }
    order
}`;

export const topoSources: LangSource<TopoExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 2, selectNode: 7, removeNode: 11, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, selectNode: 8, removeNode: 15, done: 20 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, selectNode: 9, removeNode: 19, done: 27 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, selectNode: 9, removeNode: 19, done: 27 },
  },
];
