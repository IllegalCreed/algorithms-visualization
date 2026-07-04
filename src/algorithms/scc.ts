// src/algorithms/scc.ts
// Tarjan 强连通分量固定有向图 + dfn/low + SCC oracle。图算法第 7 页（C-069，扩展 GraphView）。
// SCC：{0,1,2} + {3,4} + {5} 共 3 个。

export const SCC_N = 6;

/** 固定节点坐标（viewBox 460×300）：{0,1,2} 左三角、{3,4} 中竖、{5} 右 */
export const SCC_VERTS = [
  { id: 0, label: '0', x: 70, y: 70 },
  { id: 1, label: '1', x: 70, y: 230 },
  { id: 2, label: '2', x: 180, y: 150 },
  { id: 3, label: '3', x: 300, y: 70 },
  { id: 4, label: '4', x: 300, y: 230 },
  { id: 5, label: '5', x: 410, y: 150 },
];

/** 有向边（from→to）：0→1→2→0 环 + 2→3 + 3→4→3 环 + 4→5 */
export const SCC_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 0],
  [2, 3],
  [3, 4],
  [4, 3],
  [4, 5],
];

function tarjan(): { dfn: number[]; low: number[]; comp: number[]; sccs: number[][] } {
  const adj: number[][] = Array.from({ length: SCC_N }, () => []);
  for (const [a, b] of SCC_EDGES) adj[a].push(b);
  const dfn = new Array<number>(SCC_N).fill(-1);
  const low = new Array<number>(SCC_N).fill(-1);
  const comp = new Array<number>(SCC_N).fill(-1);
  const onStack = new Array<boolean>(SCC_N).fill(false);
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
  for (let i = 0; i < SCC_N; i++) if (dfn[i] === -1) dfs(i);
  return { dfn, low, comp, sccs };
}

/** 所有 SCC（按发现序，每组内为弹栈序）。本图 → [[5],[4,3],[2,1,0]] */
export function tarjanSCCs(): number[][] {
  return tarjan().sccs;
}

/** dfn（发现序）/ low（可回溯最小 dfn）。本图 → dfn=[0,1,2,3,4,5]、low=[0,0,0,3,3,5] */
export function tarjanDfnLow(): { dfn: number[]; low: number[] } {
  const { dfn, low } = tarjan();
  return { dfn, low };
}
