import type { LangSource, DijkstraExecPoint } from '@/components/player/types';

const ts = `function dijkstra(adj: [number, number][][], source: number, n: number): number[] {
  const dist = Array(n).fill(Infinity);
  dist[source] = 0;
  const done = Array(n).fill(false);
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++)
      if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
    if (u < 0) break;
    done[u] = true;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  return dist;
}`;

const python = `def dijkstra(adj, source, n):
    dist = [float('inf')] * n
    dist[source] = 0
    done = [False] * n
    for _ in range(n):
        u = -1
        for i in range(n):
            if not done[i] and dist[i] < float('inf') and (u < 0 or dist[i] < dist[u]):
                u = i
        if u < 0:
            break
        done[u] = True
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist`;

const go = `func dijkstra(adj [][][2]int, source, n int) []int {
\tdist := make([]int, n)
\tfor i := range dist {
\t\tdist[i] = 1 << 30
\t}
\tdist[source] = 0
\tdone := make([]bool, n)
\tfor k := 0; k < n; k++ {
\t\tu := -1
\t\tfor i := 0; i < n; i++ {
\t\t\tif !done[i] && dist[i] < (1<<30) && (u < 0 || dist[i] < dist[u]) {
\t\t\t\tu = i
\t\t\t}
\t\t}
\t\tif u < 0 {
\t\t\tbreak
\t\t}
\t\tdone[u] = true
\t\tfor _, e := range adj[u] {
\t\t\tv, w := e[0], e[1]
\t\t\tif dist[u]+w < dist[v] {
\t\t\t\tdist[v] = dist[u] + w
\t\t\t}
\t\t}
\t}
\treturn dist
}`;

const rust = `fn dijkstra(adj: &Vec<Vec<(usize, i32)>>, source: usize, n: usize) -> Vec<i32> {
    let mut dist = vec![i32::MAX; n];
    dist[source] = 0;
    let mut done = vec![false; n];
    for _ in 0..n {
        let mut u = usize::MAX;
        for i in 0..n {
            if !done[i] && dist[i] < i32::MAX && (u == usize::MAX || dist[i] < dist[u]) {
                u = i;
            }
        }
        if u == usize::MAX {
            break;
        }
        done[u] = true;
        for &(v, w) in &adj[u] {
            if dist[u] + w < dist[v] {
                dist[v] = dist[u] + w;
            }
        }
    }
    dist
}`;

export const dijkstraSources: LangSource<DijkstraExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      init: 3,
      selectMin: 9,
      settle: 11,
      relaxEdge: 13,
      relaxUpdate: 14,
      relaxSkip: 13,
      done: 18,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      init: 3,
      selectMin: 9,
      settle: 11,
      relaxEdge: 13,
      relaxUpdate: 14,
      relaxSkip: 13,
      done: 15,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      init: 6,
      selectMin: 12,
      settle: 17,
      relaxEdge: 20,
      relaxUpdate: 21,
      relaxSkip: 20,
      done: 26,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      init: 3,
      selectMin: 10,
      settle: 14,
      relaxEdge: 16,
      relaxUpdate: 17,
      relaxSkip: 16,
      done: 22,
    },
  },
];
