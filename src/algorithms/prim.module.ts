import type {
  AlgorithmModule,
  GraphTrack,
  PrimExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { useKruskal } from '@/components/structures/useKruskal';
import { primSources } from './prim.sources';

/** 复用 useKruskal 固定无向带权图，从起点 A 生长（每轮选最小横切边），产出图轨胖步骤 */
export function buildPrimSteps(start = 0): Step<PrimExecPoint>[] {
  const kru = useKruskal();
  const V = kru.vertices;
  const n = V.length;
  const E = kru.edges;
  const edges = E.map((e) => ({ key: e.id, from: e.u, to: e.v, w: e.w }));
  const labelOf = (i: number) => V[i].label;

  const inTree = new Set<number>([start]);
  const treeEdges: string[] = [];
  let weight = 0;

  const steps: Step<PrimExecPoint>[] = [];
  const edgeClassOf = (currentId?: string): Record<string, string> => {
    const cls: Record<string, string> = {};
    for (const id of treeEdges) cls[id] = 'mst';
    if (currentId) cls[currentId] = 'current';
    return cls;
  };
  const graph = (currentId?: string): GraphTrack => ({
    vertices: V.map((v) => ({ id: v.id, label: v.label, x: v.x, y: v.y })),
    edges,
    directed: false,
    doneNodes: [...inTree],
    edgeClass: edgeClassOf(currentId),
  });
  const vars = (cur: (typeof edges)[number] | null): VarRow[] => [
    { name: '起点', value: labelOf(start) },
    { name: '树内点', value: [...inTree].map(labelOf).join(' ') },
    { name: '当前横切边', value: cur ? `${cur.key}（w=${cur.w}）` : '-' },
    { name: '已选边', value: `${treeEdges.length}/${n - 1}` },
    { name: 'MST 权重', value: weight },
  ];
  const emit = (
    point: PrimExecPoint,
    currentId: string | undefined,
    v: VarRow[],
    caption: string,
  ) => {
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: v,
      point,
      graph: graph(currentId),
      caption,
    });
  };

  emit('init', undefined, vars(null), `从起点 ${labelOf(start)} 开始，树里只有它一个点`);

  while (inTree.size < n) {
    // 找权最小的横切边（一端在树、一端在树外）
    let best: (typeof edges)[number] | null = null;
    for (const e of edges) {
      const crossing = inTree.has(e.from) !== inTree.has(e.to);
      if (crossing && (!best || e.w < best.w)) best = e;
    }
    if (!best) break; // 图不连通（本固定图连通）
    const outside = inTree.has(best.from) ? best.to : best.from;
    emit(
      'selectEdge',
      best.key,
      vars(best),
      `树的横切边里选权最小：${best.key}（w=${best.w}）——把树外的 ${labelOf(outside)} 拉进来`,
    );
    inTree.add(outside);
    treeEdges.push(best.key);
    weight += best.w;
    emit(
      'addVertex',
      undefined,
      vars(best),
      `加入 ${labelOf(outside)} 与树边 ${best.key}（权重 +${best.w}=${weight}）`,
    );
  }

  emit(
    'done',
    undefined,
    vars(null),
    `选够 ${treeEdges.length} 条边（V−1）：最小生成树完成，总权 ${weight}`,
  );
  return steps;
}

export const primModule: AlgorithmModule<PrimExecPoint> = {
  title: 'Prim 最小生成树',
  initialInput: () => [],
  buildSteps: () => buildPrimSteps(),
  sources: primSources,
};
