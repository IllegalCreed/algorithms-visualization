import type { LangSource, RerootExecPoint } from '@/components/player/types';

// 换根 DP 二次扫描：dfs1 后序算 size/down；dfs2 前序 ans[v] = ans[u] − size[v] + (n − size[v])。
const ts = `function sumOfDistances(n: number, adj: number[][]): number[] {
  const size = new Array(n).fill(1);
  const down = new Array(n).fill(0);
  const ans = new Array(n).fill(0);
  const dfs1 = (u: number, p: number): void => {  // 第一趟：后序
    for (const v of adj[u]) if (v !== p) {
      dfs1(v, u);
      size[u] += size[v];
      down[u] += down[v] + size[v];  // 孩子子树整体抬 1 步
    }
  };
  const dfs2 = (u: number, p: number): void => {  // 第二趟：前序换根
    for (const v of adj[u]) if (v !== p) {
      ans[v] = ans[u] - size[v] + (n - size[v]);  // 近 size[v] 远 n−size[v]
      dfs2(v, u);
    }
  };
  dfs1(0, -1);
  ans[0] = down[0];                // 第一趟收官：根的答案
  dfs2(0, -1);
  return ans;
}`;

const python = `def sum_of_distances(n, adj):
    size = [1] * n
    down = [0] * n
    ans = [0] * n

    def dfs1(u, p):              # 第一趟：后序
        for v in adj[u]:
            if v != p:
                dfs1(v, u)
                size[u] += size[v]
                down[u] += down[v] + size[v]  # 子树整体抬 1 步

    def dfs2(u, p):              # 第二趟：前序换根
        for v in adj[u]:
            if v != p:
                ans[v] = ans[u] - size[v] + (n - size[v])
                dfs2(v, u)       # 近 size[v] 远 n−size[v]

    dfs1(0, -1)
    ans[0] = down[0]             # 第一趟收官：根的答案
    dfs2(0, -1)
    return ans`;

const go = `func sumOfDistances(n int, adj [][]int) []int {
\tsize := make([]int, n)
\tdown := make([]int, n)
\tans := make([]int, n)
\tfor i := range size {
\t\tsize[i] = 1
\t}
\tvar dfs1 func(u, p int)
\tdfs1 = func(u, p int) { // 第一趟：后序
\t\tfor _, v := range adj[u] {
\t\t\tif v != p {
\t\t\t\tdfs1(v, u)
\t\t\t\tsize[u] += size[v]
\t\t\t\tdown[u] += down[v] + size[v] // 子树整体抬 1 步
\t\t\t}
\t\t}
\t}
\tvar dfs2 func(u, p int)
\tdfs2 = func(u, p int) { // 第二趟：前序换根
\t\tfor _, v := range adj[u] {
\t\t\tif v != p {
\t\t\t\tans[v] = ans[u] - size[v] + (n - size[v])
\t\t\t\tdfs2(v, u) // 近 size[v] 远 n−size[v]
\t\t\t}
\t\t}
\t}
\tdfs1(0, -1)
\tans[0] = down[0] // 第一趟收官：根的答案
\tdfs2(0, -1)
\treturn ans
}`;

const rust = `fn sum_of_distances(n: usize, adj: &[Vec<usize>]) -> Vec<i64> {
    let mut size = vec![1i64; n];
    let mut down = vec![0i64; n];
    let mut ans = vec![0i64; n];
    fn dfs1(u: usize, p: usize, adj: &[Vec<usize>], size: &mut [i64], down: &mut [i64]) {
        for &v in &adj[u] {
            if v != p {
                dfs1(v, u, adj, size, down); // 第一趟：后序
                size[u] += size[v];
                down[u] += down[v] + size[v]; // 子树整体抬 1 步
            }
        }
    }
    fn dfs2(u: usize, p: usize, n: i64, adj: &[Vec<usize>], size: &[i64], ans: &mut [i64]) {
        for &v in &adj[u] {
            if v != p {
                ans[v] = ans[u] - size[v] + (n - size[v]); // 近/远
                dfs2(v, u, n, adj, size, ans); // 第二趟：前序换根
            }
        }
    }
    dfs1(0, usize::MAX, adj, &mut size, &mut down);
    ans[0] = down[0]; // 第一趟收官：根的答案
    dfs2(0, usize::MAX, n as i64, adj, &size, &mut ans);
    ans
}`;

export const rerootSources: LangSource<RerootExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=入口 / down=后序累加 / root=根答案 / reroot=换根公式 / done=返回
    lineMap: { init: 2, down: 9, root: 19, reroot: 14, done: 21 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, down: 11, root: 20, reroot: 16, done: 22 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, down: 14, root: 28, reroot: 22, done: 30 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, down: 10, root: 23, reroot: 17, done: 25 },
  },
];
