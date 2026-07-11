import type {
  AlgorithmModule,
  ClosestPairExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { closestPairModule } from '@/algorithms/closestpair.module';
import { translateSources, valueOf } from '../shared';

const CLOSEST_PAIR_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['只比 y 差 < δ 的近邻', 'compare neighbors with y-gap < delta'],
  ['只比近邻', 'compare nearby points'],
  ['δ 带内按 y 排序', 'sort the delta strip by y'],
  ['跨带可能刷新', 'a cross-strip pair may improve d'],
  ['pts 已按 x 排序', 'pts sorted by x'],
  ['左半递归', 'recurse on the left half'],
  ['右半递归', 'recurse on the right half'],
  ['跨带刷新', 'update across the strip'],
  ['中线', 'midline'],
  ['近邻', 'nearby points'],
];

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '');
}

function coordinate(step: Step<ClosestPairExecPoint>, index: number): string {
  const point = step.hull!.points[index];
  return `(${formatNumber(point.x)}, ${formatNumber(point.y)})`;
}

function pairText(
  step: Step<ClosestPairExecPoint>,
  pair: [number, number] | null | undefined,
): string {
  return pair ? `${coordinate(step, pair[0])} <-> ${coordinate(step, pair[1])}` : '-';
}

function pairDistance(
  step: Step<ClosestPairExecPoint>,
  pair: [number, number] | null | undefined,
): string {
  if (!pair) return '-';
  const left = step.hull!.points[pair[0]];
  const right = step.hull!.points[pair[1]];
  return formatNumber(Math.hypot(left.x - right.x, left.y - right.y));
}

function localizeClosestPairVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    点数: 'Points',
    当前最近: 'Best distance',
    左半最近: 'Left-half best',
    δ: 'delta',
    带内点: 'Strip points',
    最近距离: 'Closest distance',
  };
  return vars.map((row) => ({ name: labels[row.name] ?? row.name, value: row.value }));
}

function localizeClosestPairStep(step: Step<ClosestPairExecPoint>): Step<ClosestPairExecPoint> {
  const hull = step.hull!;
  const best = pairText(step, hull.best);
  const bestDistance = pairDistance(step, hull.best);
  const isLeftHalf = step.vars.some((row) => row.name === '左半最近');
  const captions: Record<ClosestPairExecPoint, () => string> = {
    init: () =>
      `Plot ${valueOf(step, '点数')} points sorted by x; divide and conquer will improve on the O(n^2) pair scan.`,
    divide: () =>
      `Split the points at midline x=${formatNumber(hull.divider ?? 0)} and solve the two halves independently.`,
    half: () =>
      isLeftHalf
        ? `The left half establishes ${best} as its closest pair, at distance ${bestDistance}.`
        : `After both halves are solved, keep ${best} with distance ${bestDistance} as delta.`,
    strip: () =>
      `A closer cross-boundary pair must lie inside x=[${formatNumber(hull.strip?.[0] ?? 0)}, ${formatNumber(hull.strip?.[1] ?? 0)}]; sort the ${valueOf(step, '带内点')} strip points by y.`,
    merge: () => {
      const candidate = pairText(step, hull.caliper);
      const distance = pairDistance(step, hull.caliper);
      const improved = candidate === best;
      return `Compare strip pair ${candidate} at distance ${distance}; ${improved ? 'it becomes the new best pair.' : 'the current best remains unchanged.'}`;
    },
    done: () => `The closest pair is ${best}, with distance ${bestDistance}.`,
  };

  return {
    ...step,
    vars: localizeClosestPairVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishClosestPairModule: AlgorithmModule<ClosestPairExecPoint> = {
  ...closestPairModule,
  title: 'Closest Pair of Points',
  buildSteps: (input) => closestPairModule.buildSteps(input).map(localizeClosestPairStep),
  sources: translateSources(closestPairModule.sources, CLOSEST_PAIR_SOURCE_REPLACEMENTS),
};
