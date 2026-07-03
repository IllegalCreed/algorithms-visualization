import type { LangSource, FloydExecPoint } from '@/components/player/types';

const ts = `function floyd(adj: number[][], n: number): number[][] {
  const dist = adj.map((row) => [...row]);
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`;

const python = `def floyd(adj, n):
    dist = [row[:] for row in adj]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`;

const go = `func floyd(adj [][]int, n int) [][]int {
\tdist := make([][]int, n)
\tfor i := range adj {
\t\tdist[i] = append([]int{}, adj[i]...)
\t}
\tfor k := 0; k < n; k++ {
\t\tfor i := 0; i < n; i++ {
\t\t\tfor j := 0; j < n; j++ {
\t\t\t\tif dist[i][k]+dist[k][j] < dist[i][j] {
\t\t\t\t\tdist[i][j] = dist[i][k] + dist[k][j]
\t\t\t\t}
\t\t\t}
\t\t}
\t}
\treturn dist
}`;

const rust = `fn floyd(adj: &Vec<Vec<i64>>, n: usize) -> Vec<Vec<i64>> {
    let mut dist = adj.clone();
    for k in 0..n {
        for i in 0..n {
            for j in 0..n {
                if dist[i][k] + dist[k][j] < dist[i][j] {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    dist
}`;

export const floydSources: LangSource<FloydExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 2, pivotStart: 3, relaxUpdate: 7, relaxSkip: 6, done: 12 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, pivotStart: 3, relaxUpdate: 7, relaxSkip: 6, done: 8 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, pivotStart: 6, relaxUpdate: 10, relaxSkip: 9, done: 15 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, pivotStart: 3, relaxUpdate: 7, relaxSkip: 6, done: 12 },
  },
];
