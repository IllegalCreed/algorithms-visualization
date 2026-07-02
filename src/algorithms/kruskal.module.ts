import type {
  AlgorithmModule,
  GraphTrack,
  KruskalExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { useKruskal } from '@/components/structures/useKruskal';
import { kruskalSources } from './kruskal.sources';

/** 复用 useKruskal 固定无向带权图（边按权升序）+ 并查集，细粒度重走 Kruskal，产出图轨胖步骤 */
export function buildKruskalSteps(): Step<KruskalExecPoint>[] {
  const kru = useKruskal();
  const V = kru.vertices;
  const n = V.length;
  const E = kru.edges; // 已按权升序
  const edges = E.map((e) => ({ key: e.id, from: e.u, to: e.v, w: e.w }));
  const labelOf = (i: number) => V[i].label;

  const parent = V.map((v) => v.id);
  const find = (x: number): number => {
    while (parent[x] !== x) x = parent[x];
    return x;
  };

  const mst: string[] = [];
  const rejected: string[] = [];
  const doneNodes = new Set<number>();
  let weight = 0;

  const steps: Step<KruskalExecPoint>[] = [];
  const edgeClassOf = (currentId?: string): Record<string, string> => {
    const cls: Record<string, string> = {};
    for (const id of mst) cls[id] = 'mst';
    for (const id of rejected) cls[id] = 'rejected';
    if (currentId) cls[currentId] = 'current';
    return cls;
  };
  const graph = (currentId?: string): GraphTrack => ({
    vertices: V.map((v) => ({ id: v.id, label: v.label, x: v.x, y: v.y })),
    edges,
    directed: false,
    doneNodes: [...doneNodes],
    edgeClass: edgeClassOf(currentId),
  });
  const vars = (cur: (typeof edges)[number] | null): VarRow[] => [
    { name: '边数 E', value: edges.length },
    { name: '当前边', value: cur ? `${cur.key}（w=${cur.w}）` : '-' },
    { name: 'MST 边数', value: `${mst.length}/${n - 1}` },
    { name: 'MST 权重', value: weight },
    { name: '成环跳过', value: rejected.length },
  ];
  const emit = (
    point: KruskalExecPoint,
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

  emit('init', undefined, vars(null), `9 条边按权从小到大排好；MST 空、每个点自成一组`);

  for (const e of edges) {
    emit(
      'consider',
      e.key,
      vars(e),
      `考虑最短边 ${e.key}（权 ${e.w}）：查 ${labelOf(e.from)} 与 ${labelOf(e.to)} 是否已连通`,
    );
    const ru = find(e.from);
    const rv = find(e.to);
    if (ru !== rv) {
      parent[ru] = rv; // union
      mst.push(e.key);
      weight += e.w;
      doneNodes.add(e.from);
      doneNodes.add(e.to);
      emit(
        'accept',
        undefined,
        vars(e),
        `未连通——加入 MST，${labelOf(e.from)}、${labelOf(e.to)} 并为一组（权重 +${e.w}=${weight}）`,
      );
    } else {
      rejected.push(e.key);
      emit('reject', undefined, vars(e), `已连通——加入会成环，跳过`);
    }
  }

  emit(
    'done',
    undefined,
    vars(null),
    `选够 ${mst.length} 条边（V−1）：最小生成树完成，总权 ${weight}`,
  );
  return steps;
}

export const kruskalModule: AlgorithmModule<KruskalExecPoint> = {
  title: 'Kruskal 最小生成树',
  initialInput: () => [],
  buildSteps: () => buildKruskalSteps(),
  sources: kruskalSources,
};
