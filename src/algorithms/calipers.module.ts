import type {
  AlgorithmModule,
  CalipersExecPoint,
  HullTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { CH_POINTS, cross, convexHull } from './convexhull';
import { diameter, dist2 } from './calipers';
import { calipersSources } from './calipers.sources';

/** 固定 C-081 凸包上旋转卡壳逐边重走，产出点平面轨胖步骤（复用 HullView + 三连线字段）。
 *  每条凸包边一步：对踵点按面积单调前移，检查边两端与对踵点两个候选距离，best 累积。 */
export function buildCalipersSteps(): Step<CalipersExecPoint>[] {
  const pts = CH_POINTS;
  const hull = convexHull();
  const m = hull.length;
  const steps: Step<CalipersExecPoint>[] = [];
  const { d2: finalD2, pair: finalPair } = diameter();

  const pc = (i: number): string => `(${pts[i].x},${pts[i].y})`;
  const area2 = (a: number, b: number, c: number): number =>
    Math.abs(cross(pts[a], pts[b], pts[c]));

  const emit = (
    point: CalipersExecPoint,
    o: {
      activeEdge?: [number, number] | null;
      caliper?: [number, number] | null;
      best?: [number, number] | null;
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const hullTrack: HullTrack = {
      points: pts,
      edges: [],
      stack: hull,
      phase: 'done',
      finalHull: hull,
      activeEdge: o.activeEdge ?? null,
      caliper: o.caliper ?? null,
      best: o.best ?? null,
    };
    const vars: VarRow[] = [
      { name: '凸包顶点', value: `${m}` },
      { name: '当前最远²', value: o.best ? `${dist2(o.best[0], o.best[1])}` : '-' },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, hull: hullTrack, caption });
  };

  emit(
    'init',
    {},
    `在凸包上找最远点对（直径）：像两块平行卡板夹住凸包旋转——对每条边，离它最远的「对踵点」只会单调前移`,
  );

  let j = 1;
  let bestD2 = 0;
  let best: [number, number] | null = null;
  for (let i = 0; i < m; i++) {
    const ni = (i + 1) % m;
    let advanced = 0;
    while (area2(hull[i], hull[ni], hull[(j + 1) % m]) > area2(hull[i], hull[ni], hull[j])) {
      j = (j + 1) % m;
      advanced++;
    }
    // 两候选：边两端 ↔ 对踵点，取更远者作本步 caliper 展示
    let caliper: [number, number] = [hull[i], hull[j]];
    let updated = false;
    for (const cand of [hull[i], hull[ni]]) {
      const d = dist2(cand, hull[j]);
      if (d > dist2(caliper[0], caliper[1])) caliper = [cand, hull[j]];
      if (d > bestD2) {
        bestD2 = d;
        best = [cand, hull[j]];
        updated = true;
      }
    }
    emit(
      'spin',
      { activeEdge: [hull[i], hull[ni]], caliper, best },
      `边 ${pc(hull[i])}→${pc(hull[ni])}：${advanced ? `对踵点前移 ${advanced} 次到 ${pc(hull[j])}（面积更大=更远）；` : `对踵点仍是 ${pc(hull[j])}；`}候选 |${pc(hull[i])}-${pc(hull[j])}|²=${dist2(hull[i], hull[j])}、|${pc(hull[ni])}-${pc(hull[j])}|²=${dist2(hull[ni], hull[j])}${updated ? ` → 刷新最远 ${bestD2}` : ''}`,
      [{ name: '对踵点', value: pc(hull[j]) }],
    );
  }

  emit(
    'done',
    { best: finalPair },
    `转完一圈：最远点对 ${pc(finalPair[0])}↔${pc(finalPair[1])}，直径² = ${finalD2}，直径 = ${Math.sqrt(finalD2)}（每条边只查两候选，整圈 O(n)）`,
    [{ name: '直径', value: `${Math.sqrt(finalD2)}` }],
  );
  return steps;
}

export const calipersModule: AlgorithmModule<CalipersExecPoint> = {
  title: '旋转卡壳（凸包直径）',
  initialInput: () => [],
  buildSteps: () => buildCalipersSteps(),
  sources: calipersSources,
};
