import type {
  AlgorithmModule,
  GraphTrack,
  Step,
  TarjanExecPoint,
  VarRow,
} from '@/components/player/types';
import { SCC_N, SCC_VERTS, SCC_EDGES } from './scc';
import { sccSources } from './scc.sources';

const EDGES = SCC_EDGES.map(([a, b]) => ({ key: `${a}-${b}`, from: a, to: b }));

/** 固定 6 点有向图 Tarjan 一趟 DFS 逐事件重走，产出图轨胖步骤（扩展 GraphView，第 6 消费者）。
 *  dfn/low 徽标 + 在栈虚线环 + SCC 分组着色 + 树边绿/回边黄；数出所有强连通分量。 */
export function buildSccSteps(): Step<TarjanExecPoint>[] {
  const adj: number[][] = Array.from({ length: SCC_N }, () => []);
  for (const [a, b] of SCC_EDGES) adj[a].push(b);

  const dfn = new Array<number>(SCC_N).fill(-1);
  const low = new Array<number>(SCC_N).fill(-1);
  const comp = new Array<number>(SCC_N).fill(-1);
  const onStack = new Array<boolean>(SCC_N).fill(false);
  const stack: number[] = [];
  const treeEdges = new Set<string>();
  const steps: Step<TarjanExecPoint>[] = [];
  let idx = 0;
  let sccCount = 0;

  const edgeClassOf = (cur: string | null): Record<string, string> => {
    const ec: Record<string, string> = {};
    for (const k of treeEdges) ec[k] = 'tree';
    if (cur) ec[cur] = 'current';
    return ec;
  };
  const vars = (u: number | null): VarRow[] => [
    { name: '节点/边', value: `${SCC_N} 点 / ${SCC_EDGES.length} 有向边` },
    {
      name: '当前节点',
      value: u == null ? '-' : `${u}（dfn=${dfn[u]}, low=${low[u]}）`,
    },
    { name: '栈', value: stack.length ? `[${stack.join(', ')}]` : '空' },
    { name: '已找 SCC', value: `${sccCount}` },
  ];
  const emit = (
    point: TarjanExecPoint,
    u: number | null,
    cur: string | null,
    caption: string,
  ): void => {
    const graph: GraphTrack = {
      vertices: SCC_VERTS,
      edges: EDGES,
      directed: true,
      nodeBadge: dfn.map((d, i) => (d >= 0 ? `${d}/${low[i]}` : null)),
      activeNode: u,
      nodeGroup: comp.map((c) => (c >= 0 ? c : null)),
      stackNodes: [...stack],
      edgeClass: edgeClassOf(cur),
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: vars(u), point, graph, caption });
  };

  const dfs = (u: number, parentEdge: string | null): void => {
    dfn[u] = low[u] = idx++;
    stack.push(u);
    onStack[u] = true;
    emit('enter', u, parentEdge, `访问节点 ${u}：dfn=low=${dfn[u]}，入栈`);
    for (const v of adj[u]) {
      const ek = `${u}-${v}`;
      if (dfn[v] === -1) {
        treeEdges.add(ek);
        dfs(v, ek);
        low[u] = Math.min(low[u], low[v]);
        emit(
          'tree',
          u,
          ek,
          `子树 ${v} 返回：low[${u}]=min(low[${u}], low[${v}]=${low[v]})=${low[u]}`,
        );
      } else if (onStack[v]) {
        low[u] = Math.min(low[u], dfn[v]);
        emit(
          'back',
          u,
          ek,
          `回边 ${u}→${v}（${v} 在栈中）：low[${u}]=min(low, dfn[${v}]=${dfn[v]})=${low[u]}`,
        );
      }
    }
    if (low[u] === dfn[u]) {
      const group: number[] = [];
      for (;;) {
        const w = stack.pop() as number;
        onStack[w] = false;
        comp[w] = sccCount;
        group.push(w);
        if (w === u) break;
      }
      sccCount++;
      emit(
        'scc',
        u,
        null,
        `low[${u}]==dfn[${u}]=${dfn[u]} → ${u} 是 SCC 根，弹栈得第 ${sccCount} 个强连通分量 {${group.join(',')}}`,
      );
    }
  };

  for (let i = 0; i < SCC_N; i++) if (dfn[i] === -1) dfs(i, null);

  emit('done', null, null, `全部访问完毕：共 ${sccCount} 个强连通分量（同色为一个 SCC）`);
  return steps;
}

export const sccModule: AlgorithmModule<TarjanExecPoint> = {
  title: '强连通分量（Tarjan）',
  initialInput: () => [],
  buildSteps: () => buildSccSteps(),
  sources: sccSources,
};
