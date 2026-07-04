import type {
  AlgorithmModule,
  BentleyExecPoint,
  HullTrack,
  Pt,
  Step,
  VarRow,
} from '@/components/player/types';
import { BO_POINTS, BO_SEGS, boEvents } from './bentley';
import { bentleySources } from './bentley.sources';

const fmt = (x: number): string =>
  Number.isInteger(x) ? `${x}` : x.toFixed(1).replace(/\.0$/, '');
const ptTxt = (p: Pt): string => `(${fmt(p.x)}, ${fmt(p.y)})`;

/** 固定三线段 Bentley-Ottmann 事件流逐个重放，产出点平面轨胖步骤（复用 HullView，
 *  additive marks/markActive 交点标记）。divider 当扫描线；edgeClasses 表在场/离场状态。 */
export function buildBentleySteps(): Step<BentleyExecPoint>[] {
  const events = boEvents();
  const steps: Step<BentleyExecPoint>[] = [];
  const marks: Pt[] = [];
  const started = new Set<number>();
  const ended = new Set<number>();

  const emit = (
    point: BentleyExecPoint,
    o: {
      divider?: number | null;
      classes: (string | null)[];
      markActive?: Pt | null;
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const hull: HullTrack = {
      points: BO_POINTS,
      edges: BO_SEGS.map((s) => [s.a, s.b]),
      stack: [],
      phase: 'lower',
      edgeClasses: [...o.classes],
      divider: o.divider ?? null,
      marks: [...marks],
      markActive: o.markActive ?? null,
    };
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: [{ name: '线段', value: 'A(1,1)-(9,9)、B(2,8)-(8,2)、C(2.5,6)-(8.5,6)' }, ...extra],
      point,
      hull,
      caption,
    });
  };

  // 默认类：未入场/已离场 seg-no，在场 null；再叠加本步主角
  const baseClasses = (): (string | null)[] =>
    BO_SEGS.map((_, i) => (started.has(i) && !ended.has(i) ? null : 'seg-no'));

  emit(
    'init',
    { classes: [null, null, null] },
    `3 条线段求所有交点。6 个端点事件按 x 排好队，一条竖直扫描线从左往右扫；交点事件在扫描中动态加入——两条线段相交前，必先在「状态结构」里相邻`,
    [{ name: '事件队列', value: '6 个端点事件（交点事件动态加入）' }],
  );

  const statusTxt = (arr: number[]): string =>
    arr.length ? arr.map((s) => BO_SEGS[s].name).join(' ‹ ') : '空';

  for (const e of events) {
    const extra: VarRow[] = [
      { name: '状态(下→上)', value: statusTxt(e.statusAfter) },
      { name: '已发现交点', value: `${marks.length + (e.type === 'cross' ? 1 : 0)}` },
    ];
    if (e.enqueued.length) {
      extra.push({ name: '新入队', value: e.enqueued.map(ptTxt).join('、') });
    }

    if (e.type === 'start') {
      started.add(e.seg!);
      const classes = baseClasses();
      classes[e.seg!] = 'seg-test';
      const name = BO_SEGS[e.seg!].name;
      const neighborNote = e.enqueued.length
        ? `检查新相邻对：${e.enqueued.map((p) => `交点 ${ptTxt(p)} 入队`).join('；')}`
        : e.statusAfter.length > 1
          ? '新相邻对的交点已在队中或不存在'
          : '状态里只有它，没有相邻对可查';
      emit(
        'start',
        { divider: e.x, classes },
        `扫描线到 x=${fmt(e.x)}：线段 ${name} 入场，插进状态结构（按 y 有序）→ ${statusTxt(e.statusAfter)}。${neighborNote}`,
        extra,
      );
    } else if (e.type === 'cross') {
      marks.push(e.pt!);
      const classes = baseClasses();
      classes[e.pair![0]] = 'seg-yes';
      classes[e.pair![1]] = 'seg-yes';
      const [i, j] = e.pair!;
      emit(
        'cross',
        { divider: e.x, classes, markActive: e.pt! },
        `x=${fmt(e.x)} 交点事件：${BO_SEGS[i].name} × ${BO_SEGS[j].name} 在 ${ptTxt(e.pt!)} 相交——报告第 ${marks.length} 个交点！两线段在状态结构中交换 → ${statusTxt(e.statusAfter)}，再查交换出的新相邻对`,
        extra,
      );
    } else {
      ended.add(e.seg!);
      const classes = baseClasses();
      const name = BO_SEGS[e.seg!].name;
      emit(
        'end',
        { divider: e.x, classes },
        `x=${fmt(e.x)}：线段 ${name} 到右端点、离开状态结构 → ${statusTxt(e.statusAfter)}。它原来的上下邻居若成新相邻对则补查一次`,
        extra,
      );
    }
  }

  emit(
    'done',
    { divider: 9, classes: [null, null, null] },
    `扫描完成：3 个交点 (4, 6)、(5, 5)、(6, 6) 一个不漏。事件驱动 + 只查相邻，O((n+k) log n)——n 条线段两两全查是 O(n²)，交点稀疏时扫描线快得多`,
    [{ name: '已发现交点', value: '3' }],
  );
  return steps;
}

export const bentleyModule: AlgorithmModule<BentleyExecPoint> = {
  title: '扫描线求交（Bentley-Ottmann）',
  initialInput: () => [],
  buildSteps: () => buildBentleySteps(),
  sources: bentleySources,
};
