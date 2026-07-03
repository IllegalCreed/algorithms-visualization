import type {
  AlgorithmModule,
  BellmanFordExecPoint,
  GraphTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { BF_VERTICES, BF_EDGES, BF_SOURCE } from './bellman-ford';
import { bellmanFordSources } from './bellman-ford.sources';

/** 含负权固定有向图，V−1 轮逐边松弛（边序逆序演示轮次向外传播），产出图轨胖步骤 */
export function buildBellmanFordSteps(): Step<BellmanFordExecPoint>[] {
  const V = BF_VERTICES;
  const n = V.length;
  const edges = BF_EDGES.map((e) => ({ key: e.key, from: e.from, to: e.to, w: e.w }));
  const labelOf = (i: number) => V[i].label;

  const dist = Array.from({ length: n }, () => Infinity);
  const prev: (number | null)[] = Array.from({ length: n }, () => null);
  dist[BF_SOURCE] = 0;

  const steps: Step<BellmanFordExecPoint>[] = [];
  const badge = () => dist.map((d) => (d === Infinity ? '∞' : String(d)));
  const graph = (opts: {
    active?: number | null;
    edgeClass?: Record<string, string>;
    done?: number[];
  }): GraphTrack => ({
    vertices: V.map((v) => ({ id: v.id, label: v.label, x: v.x, y: v.y })),
    edges,
    directed: true,
    nodeBadge: badge(),
    doneNodes: opts.done ?? [],
    activeNode: opts.active ?? null,
    edgeClass: opts.edgeClass ?? {},
  });
  const vars = (
    k: number | string,
    cur: (typeof edges)[number] | null,
    updated: number,
  ): VarRow[] => [
    { name: '轮次 k', value: k },
    { name: '总轮数 V−1', value: n - 1 },
    { name: '当前边', value: cur ? `${labelOf(cur.from)}→${labelOf(cur.to)}（w=${cur.w}）` : '-' },
    { name: '本轮已更新', value: updated },
    ...V.map((v) => ({
      name: `dist[${v.label}]`,
      value: dist[v.id] === Infinity ? '∞' : dist[v.id],
    })),
  ];
  const emit = (point: BellmanFordExecPoint, g: GraphTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, graph: g, caption });
  };

  emit('init', graph({}), vars('-', null, 0), `源 ${labelOf(BF_SOURCE)} 距离置 0，其余置 ∞`);

  for (let k = 1; k <= n - 1; k++) {
    emit(
      'roundStart',
      graph({}),
      vars(k, null, 0),
      `第 ${k} 轮（共 ${n - 1} 轮）：把所有边都松弛一遍`,
    );
    let updated = 0;
    for (const e of edges) {
      const canRelax = dist[e.from] + e.w < dist[e.to];
      if (canRelax) {
        dist[e.to] = dist[e.from] + e.w;
        prev[e.to] = e.from;
        updated++;
        emit(
          'relaxUpdate',
          graph({ active: e.to, edgeClass: { [e.key]: 'current' } }),
          vars(k, e, updated),
          `松弛 ${labelOf(e.from)}→${labelOf(e.to)}（w=${e.w}）：更短！dist[${labelOf(e.to)}]=${dist[e.to]}`,
        );
      } else {
        emit(
          'relaxSkip',
          graph({ active: e.to, edgeClass: { [e.key]: 'current' } }),
          vars(k, e, updated),
          `松弛 ${labelOf(e.from)}→${labelOf(e.to)}（w=${e.w}）：不更短，跳过`,
        );
      }
    }
  }

  // 最短路树：每个非源点由 prev 连一条入树边
  const treeClass: Record<string, string> = {};
  for (let v = 0; v < n; v++) {
    if (prev[v] !== null) treeClass[`${prev[v]}-${v}`] = 'tree';
  }
  emit(
    'done',
    graph({ edgeClass: treeClass, done: V.map((v) => v.id) }),
    vars('done', null, 0),
    `${n - 1} 轮完成，最短路确定。dist=[${dist.join(',')}]，最短路树（绿边）已定`,
  );
  return steps;
}

export const bellmanFordModule: AlgorithmModule<BellmanFordExecPoint> = {
  title: 'Bellman-Ford 最短路',
  initialInput: () => [],
  buildSteps: () => buildBellmanFordSteps(),
  sources: bellmanFordSources,
};
