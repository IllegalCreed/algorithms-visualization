import type { AlgorithmModule, LcsExecPoint, Step, VarRow } from '@/components/player/types';
import { lcsModule } from '@/algorithms/lcs.module';
import { translateSources, valueOf } from '../shared';

const LCS_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['不同：上/左较大', 'different: max of up/left'],
  ['相同：左上 + 1', 'equal: top-left + 1'],
  ['回溯恢复 LCS', 'reconstruct the LCS'],
  ['收字符走对角', 'take the character and move diagonally'],
  ['往大的上/左走', 'follow the larger up/left value'],
];

function localizeLcsValue(value: VarRow['value']): VarRow['value'] {
  if (typeof value !== 'string') return value;
  return value
    .replace('（相同）', ' (equal)')
    .replace('（不同）', ' (different)')
    .replace('（空）', '(empty)')
    .replaceAll('左上', 'top-left')
    .replaceAll('上', 'up')
    .replaceAll('左', 'left')
    .replaceAll('匹配', 'match');
}

function localizeLcsVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    '串 X': 'String X',
    '串 Y': 'String Y',
    比较: 'Comparison',
    取值: 'Transition',
    'LCS 长度': 'LCS length',
    回溯: 'Trace',
    已恢复: 'Recovered',
    长度: 'Length',
  };
  return vars.map((row) => ({
    name: labels[row.name] ?? row.name,
    value: localizeLcsValue(row.value),
  }));
}

function localizeLcsStep(step: Step<LcsExecPoint>): Step<LcsExecPoint> {
  const active = step.matrix?.active;
  const x = active ? step.matrix?.rowLabels?.[active[0]] : undefined;
  const y = active ? step.matrix?.colLabels?.[active[1]] : undefined;
  const value = active ? step.matrix?.cells[active[0]]?.[active[1]] : undefined;
  const traceMatch = Boolean(active && x === y);
  const captions: Record<LcsExecPoint, () => string> = {
    init: () => 'Initialize the empty-prefix row and column to 0.',
    match: () =>
      `${x} equals ${y}; extend a common subsequence from the top-left cell to ${value}.`,
    mismatch: () =>
      `${x} differs from ${y}; keep the larger LCS length from the up and left cells, giving ${value}.`,
    fillDone: () =>
      `The table is complete and the bottom-right cell gives LCS length ${valueOf(step, 'LCS 长度')}.`,
    trace: () =>
      traceMatch
        ? `${x} matches ${y}; prepend it to the recovered subsequence and move diagonally up-left.`
        : `${x} differs from ${y}; follow a neighboring cell that preserves the current LCS length.`,
    done: () =>
      `Backward tracing reconstructs LCS ${valueOf(step, 'LCS')} with length ${valueOf(step, '长度')}.`,
  };

  return {
    ...step,
    vars: localizeLcsVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishLcsModule: AlgorithmModule<LcsExecPoint> = {
  ...lcsModule,
  title: 'Longest Common Subsequence',
  buildSteps: (input) => lcsModule.buildSteps(input).map(localizeLcsStep),
  sources: translateSources(lcsModule.sources, LCS_SOURCE_REPLACEMENTS),
};
