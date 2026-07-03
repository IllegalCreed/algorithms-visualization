import type {
  AlgorithmModule,
  GraphTrack,
  Step,
  TopoExecPoint,
  VarRow,
} from '@/components/player/types';
import { TOPO_VERTICES, TOPO_EDGES } from './topo';
import { topoSources } from './topo.sources';

/** 固定非平凡 DAG，Kahn 算法细粒度重走（取入度 0 最小下标输出、后继减度），产出图轨胖步骤 */
export function buildTopoSteps(): Step<TopoExecPoint>[] {
  const V = TOPO_VERTICES;
  const n = V.length;
  const edges = TOPO_EDGES.map((e) => ({ key: e.key, from: e.from, to: e.to }));
  const labelOf = (i: number) => V[i].label;

  const indeg = Array.from({ length: n }, () => 0);
  for (const e of edges) indeg[e.to]++;
  const removed = Array.from({ length: n }, () => false);
  const order: number[] = [];

  const steps: Step<TopoExecPoint>[] = [];
  const badge = () => indeg.map((d) => String(d));
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
  const vars = (u: number | string): VarRow[] => [
    { name: '当前点', value: typeof u === 'number' && u >= 0 ? labelOf(u) : '-' },
    { name: '已输出', value: order.map(labelOf).join(' ') || '-' },
    { name: '剩余', value: n - order.length },
    ...V.map((v) => ({ name: `入度[${v.label}]`, value: indeg[v.id] })),
  ];
  const emit = (point: TopoExecPoint, g: GraphTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, graph: g, caption });
  };

  emit('init', graph({}), vars('-'), `先数每个点的入度（指向它的边数）`);

  while (order.length < n) {
    // 取入度 0 且下标最小的点
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!removed[i] && indeg[i] === 0) {
        u = i;
        break;
      }
    }
    if (u === -1) break; // 有环（本固定图无环）
    emit(
      'selectNode',
      graph({ active: u }),
      vars(u),
      `${labelOf(u)} 入度为 0，可以输出（并列时取最小下标）`,
    );
    removed[u] = true;
    order.push(u);
    const outClass: Record<string, string> = {};
    for (const e of edges) {
      if (e.from === u) {
        indeg[e.to]--;
        outClass[e.key] = 'current';
      }
    }
    emit(
      'removeNode',
      graph({ active: u, edgeClass: outClass }),
      vars(u),
      `输出 ${labelOf(u)}；它的后继入度各减 1`,
    );
  }

  emit('done', graph({}), vars('-'), `全部输出，拓扑序：${order.map(labelOf).join(' → ')}`);
  return steps;
}

export const topoModule: AlgorithmModule<TopoExecPoint> = {
  title: '拓扑排序',
  initialInput: () => [],
  buildSteps: () => buildTopoSteps(),
  sources: topoSources,
};
