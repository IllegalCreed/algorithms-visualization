import type { AlgorithmModule, BbExecPoint, Step, VarRow } from '@/components/player/types';
import { bboundModule } from '@/algorithms/bbound.module';
import { translateSources, valueOf } from '../shared';

const BOUND_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['半开区间边界模板', 'half-open boundary template'],
  ['半开区间', 'half-open range'],
  ['hi=n 哨兵', 'hi=n sentinel'],
  ['探针', 'probe'],
  ['太小：答案在右', 'too small: answer is on the right'],
  ['≥ t：mid 可能就是答案', '>= t: mid may be the answer'],
  ['相遇点 = 第一个 ≥ t', 'meeting point = first value >= t'],
  [
    'upperBound：把 < 换成 <=（等于也右走）→ 第一个 > t',
    'upperBound: replace < with <=, so equality also moves right; first value > t',
  ],
  [
    'upper_bound：把 < 换成 <=（等于也右走）→ 第一个 > t',
    'upper_bound: replace < with <=, so equality also moves right; first value > t',
  ],
  ['个数 = upperBound − lowerBound', 'count = upperBound - lowerBound'],
  ['个数 = upper_bound − lower_bound', 'count = upper_bound - lower_bound'],
];

function localizeBoundVars(vars: VarRow[]): VarRow[] {
  return vars.map((row) => {
    if (row.name === '阶段') return { name: 'Phase', value: row.value };
    if (row.name === '复杂度') return { name: 'Complexity', value: row.value };
    if (row.name === '[lo, hi)') {
      return {
        name: '[lo, hi)',
        value: String(row.value).replace('（hi=n 哨兵）', ' (hi=n sentinel)'),
      };
    }
    return { ...row };
  });
}

function localizeBinaryBoundsStep(step: Step<BbExecPoint>): Step<BbExecPoint> {
  const phase = String(valueOf(step, '阶段'));
  const target = valueOf(step, 'target');
  const interval = valueOf(step, '[lo, hi)');
  const mid = Number(valueOf(step, 'mid'));
  const probe = Number.isInteger(mid) ? step.array[mid]?.[1] : undefined;
  const lower = valueOf(step, 'lower');
  const upper = valueOf(step, 'upper');
  const count = valueOf(step, 'count');
  const captions: Record<BbExecPoint, () => string> = {
    init: () =>
      `${phase}: start with half-open range ${String(interval).replace('（hi=n 哨兵）', ' (hi=n sentinel)')} for target ${target}.`,
    probe: () =>
      `${phase}: probe mid=${mid}, value=${probe}; shrink the candidate range to ${interval}.`,
    settle: () => `${phase} settles where lo and hi meet: ${interval}.`,
    range: () =>
      `The equal range is [${lower}, ${upper}); it contains ${count} occurrence(s) of ${target}.`,
    done: () => 'Lower and upper bound use the same two-branch template, each in O(log n) time.',
  };

  return {
    ...step,
    vars: localizeBoundVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishBinaryBoundsModule: AlgorithmModule<BbExecPoint> = {
  ...bboundModule,
  title: 'Lower and Upper Bound',
  buildSteps: (input) => bboundModule.buildSteps(input).map(localizeBinaryBoundsStep),
  sources: translateSources(bboundModule.sources, BOUND_SOURCE_REPLACEMENTS),
};
