import type { LangSource, TwoSatExecPoint } from '@/components/player/types';

// 文字编码：变量 v 的正文字 = 2v、负文字 = 2v+1，取反 = 异或 1。
// 子句 (a∨b) 用一对文字节点 [a,b] 表示；蕴含 ¬a→b、¬b→a。
// Tarjan 求强连通分量见图算法第 7 页，这里作 tarjan(n, g) → comp[]（comp 为逆拓扑序）复用。
const ts = `function twoSat(n: number, clauses: [number, number][]): boolean[] | null {
  const g: number[][] = Array.from({ length: 2 * n }, () => []); // 2n 文字节点，蕴含图空
  for (const [a, b] of clauses) {                 // 逐子句加两条蕴含边
    g[a ^ 1].push(b);                             // ¬a → b
    g[b ^ 1].push(a);                             // ¬b → a
  }
  const comp = tarjan(2 * n, g);                  // Tarjan 求 SCC（第 7 页），comp=逆拓扑序
  for (let v = 0; v < n; v++)                     // 判定：x 与 ¬x 同组 ⟺ 无解
    if (comp[2 * v] === comp[2 * v + 1]) return null;
  const assign: boolean[] = [];
  for (let v = 0; v < n; v++)                     // 赋值：取拓扑序更后的文字为真
    assign.push(comp[2 * v] < comp[2 * v + 1]);
  return assign;                                  // 可满足解
}`;

const python = `def two_sat(n, clauses):
    g = [[] for _ in range(2 * n)]        # 2n 文字节点，蕴含图空
    for a, b in clauses:                  # 逐子句加两条蕴含边
        g[a ^ 1].append(b)                # ¬a → b
        g[b ^ 1].append(a)                # ¬b → a
    comp = tarjan(2 * n, g)               # Tarjan 求 SCC（第 7 页），comp=逆拓扑序
    for v in range(n):                    # 判定：x 与 ¬x 同组 ⟺ 无解
        if comp[2 * v] == comp[2 * v + 1]:
            return None
    assign = []
    for v in range(n):                    # 赋值：取拓扑序更后的文字为真
        assign.append(comp[2 * v] < comp[2 * v + 1])
    return assign                         # 可满足解`;

const go = `func twoSat(n int, clauses [][2]int) []bool {
\tg := make([][]int, 2*n)                 // 2n 文字节点，蕴含图空
\tfor _, c := range clauses {             // 逐子句加两条蕴含边
\t\tg[c[0]^1] = append(g[c[0]^1], c[1])   // ¬a → b
\t\tg[c[1]^1] = append(g[c[1]^1], c[0])   // ¬b → a
\t}
\tcomp := tarjan(2*n, g)                  // Tarjan 求 SCC（第 7 页），comp=逆拓扑序
\tfor v := 0; v < n; v++ {                // 判定：x 与 ¬x 同组 ⟺ 无解
\t\tif comp[2*v] == comp[2*v+1] { return nil }
\t}
\tassign := make([]bool, n)
\tfor v := 0; v < n; v++ {                // 赋值：取拓扑序更后的文字为真
\t\tassign[v] = comp[2*v] < comp[2*v+1]
\t}
\treturn assign                           // 可满足解
}`;

const rust = `fn two_sat(n: usize, clauses: &[(usize, usize)]) -> Option<Vec<bool>> {
    let mut g = vec![Vec::new(); 2 * n];    // 2n 文字节点，蕴含图空
    for &(a, b) in clauses {                // 逐子句加两条蕴含边
        g[a ^ 1].push(b);                   // ¬a → b
        g[b ^ 1].push(a);                   // ¬b → a
    }
    let comp = tarjan(2 * n, &g);           // Tarjan 求 SCC（第 7 页），comp=逆拓扑序
    for v in 0..n {                         // 判定：x 与 ¬x 同组 ⟺ 无解
        if comp[2 * v] == comp[2 * v + 1] { return None; }
    }
    let mut assign = vec![false; n];
    for v in 0..n {                         // 赋值：取拓扑序更后的文字为真
        assign[v] = comp[2 * v] < comp[2 * v + 1];
    }
    Some(assign)                            // 可满足解
}`;

export const twoSatSources: LangSource<TwoSatExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建图 / clause=加蕴含边 / scc=Tarjan / check=判定同组 / assign=赋值 / done=返回
    lineMap: { init: 2, clause: 4, scc: 7, check: 9, assign: 12, done: 13 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, clause: 4, scc: 6, check: 8, assign: 12, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, clause: 4, scc: 7, check: 9, assign: 13, done: 15 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, clause: 4, scc: 7, check: 9, assign: 13, done: 15 },
  },
];
