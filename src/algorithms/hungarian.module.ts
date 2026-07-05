import type {
  AlgorithmModule,
  GraphTrack,
  HungarianExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { HG_N, hungarianTrace, bruteMaxMatching } from './hungarian';
import { hungarianSources } from './hungarian.sources';

// 左 L1-L3 = id 0-2（x=120），右 R1-R3 = id 3-5（x=340）
const VERTS = [
  { id: 0, label: 'L1', x: 120, y: 60 },
  { id: 1, label: 'L2', x: 120, y: 150 },
  { id: 2, label: 'L3', x: 120, y: 240 },
  { id: 3, label: 'R1', x: 340, y: 60 },
  { id: 4, label: 'R2', x: 340, y: 150 },
  { id: 5, label: 'R3', x: 340, y: 240 },
];
const EDGES = [
  { key: '0-3', from: 0, to: 3 },
  { key: '0-4', from: 0, to: 4 },
  { key: '1-3', from: 1, to: 3 },
  { key: '2-4', from: 2, to: 4 },
  { key: '2-5', from: 2, to: 5 },
];
const L = (u: number): string => `L${u + 1}`;
const R = (v: number): string => `R${v + 1}`;
const edgeKey = (u: number, v: number): string => `${u}-${v + 3}`;

/** 固定二分图匈牙利算法事件流重放，产出图轨胖步骤（纯复用 GraphView）。
 *  round 融入首个 try；连续 match（增广翻转）合并一步；fail 死路链 rejected。 */
export function buildHungarianSteps(): Step<HungarianExecPoint>[] {
  const { events, count } = hungarianTrace();
  const brute = bruteMaxMatching();
  const steps: Step<HungarianExecPoint>[] = [];

  const emit = (
    point: HungarianExecPoint,
    o: {
      matchR: number[];
      extraClass?: Record<string, string>;
      active?: number | null;
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const edgeClass: Record<string, string> = {};
    o.matchR.forEach((u, v) => {
      if (u >= 0) edgeClass[edgeKey(u, v)] = 'mst';
    });
    Object.assign(edgeClass, o.extraClass ?? {});
    const doneNodes: number[] = [];
    const nodeBadge: (string | null)[] = new Array(6).fill(null);
    o.matchR.forEach((u, v) => {
      if (u >= 0) {
        doneNodes.push(u, v + 3);
        nodeBadge[v + 3] = `←${L(u)}`;
      }
    });
    const graph: GraphTrack = {
      vertices: VERTS,
      edges: EDGES,
      directed: false,
      nodeBadge,
      activeNode: o.active ?? null,
      doneNodes,
      edgeClass,
    };
    const matched = o.matchR.filter((u) => u >= 0).length;
    const vars: VarRow[] = [
      { name: '匹配数', value: `${matched}` },
      {
        name: '配对',
        value:
          o.matchR
            .map((u, v) => (u >= 0 ? `${R(v)}←${L(u)}` : null))
            .filter(Boolean)
            .join('、') || '—',
      },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, graph, caption });
  };

  emit(
    'init',
    { matchR: new Array(HG_N).fill(-1) },
    `左边 3 位工人、右边 3 个岗位，连线表示「能干」。匈牙利算法逐个工人找岗位：空闲就定下；被占了就问占用者「能不能让路」——递归给它找别的，让开就整条翻转`,
  );

  let i = 0;
  let roundU: number | null = null;
  while (i < events.length) {
    const e = events[i];
    if (e.type === 'round') {
      roundU = e.u;
      i++;
      continue;
    }
    if (e.type === 'try') {
      const opening = roundU !== null ? `为 ${L(roundU)} 找岗位：` : '';
      roundU = null;
      const free = e.note === 'free';
      const taker = free ? -1 : Number(e.note!.split(' ').pop());
      emit(
        'try',
        {
          matchR: e.matchR,
          extraClass: { [edgeKey(e.u, e.v!)]: 'current' },
          active: e.u,
        },
        free
          ? `${opening}${L(e.u)} 试探 ${R(e.v!)}——空闲！直接定下`
          : `${opening}${L(e.u)} 试探 ${R(e.v!)}——已被 ${L(taker)} 占用，问 ${L(taker)} 能不能让路（递归给它找别的岗位）`,
        [{ name: '试探', value: `${L(e.u)} → ${R(e.v!)}` }],
      );
      i++;
      continue;
    }
    if (e.type === 'match') {
      // 连续 match = 一条增广路整体翻转，合并为一步
      const flips: { u: number; v: number }[] = [];
      let last = e;
      while (i < events.length && events[i].type === 'match') {
        last = events[i] as typeof e;
        flips.push({ u: events[i].u, v: events[i].v! });
        i++;
      }
      const isAugment = flips.length > 1;
      emit(
        'match',
        { matchR: last.matchR, active: flips[flips.length - 1].u },
        isAugment
          ? `增广成功！路径整条翻转：${flips.map((f) => `${L(f.u)}—${R(f.v)}`).join('、')} 同时定亲——一让一定，匹配数 +1`
          : `${L(flips[0].u)} 与 ${R(flips[0].v)} 定亲（绿边），匹配数 +1`,
      );
      continue;
    }
    if (e.type === 'fail') {
      // 连续 fail = 整条递归链死路，合并为一步
      const chain: number[] = [];
      while (i < events.length && events[i].type === 'fail') {
        chain.push(events[i].u);
        i++;
      }
      const rejected: Record<string, string> = {};
      for (const u of chain) {
        for (const v of [0, 1, 2]) {
          const k = edgeKey(u, v);
          if (EDGES.some((ed) => ed.key === k) && e.matchR[v] !== u) rejected[k] = 'rejected';
        }
      }
      emit(
        'fail',
        { matchR: events[i - 1].matchR, extraClass: rejected, active: chain[0] },
        `死路：${chain.map(L).join(' 和 ')} 都腾不出岗位——这条让路链整体回退，换下一个候选`,
      );
      continue;
    }
    i++;
  }

  emit(
    'done',
    { matchR: hungarianTrace().matchR },
    `最大匹配 = ${count}（暴力枚举同为 ${brute}）。匈牙利 O(V·E)；它是单位容量最大流的组合特例，König 定理还说：二分图里最大匹配 = 最小点覆盖。任务指派、宿舍分配都是它`,
    [{ name: '复杂度', value: 'O(V·E)' }],
  );
  return steps;
}

export const hungarianModule: AlgorithmModule<HungarianExecPoint> = {
  title: '二分图匹配（匈牙利算法）',
  initialInput: () => [],
  buildSteps: () => buildHungarianSteps(),
  sources: hungarianSources,
};
