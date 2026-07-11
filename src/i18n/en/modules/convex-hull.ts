import type { AlgorithmModule, HullExecPoint, Step, VarRow } from '@/components/player/types';
import { convexHullModule } from '@/algorithms/convexhull.module';
import { translateSources } from '../shared';

function hullCoordinate(step: Step<HullExecPoint>, index: number): string {
  const point = step.hull!.points[index];
  return `(${point.x},${point.y})`;
}

function localizeHullStep(step: Step<HullExecPoint>): Step<HullExecPoint> {
  const hull = step.hull!;
  const phase =
    hull.phase === 'lower' ? 'Lower hull' : hull.phase === 'upper' ? 'Upper hull' : 'Done';
  const stack = hull.stack.length
    ? hull.stack.map((index) => hullCoordinate(step, index)).join(' -> ')
    : 'Empty';
  const vars: VarRow[] = [
    { name: 'Points', value: `${hull.points.length}` },
    { name: 'Phase', value: phase },
    { name: 'Stack', value: stack },
  ];

  if (step.point === 'init') {
    return {
      ...step,
      vars,
      caption:
        'Sort the points by (x, y), then scan left to right to build the lower hull with cross-product turn tests.',
    };
  }

  if (step.point === 'done') {
    return {
      ...step,
      vars: [...vars, { name: 'Hull vertices', value: `${hull.finalHull?.length ?? 0}` }],
      caption: `The lower and upper chains form a closed convex polygon with ${hull.finalHull?.length ?? 0} vertices.`,
    };
  }

  const label = step.point === 'lower' ? 'Lower hull' : 'Upper hull';
  const current = hullCoordinate(step, hull.current!);
  const popped = hull.popped ?? [];
  return {
    ...step,
    vars,
    caption: popped.length
      ? `${label}: adding ${current} creates a non-left turn, so pop ${popped.map((index) => hullCoordinate(step, index)).join(', ')} before pushing it.`
      : `${label}: adding ${current} keeps a left turn, so push it directly.`,
  };
}

export const englishConvexHullModule: AlgorithmModule<HullExecPoint> = {
  ...convexHullModule,
  title: 'Convex Hull',
  buildSteps: (input) => convexHullModule.buildSteps(input).map(localizeHullStep),
  sources: translateSources(convexHullModule.sources),
};
