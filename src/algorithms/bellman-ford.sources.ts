import type { LangSource, BellmanFordExecPoint } from '@/components/player/types';

const ts = `function bellmanFord(edges: [number, number, number][], n: number, source: number): number[] {
  const dist = Array(n).fill(Infinity);
  dist[source] = 0;
  for (let k = 0; k < n - 1; k++) {
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  return dist;
}`;

const python = `def bellman_ford(edges, n, source):
    dist = [float('inf')] * n
    dist[source] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist`;

const go = `func bellmanFord(edges [][3]int, n, source int) []int {
\tdist := make([]int, n)
\tfor i := range dist {
\t\tdist[i] = 1 << 30
\t}
\tdist[source] = 0
\tfor k := 0; k < n-1; k++ {
\t\tfor _, e := range edges {
\t\t\tu, v, w := e[0], e[1], e[2]
\t\t\tif dist[u]+w < dist[v] {
\t\t\t\tdist[v] = dist[u] + w
\t\t\t}
\t\t}
\t}
\treturn dist
}`;

const rust = `fn bellman_ford(edges: &Vec<(usize, usize, i32)>, n: usize, source: usize) -> Vec<i32> {
    let mut dist = vec![i32::MAX; n];
    dist[source] = 0;
    for _ in 0..n - 1 {
        for &(u, v, w) in edges {
            if dist[u] != i32::MAX && dist[u] + w < dist[v] {
                dist[v] = dist[u] + w;
            }
        }
    }
    dist
}`;

export const bellmanFordSources: LangSource<BellmanFordExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 2, roundStart: 4, relaxUpdate: 7, relaxSkip: 6, done: 11 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, roundStart: 4, relaxUpdate: 7, relaxSkip: 6, done: 8 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, roundStart: 7, relaxUpdate: 11, relaxSkip: 10, done: 15 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, roundStart: 4, relaxUpdate: 7, relaxSkip: 6, done: 11 },
  },
];
