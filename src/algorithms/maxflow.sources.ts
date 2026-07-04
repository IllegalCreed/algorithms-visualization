import type { LangSource, MaxFlowExecPoint } from '@/components/player/types';

// cap[u][v]=残量容量（原边 + 反向边初始 0）。反复 DFS 在残量图找增广路、推满瓶颈；
// 增流时 cap[u][v]-=d、cap[v][u]+=d（生成/累加反向边，允许后续退流改道）。无增广路即最大流。
// BFS 找最短增广路即 Edmonds-Karp O(VE²)。
const ts = `function maxFlow(n: number, edges: [number, number, number][], s: number, t: number): number {
  const cap = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [u, v, c] of edges) cap[u][v] += c;    // 残量容量（反向边初始 0）
  let flow = 0;
  const dfs = (u: number, pushed: number, vis: boolean[]): number => {
    if (u === t) return pushed;
    vis[u] = true;
    for (let v = 0; v < n; v++) {
      if (!vis[v] && cap[u][v] > 0) {               // 残量 > 0 才能走
        const d = dfs(v, Math.min(pushed, cap[u][v]), vis);
        if (d > 0) { cap[u][v] -= d; cap[v][u] += d; return d; } // 增流 + 反向边加残量
      }
    }
    return 0;
  };
  for (;;) {
    const pushed = dfs(s, Infinity, new Array(n).fill(false)); // 找一条增广路
    if (pushed === 0) break;
    flow += pushed;                                 // 累加瓶颈
  }
  return flow;
}`;

const python = `def max_flow(n, edges, s, t):
    cap = [[0] * n for _ in range(n)]
    for u, v, c in edges: cap[u][v] += c            # 残量容量（反向边初始 0）
    flow = 0
    def dfs(u, pushed, vis):
        if u == t: return pushed
        vis[u] = True
        for v in range(n):
            if not vis[v] and cap[u][v] > 0:        # 残量 > 0 才能走
                d = dfs(v, min(pushed, cap[u][v]), vis)
                if d > 0:
                    cap[u][v] -= d; cap[v][u] += d  # 增流 + 反向边加残量
                    return d
        return 0
    while True:
        pushed = dfs(s, float('inf'), [False] * n)  # 找一条增广路
        if pushed == 0: break
        flow += pushed                              # 累加瓶颈
    return flow`;

const go = `func maxFlow(n int, edges [][3]int, s, t int) int {
\tcap := make([][]int, n)
\tfor i := range cap { cap[i] = make([]int, n) }
\tfor _, e := range edges { cap[e[0]][e[1]] += e[2] } // 残量容量（反向边初始 0）
\tflow := 0
\tvar dfs func(u, pushed int, vis []bool) int
\tdfs = func(u, pushed int, vis []bool) int {
\t\tif u == t { return pushed }
\t\tvis[u] = true
\t\tfor v := 0; v < n; v++ {
\t\t\tif !vis[v] && cap[u][v] > 0 {                // 残量 > 0 才能走
\t\t\t\tif d := dfs(v, min(pushed, cap[u][v]), vis); d > 0 {
\t\t\t\t\tcap[u][v] -= d; cap[v][u] += d           // 增流 + 反向边加残量
\t\t\t\t\treturn d
\t\t\t\t}
\t\t\t}
\t\t}
\t\treturn 0
\t}
\tfor {
\t\tpushed := dfs(s, 1<<30, make([]bool, n))       // 找一条增广路
\t\tif pushed == 0 { break }
\t\tflow += pushed                                 // 累加瓶颈
\t}
\treturn flow
}`;

const rust = `fn max_flow(n: usize, edges: &[(usize, usize, i64)], s: usize, t: usize) -> i64 {
    let mut cap = vec![vec![0i64; n]; n];
    for &(u, v, c) in edges { cap[u][v] += c; }     // 残量容量（反向边初始 0）
    fn dfs(u: usize, pushed: i64, t: usize, n: usize, cap: &mut Vec<Vec<i64>>, vis: &mut Vec<bool>) -> i64 {
        if u == t { return pushed; }
        vis[u] = true;
        for v in 0..n {
            if !vis[v] && cap[u][v] > 0 {            // 残量 > 0 才能走
                let d = dfs(v, pushed.min(cap[u][v]), t, n, cap, vis);
                if d > 0 { cap[u][v] -= d; cap[v][u] += d; return d; } // 增流 + 反向边
            }
        }
        0
    }
    let mut flow = 0;
    loop {
        let pushed = dfs(s, i64::MAX, t, n, &mut cap, &mut vec![false; n]); // 找增广路
        if pushed == 0 { break; }
        flow += pushed;                             // 累加瓶颈
    }
    flow
}`;

export const maxFlowSources: LangSource<MaxFlowExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建残量容量 / find=DFS 找增广路 / augment=增流+反向边 / done=返回最大流
    lineMap: { init: 3, find: 17, augment: 11, done: 21 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 3, find: 16, augment: 12, done: 19 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 4, find: 21, augment: 13, done: 25 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 3, find: 17, augment: 10, done: 21 },
  },
];
