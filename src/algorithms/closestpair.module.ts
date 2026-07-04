import type {
  AlgorithmModule,
  ClosestPairExecPoint,
  HullTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { CP_POINTS, bruteClosest, closestPair, dist } from './closestpair';
import { closestPairSources } from './closestpair.sources';

const fmt = (x: number): string =>
  Number.isInteger(x) ? `${x}` : x.toFixed(3).replace(/\.?0+$/, '');

/** 固定 8 点最近点对一层分治重走，产出点平面轨胖步骤（复用 HullView + divider/strip/caliper/best）。 */
export function buildClosestPairSteps(): Step<ClosestPairExecPoint>[] {
  const pts = CP_POINTS;
  const n = pts.length;
  const steps: Step<ClosestPairExecPoint>[] = [];
  const { midX } = closestPair();

  const pc = (i: number): string => `(${fmt(pts[i].x)},${fmt(pts[i].y)})`;

  const emit = (
    point: ClosestPairExecPoint,
    o: {
      divider?: number | null;
      strip?: [number, number] | null;
      caliper?: [number, number] | null;
      best?: [number, number] | null;
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const hull: HullTrack = {
      points: pts,
      edges: [],
      stack: [],
      phase: 'lower',
      divider: o.divider ?? null,
      strip: o.strip ?? null,
      caliper: o.caliper ?? null,
      best: o.best ?? null,
    };
    const vars: VarRow[] = [
      { name: '点数', value: `${n}` },
      { name: '当前最近', value: o.best ? fmt(dist(o.best[0], o.best[1])) : '-' },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, hull, caption });
  };

  emit(
    'init',
    {},
    `平面上 ${n} 个点（已按 x 排序），找距离最近的两个。暴力 O(n²)，分治能到 O(n log n)`,
  );

  emit(
    'divide',
    { divider: midX },
    `按 x 中位切一刀：中线 x = ${fmt(midX)}，左右各 ${n / 2} 个点，先各自求「半边内」的最近对`,
  );

  const left = bruteClosest([0, 1, 2, 3]);
  emit(
    'half',
    { divider: midX, best: left.pair },
    `左半最近：${pc(left.pair[0])}↔${pc(left.pair[1])}，距离 ${fmt(left.d)}`,
    [{ name: '左半最近', value: fmt(left.d) }],
  );

  const right = bruteClosest([4, 5, 6, 7]);
  let best = left.d < right.d ? left : right;
  const delta = best.d;
  emit(
    'half',
    { divider: midX, best: best.pair },
    `右半最近：${pc(right.pair[0])}↔${pc(right.pair[1])}，距离 ${fmt(right.d)}；取 δ = min(${fmt(left.d)}, ${fmt(right.d)}) = ${fmt(delta)}`,
    [{ name: 'δ', value: fmt(delta) }],
  );

  const stripRange: [number, number] = [midX - delta, midX + delta];
  const strip = Array.from({ length: n }, (_, i) => i)
    .filter((i) => Math.abs(pts[i].x - midX) < delta)
    .sort((a, b) => pts[a].y - pts[b].y);
  emit(
    'strip',
    { divider: midX, strip: stripRange, best: best.pair },
    `答案可能跨中线！只需检查中线两侧 δ 宽的带（|x−${fmt(midX)}| < ${fmt(delta)}）：带内 ${strip.length} 个点，按 y 排序、每点只和 y 差 < δ 的近邻比`,
    [{ name: '带内点', value: `${strip.length}` }],
  );

  for (let i = 0; i < strip.length; i++) {
    for (let j = i + 1; j < strip.length; j++) {
      if (pts[strip[j]].y - pts[strip[i]].y >= best.d) break;
      const dd = dist(strip[i], strip[j]);
      const upd = dd < best.d;
      if (upd) best = { d: dd, pair: [strip[i], strip[j]] };
      emit(
        'merge',
        { divider: midX, strip: stripRange, caliper: [strip[i], strip[j]], best: best.pair },
        `比较带内 ${pc(strip[i])}↔${pc(strip[j])}：距离 ${fmt(dd)}${upd ? ` < δ → 刷新最近对！` : `，不更近`}`,
      );
    }
  }

  emit(
    'done',
    { divider: midX, best: best.pair },
    `最近点对：${pc(best.pair[0])}↔${pc(best.pair[1])}，距离 ${fmt(best.d)}——恰好跨越中线，被 δ 带合并抓住（与暴力一致）`,
    [{ name: '最近距离', value: fmt(best.d) }],
  );
  return steps;
}

export const closestPairModule: AlgorithmModule<ClosestPairExecPoint> = {
  title: '最近点对（分治）',
  initialInput: () => [],
  buildSteps: () => buildClosestPairSteps(),
  sources: closestPairSources,
};
