import type {
  AlgorithmModule,
  GraphTrack,
  MaxFlowExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { MF_S, MF_T, MF_VERTS, MF_EDGES, maxFlow } from './maxflow';
import { maxFlowSources } from './maxflow.sources';

const EKEY = (u: number, v: number): string => `${u}-${v}`;

/** 固定 4 节点 5 边最大流 Ford-Fulkerson 逐轮重走，产出图轨胖步骤（复用 GraphView）。
 *  init 全 0/cap → 每轮 find（高亮增广路，反向段红）+ augment（更新流量标签，反向边退流）→ done 最大流=最小割。 */
export function buildMaxFlowSteps(): Step<MaxFlowExecPoint>[] {
  const { value, rounds, cutEdges } = maxFlow();
  const steps: Step<MaxFlowExecPoint>[] = [];

  const edges = MF_EDGES.map((e) => ({ key: EKEY(e.from, e.to), from: e.from, to: e.to }));
  const capOf: Record<string, number> = {};
  const flow: Record<string, number> = {};
  for (const e of MF_EDGES) {
    capOf[EKEY(e.from, e.to)] = e.cap;
    flow[EKEY(e.from, e.to)] = 0;
  }
  const isOrig = (u: number, v: number): boolean => capOf[EKEY(u, v)] !== undefined;
  const name = (id: number): string => MF_VERTS[id].label;

  const nodeBadge: (string | null)[] = new Array<string | null>(MF_VERTS.length).fill(null);
  nodeBadge[MF_S] = '源';
  nodeBadge[MF_T] = '汇';

  const edgeLabelOf = (): Record<string, string> => {
    const m: Record<string, string> = {};
    for (const e of MF_EDGES) {
      const k = EKEY(e.from, e.to);
      m[k] = `${flow[k]}/${e.cap}`;
    }
    return m;
  };

  let total = 0;
  const emit = (
    point: MaxFlowExecPoint,
    edgeClass: Record<string, string>,
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const graph: GraphTrack = {
      vertices: MF_VERTS,
      edges,
      directed: true,
      nodeBadge: [...nodeBadge],
      edgeLabel: edgeLabelOf(),
      edgeClass,
    };
    const vars: VarRow[] = [
      { name: '源 → 汇', value: `${name(MF_S)} → ${name(MF_T)}` },
      { name: '当前流量', value: `${total} / 最大 ${value}` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, graph, caption });
  };

  emit(
    'init',
    {},
    `网络：源 ${name(MF_S)}、汇 ${name(MF_T)}，每条边标「流量/容量」（初始全 0）。反复在残量网络找增广路、推满瓶颈，直到再也找不到`,
  );

  rounds.forEach((r, ri) => {
    const pathStr = r.path.map(name).join('→');
    const hasRev = r.reverse.length > 0;
    // find：高亮增广路，正向 current、反向 reverse
    const ecFind: Record<string, string> = {};
    for (let i = 0; i + 1 < r.path.length; i++) {
      const u = r.path[i];
      const v = r.path[i + 1];
      if (isOrig(u, v)) ecFind[EKEY(u, v)] = 'current';
      else ecFind[EKEY(v, u)] = 'reverse'; // 反向经过原边 v→u
    }
    emit(
      'find',
      ecFind,
      `第 ${ri + 1} 轮：找到增广路 ${pathStr}，瓶颈 = ${r.bottleneck}${hasRev ? `（反向经过 ${name(r.reverse[0][0])}→${name(r.reverse[0][1])}：把之前误走的流退回、改道）` : ''}`,
      [{ name: '本轮增广路', value: `${pathStr}（瓶颈 ${r.bottleneck}）` }],
    );
    // augment：沿路更新流量
    for (let i = 0; i + 1 < r.path.length; i++) {
      const u = r.path[i];
      const v = r.path[i + 1];
      if (isOrig(u, v)) flow[EKEY(u, v)] += r.bottleneck;
      else flow[EKEY(v, u)] -= r.bottleneck; // 反向边：原边流量退回
    }
    total += r.bottleneck;
    emit(
      'augment',
      ecFind,
      `沿路径增流 ${r.bottleneck}${hasRev ? `，${name(r.reverse[0][1])}→${name(r.reverse[0][0])} 流量退回 ${r.bottleneck}` : ''}；累计总流量 ${total}`,
      [{ name: '已增广', value: `${ri + 1} / ${rounds.length} 轮` }],
    );
  });

  // done：最小割高亮
  const ecCut: Record<string, string> = {};
  for (const [u, v] of cutEdges) ecCut[EKEY(u, v)] = 'current';
  const cutStr = cutEdges.map(([u, v]) => `${name(u)}→${name(v)}`).join(' + ');
  emit(
    'done',
    ecCut,
    `再无增广路 → 最大流 = ${value}；最小割把 {${'s'}} 与 {a,b,t} 分开，割断 ${cutStr} = ${value}（最大流 = 最小割）`,
    [{ name: '最大流', value: `${value}` }],
  );
  return steps;
}

export const maxFlowModule: AlgorithmModule<MaxFlowExecPoint> = {
  title: '最大流（Ford-Fulkerson）',
  initialInput: () => [],
  buildSteps: () => buildMaxFlowSteps(),
  sources: maxFlowSources,
};
