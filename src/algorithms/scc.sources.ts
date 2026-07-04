import type { LangSource, TarjanExecPoint } from '@/components/player/types';

const ts = `function tarjan(n: number, adj: number[][]): number[][] {
  const dfn = Array(n).fill(-1), low = Array(n).fill(-1);
  const onStk = Array(n).fill(false), stk: number[] = [];
  const sccs: number[][] = []; let idx = 0;
  const dfs = (u: number) => {
    dfn[u] = low[u] = idx++;              // 发现 u：dfn=low=时间戳
    stk.push(u); onStk[u] = true;         // 入栈
    for (const v of adj[u]) {
      if (dfn[v] === -1) {                // 树边：v 未访问
        dfs(v);
        low[u] = Math.min(low[u], low[v]); // 子树回传
      } else if (onStk[v]) {              // 回边：v 在栈中
        low[u] = Math.min(low[u], dfn[v]);
      }
    }
    if (low[u] === dfn[u]) {              // u 是 SCC 根
      const comp: number[] = []; let w;
      do { w = stk.pop()!; onStk[w] = false; comp.push(w); }
      while (w !== u);                    // 弹栈到 u → 一个 SCC
      sccs.push(comp);
    }
  };
  for (let i = 0; i < n; i++) if (dfn[i] === -1) dfs(i);
  return sccs;
}`;

const python = `def tarjan(n, adj):
    dfn = [-1]*n; low = [-1]*n
    on_stk = [False]*n; stk = []
    sccs = []; idx = [0]
    def dfs(u):
        dfn[u] = low[u] = idx[0]; idx[0] += 1   # 发现 u
        stk.append(u); on_stk[u] = True         # 入栈
        for v in adj[u]:
            if dfn[v] == -1:                    # 树边
                dfs(v)
                low[u] = min(low[u], low[v])    # 子树回传
            elif on_stk[v]:                     # 回边
                low[u] = min(low[u], dfn[v])
        if low[u] == dfn[u]:                    # u 是 SCC 根
            comp = []
            while True:
                w = stk.pop(); on_stk[w] = False; comp.append(w)
                if w == u: break                # 弹栈到 u
            sccs.append(comp)
    for i in range(n):
        if dfn[i] == -1: dfs(i)
    return sccs`;

const go = `func tarjan(n int, adj [][]int) [][]int {
\tdfn := make([]int, n); low := make([]int, n)
\tfor i := range dfn { dfn[i] = -1 }
\tonStk := make([]bool, n); stk := []int{}
\tsccs := [][]int{}; idx := 0
\tvar dfs func(u int)
\tdfs = func(u int) {
\t\tdfn[u] = idx; low[u] = idx; idx++      // 发现 u
\t\tstk = append(stk, u); onStk[u] = true  // 入栈
\t\tfor _, v := range adj[u] {
\t\t\tif dfn[v] == -1 {                    // 树边
\t\t\t\tdfs(v)
\t\t\t\tif low[v] < low[u] { low[u] = low[v] }
\t\t\t} else if onStk[v] {                 // 回边
\t\t\t\tif dfn[v] < low[u] { low[u] = dfn[v] }
\t\t\t}
\t\t}
\t\tif low[u] == dfn[u] {                  // u 是 SCC 根
\t\t\tcomp := []int{}
\t\t\tfor {
\t\t\t\tw := stk[len(stk)-1]; stk = stk[:len(stk)-1]
\t\t\t\tonStk[w] = false; comp = append(comp, w)
\t\t\t\tif w == u { break }
\t\t\t}
\t\t\tsccs = append(sccs, comp)
\t\t}
\t}
\tfor i := 0; i < n; i++ { if dfn[i] == -1 { dfs(i) } }
\treturn sccs
}`;

const rust = `fn tarjan(n: usize, adj: &Vec<Vec<usize>>) -> Vec<Vec<usize>> {
    let mut dfn = vec![-1i32; n];
    let mut low = vec![-1i32; n];
    let mut on_stk = vec![false; n];
    let mut stk: Vec<usize> = Vec::new();
    let mut sccs: Vec<Vec<usize>> = Vec::new();
    let mut idx = 0i32;
    fn dfs(u: usize, adj: &Vec<Vec<usize>>, dfn: &mut Vec<i32>, low: &mut Vec<i32>,
           on_stk: &mut Vec<bool>, stk: &mut Vec<usize>, sccs: &mut Vec<Vec<usize>>, idx: &mut i32) {
        dfn[u] = *idx; low[u] = *idx; *idx += 1;   // 发现 u
        stk.push(u); on_stk[u] = true;             // 入栈
        for &v in &adj[u] {
            if dfn[v] == -1 {                      // 树边
                dfs(v, adj, dfn, low, on_stk, stk, sccs, idx);
                low[u] = low[u].min(low[v]);
            } else if on_stk[v] {                  // 回边
                low[u] = low[u].min(dfn[v]);
            }
        }
        if low[u] == dfn[u] {                      // u 是 SCC 根
            let mut comp = Vec::new();
            loop {
                let w = stk.pop().unwrap(); on_stk[w] = false;
                comp.push(w);
                if w == u { break; }
            }
            sccs.push(comp);
        }
    }
    for i in 0..n {
        if dfn[i] == -1 { dfs(i, adj, &mut dfn, &mut low, &mut on_stk, &mut stk, &mut sccs, &mut idx); }
    }
    sccs
}`;

export const sccSources: LangSource<TarjanExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { enter: 6, tree: 11, back: 13, scc: 19, done: 25 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { enter: 6, tree: 11, back: 13, scc: 17, done: 22 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { enter: 8, tree: 13, back: 15, scc: 22, done: 29 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { enter: 10, tree: 15, back: 17, scc: 23, done: 31 },
  },
];
