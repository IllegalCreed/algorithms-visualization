import type {
  AlgorithmModule,
  DijkstraExecPoint,
  GraphTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { useDijkstra } from '@/components/structures/useDijkstra';
import { dijkstraSources } from './dijkstra.sources';

/** 复用 useDijkstra 固定有向带权图（源 A），细粒度重走 Dijkstra，产出图轨胖步骤 */
export function buildDijkstraSteps(): Step<DijkstraExecPoint>[] {
  const dij = useDijkstra();
  const V = dij.vertices;
  const n = V.length;
  const source = dij.source;
  const edges = dij.edges.map((e) => ({
    key: `${e.from}-${e.to}`,
    from: e.from,
    to: e.to,
    w: e.w,
  }));
  const labelOf = (i: number) => V[i].label;

  const steps: Step<DijkstraExecPoint>[] = [];
  const dist = Array.from({ length: n }, () => Infinity);
  const prev: (number | null)[] = Array.from({ length: n }, () => null);
  const done = Array.from({ length: n }, () => false);
  const order: number[] = [];
  dist[source] = 0;

  const badge = () => dist.map((d) => (d === Infinity ? '∞' : String(d)));
  const graph = (opts: {
    active?: number | null;
    edgeClass?: Record<string, string>;
  }): GraphTrack => ({
    vertices: V.map((v) => ({ id: v.id, label: v.label, x: v.x, y: v.y })),
    edges,
    directed: true,
    nodeBadge: badge(),
    doneNodes: [...order],
    activeNode: opts.active ?? null,
    edgeClass: opts.edgeClass ?? {},
  });
  const vars = (u: number | string, k: number | string): VarRow[] => [
    { name: 'n', value: n },
    { name: 'k', value: k },
    { name: 'u（当前点）', value: typeof u === 'number' && u >= 0 ? labelOf(u) : '-' },
    { name: '已确定', value: order.map(labelOf).join(' ') || '-' },
    ...V.map((v) => ({
      name: `dist[${v.label}]`,
      value: dist[v.id] === Infinity ? '∞' : dist[v.id],
    })),
  ];
  const emit = (point: DijkstraExecPoint, g: GraphTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, graph: g, caption });
  };

  emit('init', graph({}), vars('-', 0), `源 ${labelOf(source)} 距离置 0，其余置 ∞`);

  for (let k = 0; k < n; k++) {
    // 取未确定中 dist 最小的点
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!done[i] && dist[i] !== Infinity && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1) break; // 余下不可达
    emit(
      'selectMin',
      graph({ active: u }),
      vars(u, k),
      `未确定点里取 dist 最小：${labelOf(u)}（dist=${dist[u]}）`,
    );
    done[u] = true;
    order.push(u);
    emit('settle', graph({ active: u }), vars(u, k), `确定 ${labelOf(u)}——它的最短距离已定`);
    for (const e of dij.adj[u]) {
      const key = `${e.from}-${e.to}`;
      emit(
        'relaxEdge',
        graph({ active: u, edgeClass: { [key]: 'relaxed' } }),
        vars(u, k),
        `考虑出边 ${labelOf(u)}→${labelOf(e.to)}（权 ${e.w}）：比 ${dist[u]}+${e.w} 与 dist[${labelOf(e.to)}]`,
      );
      if (dist[u] + e.w < dist[e.to]) {
        dist[e.to] = dist[u] + e.w;
        prev[e.to] = u;
        emit(
          'relaxUpdate',
          graph({ active: u, edgeClass: { [key]: 'relaxed' } }),
          vars(u, k),
          `更短！${labelOf(e.to)} 距离更新为 ${dist[e.to]}`,
        );
      } else {
        emit(
          'relaxSkip',
          graph({ active: u, edgeClass: { [key]: 'relaxed' } }),
          vars(u, k),
          `不更短，跳过`,
        );
      }
    }
  }

  // 最短路树：每个非源点由 prev 连一条入树边
  const treeClass: Record<string, string> = {};
  for (let v = 0; v < n; v++) {
    if (prev[v] !== null) treeClass[`${prev[v]}-${v}`] = 'tree';
  }
  const pathToF = (() => {
    const path: string[] = [];
    let cur: number | null = 5;
    while (cur !== null) {
      path.unshift(labelOf(cur));
      cur = prev[cur];
    }
    return path.join('→');
  })();
  emit(
    'done',
    graph({ edgeClass: treeClass }),
    vars('-', n),
    `全部确定！最短路树（绿边）已定。${pathToF} 最短路长 ${dist[5]}`,
  );
  return steps;
}

export const dijkstraModule: AlgorithmModule<DijkstraExecPoint> = {
  title: 'Dijkstra 最短路',
  initialInput: () => [],
  buildSteps: () => buildDijkstraSteps(),
  sources: dijkstraSources,
};
