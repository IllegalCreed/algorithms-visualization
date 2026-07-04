import type {
  AlgorithmModule,
  HullExecPoint,
  HullTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { CH_POINTS, cross, convexHull } from './convexhull';
import { convexHullSources } from './convexhull.sources';

/** 固定 7 点凸包 Andrew 单调链逐点重走，产出点平面轨胖步骤（HullView）。
 *  init 散点 → lower 逐点构下凸壳（右转弹栈）→ upper 逐点构上凸壳 → done 拼成凸包多边形。 */
export function buildHullSteps(): Step<HullExecPoint>[] {
  const pts = CH_POINTS;
  const n = pts.length;
  const steps: Step<HullExecPoint>[] = [];
  const finalHull = convexHull();

  const pc = (i: number): string => `(${pts[i].x},${pts[i].y})`;
  const chainEdges = (chain: number[]): [number, number][] =>
    chain.slice(1).map((v, i) => [chain[i], v] as [number, number]);

  const emit = (
    point: HullExecPoint,
    hull: HullTrack,
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const vars: VarRow[] = [
      { name: '点数', value: `${n}` },
      {
        name: '阶段',
        value: hull.phase === 'lower' ? '下凸壳' : hull.phase === 'upper' ? '上凸壳' : '完成',
      },
      { name: '当前栈', value: hull.stack.length ? hull.stack.map(pc).join('→') : '空' },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, hull, caption });
  };

  const stepCaption = (label: string, i: number, popped: number[]): string =>
    popped.length
      ? `${label}：加入点 ${pc(i)} 时，栈顶到它是右转（叉积 ≤ 0），弹出 ${popped.map(pc).join('、')}；再压入 ${pc(i)}`
      : `${label}：加入点 ${pc(i)}，与栈顶是左转，直接压入`;

  emit(
    'init',
    { points: pts, edges: [], stack: [], phase: 'lower' },
    `平面上 ${n} 个点（已按 (x,y) 排序）。要用最紧的凸多边形套住它们——先从左到右构「下凸壳」，靠叉积判转向`,
  );

  const idx = Array.from({ length: n }, (_, i) => i);

  // 下凸壳
  const lower: number[] = [];
  for (const i of idx) {
    const popped: number[] = [];
    while (
      lower.length >= 2 &&
      cross(pts[lower[lower.length - 2]], pts[lower[lower.length - 1]], pts[i]) <= 0
    ) {
      popped.push(lower.pop() as number);
    }
    lower.push(i);
    emit(
      'lower',
      {
        points: pts,
        edges: chainEdges(lower),
        stack: [...lower],
        current: i,
        popped,
        phase: 'lower',
      },
      stepCaption('下凸壳', i, popped),
    );
  }
  const lowerEdges = chainEdges(lower);

  // 上凸壳
  const upper: number[] = [];
  for (const i of [...idx].reverse()) {
    const popped: number[] = [];
    while (
      upper.length >= 2 &&
      cross(pts[upper[upper.length - 2]], pts[upper[upper.length - 1]], pts[i]) <= 0
    ) {
      popped.push(upper.pop() as number);
    }
    upper.push(i);
    emit(
      'upper',
      {
        points: pts,
        edges: [...lowerEdges, ...chainEdges(upper)],
        stack: [...upper],
        current: i,
        popped,
        phase: 'upper',
      },
      stepCaption('上凸壳', i, popped),
    );
  }

  emit(
    'done',
    { points: pts, edges: [], stack: finalHull, phase: 'done', finalHull },
    `下凸壳 + 上凸壳拼成完整凸包：${finalHull.length} 个顶点连成闭合多边形；内部点 (3,3) 被排除在外`,
    [{ name: '凸包顶点数', value: `${finalHull.length}` }],
  );
  return steps;
}

export const convexHullModule: AlgorithmModule<HullExecPoint> = {
  title: '凸包（Convex Hull）',
  initialInput: () => [],
  buildSteps: () => buildHullSteps(),
  sources: convexHullSources,
};
