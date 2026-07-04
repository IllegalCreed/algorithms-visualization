// src/algorithms/twosat.ts
// 2-SAT 固定实例 + 蕴含图 + Tarjan SCC 判定 + 逆拓扑序赋值 oracle。图算法第 8 页（C-074，复用 GraphView）。
// 变量 A,B,C；子句 (A∨B)∧(A∨¬B)∧(A∨C)∧(¬A∨¬B)；可满足，解 A=真/B=假/C=真。

/** 一个文字：变量下标 v + 正负 pos（true=x_v，false=¬x_v） */
export interface Lit {
  v: number;
  pos: boolean;
}

export const TS_VARS = ['A', 'B', 'C'] as const;
export const TS_N = TS_VARS.length; // 变量数 3
export const TS_NL = TS_N * 2; // 文字节点数 6

/** 文字 → 节点 id：x_v=2v（正）、¬x_v=2v+1（负）。A=0,¬A=1,B=2,¬B=3,C=4,¬C=5 */
export function litNode(l: Lit): number {
  return 2 * l.v + (l.pos ? 0 : 1);
}
/** 节点取反：x ⟷ ¬x（异或最低位） */
export function negNode(node: number): number {
  return node ^ 1;
}
/** 节点 id → 展示标签，如 'A' / '¬A' */
export function nodeLabel(node: number): string {
  const name = TS_VARS[node >> 1];
  return node & 1 ? `¬${name}` : name;
}

const L = (v: number, pos: boolean): Lit => ({ v, pos });

/** 固定子句：(A∨B)∧(A∨¬B)∧(A∨C)∧(¬A∨¬B) */
export const TS_CLAUSES: [Lit, Lit][] = [
  [L(0, true), L(1, true)], // A ∨ B
  [L(0, true), L(1, false)], // A ∨ ¬B
  [L(0, true), L(2, true)], // A ∨ C
  [L(0, false), L(1, false)], // ¬A ∨ ¬B
];

/** 子句展示，如 '(A∨B)' */
export function clauseLabel(c: [Lit, Lit]): string {
  return `(${nodeLabel(litNode(c[0]))}∨${nodeLabel(litNode(c[1]))})`;
}

/** 6 文字节点固定坐标（viewBox 460×300）：3 列（变量 A/B/C）× 2 行（上正 / 下负） */
export const TS_VERTS = [
  { id: 0, label: 'A', x: 90, y: 70 },
  { id: 1, label: '¬A', x: 90, y: 230 },
  { id: 2, label: 'B', x: 230, y: 70 },
  { id: 3, label: '¬B', x: 230, y: 230 },
  { id: 4, label: 'C', x: 370, y: 70 },
  { id: 5, label: '¬C', x: 370, y: 230 },
];

/** 蕴含边：子句 (a∨b) ⟹ ¬a→b、¬b→a。按子句顺序，每子句 2 条，共 8 条 */
export function twoSatImplications(): [number, number][] {
  const edges: [number, number][] = [];
  for (const [a, b] of TS_CLAUSES) {
    const na = litNode(a);
    const nb = litNode(b);
    edges.push([negNode(na), nb]); // ¬a → b
    edges.push([negNode(nb), na]); // ¬b → a
  }
  return edges;
}

/** Tarjan 强连通分量（与 C-069 同一套 dfn/low/comp/栈），作用在蕴含图上。
 *  本例 → dfn=[0,2,3,1,4,5]、low=[0,2,2,0,4,5]、comp=[0,2,2,0,1,3]、
 *  sccs 发现序=[[3,0],[4],[2,1],[5]]（即 {¬B,A}/{C}/{B,¬A}/{¬C}）。 */
export function twoSatTarjan(): {
  dfn: number[];
  low: number[];
  comp: number[];
  sccs: number[][];
} {
  const adj: number[][] = Array.from({ length: TS_NL }, () => []);
  for (const [a, b] of twoSatImplications()) adj[a].push(b);
  const dfn = new Array<number>(TS_NL).fill(-1);
  const low = new Array<number>(TS_NL).fill(-1);
  const comp = new Array<number>(TS_NL).fill(-1);
  const onStack = new Array<boolean>(TS_NL).fill(false);
  const stack: number[] = [];
  const sccs: number[][] = [];
  let idx = 0;
  const dfs = (u: number): void => {
    dfn[u] = low[u] = idx++;
    stack.push(u);
    onStack[u] = true;
    for (const v of adj[u]) {
      if (dfn[v] === -1) {
        dfs(v);
        low[u] = Math.min(low[u], low[v]);
      } else if (onStack[v]) {
        low[u] = Math.min(low[u], dfn[v]);
      }
    }
    if (low[u] === dfn[u]) {
      const group: number[] = [];
      for (;;) {
        const w = stack.pop() as number;
        onStack[w] = false;
        comp[w] = sccs.length;
        group.push(w);
        if (w === u) break;
      }
      sccs.push(group);
    }
  };
  for (let i = 0; i < TS_NL; i++) if (dfn[i] === -1) dfs(i);
  return { dfn, low, comp, sccs };
}

/** 判定 + 赋值：x_v 与 ¬x_v 同 SCC ⟺ 无解；否则 x_v 真 ⟺ comp[x_v] < comp[¬x_v]（comp 为逆拓扑序）。
 *  本例可满足，解 assign=[true,false,true]（A=真/B=假/C=真）。 */
export function twoSatSolve(): { sat: boolean; assign: boolean[] } {
  const { comp } = twoSatTarjan();
  const assign: boolean[] = [];
  let sat = true;
  for (let v = 0; v < TS_N; v++) {
    if (comp[2 * v] === comp[2 * v + 1]) sat = false;
    assign.push(comp[2 * v] < comp[2 * v + 1]);
  }
  return { sat, assign };
}
