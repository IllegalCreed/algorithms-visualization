import type { AlgorithmModule, LisExecPoint, Step, VarRow } from '@/components/player/types';
import { lisModule } from '@/algorithms/lis.module';
import { translateSources, valueOf } from '../shared';

const LIS_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['每个元素自身长度 1', 'each element alone has length 1'],
  ['能接得更长', 'can extend to a longer sequence'],
  ['最长在哪结尾', 'find the best ending position'],
  ['回溯恢复', 'reconstruct through predecessors'],
];

function localizeLisVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    输入: 'Input',
    '当前 i': 'Current i',
    '回看 j': 'Previous j',
    'LIS 长度': 'LIS length',
    长度: 'Length',
  };
  return vars.map((row) => ({ name: labels[row.name] ?? row.name, value: row.value }));
}

function localizeLisStep(step: Step<LisExecPoint>): Step<LisExecPoint> {
  const activeIndex = step.matrix?.active?.[1];
  const previousIndex = step.matrix?.sources?.find(
    ([row, col]) => row === 0 && col !== activeIndex,
  )?.[1];
  const values = step.matrix?.cells[0] ?? [];
  const dp = step.matrix?.cells[1] ?? [];
  const current = activeIndex === undefined ? undefined : values[activeIndex];
  const previous = previousIndex === undefined ? undefined : values[previousIndex];
  const captions: Record<LisExecPoint, () => string> = {
    init: () => 'Initialize every dp[i] to 1 because each value forms a length-one subsequence.',
    scan: () =>
      `Compare earlier value ${previous} with current value ${current}; this predecessor does not improve dp[${activeIndex}].`,
    extend: () =>
      `${previous} is smaller than ${current} and extends a longer sequence, so set dp[${activeIndex}] to ${dp[activeIndex ?? -1]}.`,
    fillDone: () =>
      `The largest DP value is ${valueOf(step, 'LIS 长度')}, ending at index ${activeIndex}.`,
    result: () =>
      `Follow predecessor links to reconstruct LIS ${valueOf(step, 'LIS')} with length ${valueOf(step, '长度')}.`,
  };

  return {
    ...step,
    matrix: step.matrix
      ? {
          ...step.matrix,
          rowLabels: step.matrix.rowLabels?.map((label) => (label === '值' ? 'Value' : label)),
        }
      : undefined,
    vars: localizeLisVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishLisModule: AlgorithmModule<LisExecPoint> = {
  ...lisModule,
  title: 'Longest Increasing Subsequence',
  buildSteps: (input) => lisModule.buildSteps(input).map(localizeLisStep),
  sources: translateSources(lisModule.sources, LIS_SOURCE_REPLACEMENTS),
};
