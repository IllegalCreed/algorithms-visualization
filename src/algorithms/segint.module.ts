import type {
  AlgorithmModule,
  HullTrack,
  SegIntExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { SI_POINTS, SI_PAIRS, segIntersect } from './segint';
import { segIntSources } from './segint.sources';

const fmt = (x: number): string =>
  Number.isInteger(x) ? `${x}` : x.toFixed(1).replace(/\.0$/, '');

/** 三对固定线段跨立试验逐对重走，产出点平面轨胖步骤（复用 HullView + edgeClasses）。
 *  init 全灰 → 每对 test（琥珀 + 四叉积）+ verdict（相交绿/不相交灰虚线，颜色累积）→ done 汇总。 */
export function buildSegIntSteps(): Step<SegIntExecPoint>[] {
  const pts = SI_POINTS;
  const edges: [number, number][] = SI_PAIRS.flat() as [number, number][];
  const steps: Step<SegIntExecPoint>[] = [];
  const classes: (string | null)[] = new Array(edges.length).fill(null);

  const emit = (point: SegIntExecPoint, caption: string, extra: VarRow[] = []): void => {
    const hull: HullTrack = {
      points: pts,
      edges,
      stack: [],
      phase: 'lower',
      edgeClasses: [...classes],
    };
    const vars: VarRow[] = [{ name: '线段对', value: `${SI_PAIRS.length}` }, ...extra];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, hull, caption });
  };

  emit(
    'init',
    `三对线段，逐对判断是否相交。工具还是叉积：看两端点分别落在对方直线的哪一侧（跨立试验），全程只用乘法和比较`,
  );

  const kinds: string[] = [];
  SI_PAIRS.forEach((pair, k) => {
    const [e1, e2] = pair;
    const [a, b] = [pts[e1[0]], pts[e1[1]]];
    const [c, d] = [pts[e2[0]], pts[e2[1]]];
    const r = segIntersect(a, b, c, d);
    kinds.push(r.kind);
    const i1 = 2 * k;
    const i2 = 2 * k + 1;

    classes[i1] = 'seg-test';
    classes[i2] = 'seg-test';
    emit(
      'test',
      `第 ${k + 1} 对：四个叉积 D1=${fmt(r.ds[0])}、D2=${fmt(r.ds[1])}（A、B 对直线 CD）；D3=${fmt(r.ds[2])}、D4=${fmt(r.ds[3])}（C、D 对直线 AB）`,
      [{ name: '当前对', value: `${k + 1} / 3` }],
    );

    const cls = r.hit ? 'seg-yes' : 'seg-no';
    classes[i1] = cls;
    classes[i2] = cls;
    const verdictTxt =
      r.kind === 'proper'
        ? `D1·D2 < 0 且 D3·D4 < 0：两两异号、互相跨立 → 规范相交`
        : r.kind === 'touch'
          ? `D3 = 0（端点共线）且该点落在对方线段的包围框内 → 端点相触，也算相交`
          : `D1、D2 同号：A、B 在直线 CD 同一侧，不可能跨过去 → 不相交`;
    emit('verdict', `第 ${k + 1} 对判定：${verdictTxt}`, [
      { name: '结论', value: r.hit ? '相交' : '不相交' },
    ]);
  });

  const hits = kinds.filter((k) => k !== 'none').length;
  emit(
    'done',
    `三对判完：${hits} 对相交（1 规范相交 + 1 端点相触）、${kinds.length - hits} 对不相交——四个叉积、零除法，这就是扫描线与碰撞检测的原子操作`,
    [{ name: '相交', value: `${hits} / ${kinds.length}` }],
  );
  return steps;
}

export const segIntModule: AlgorithmModule<SegIntExecPoint> = {
  title: '线段相交（跨立试验）',
  initialInput: () => [],
  buildSteps: () => buildSegIntSteps(),
  sources: segIntSources,
};
