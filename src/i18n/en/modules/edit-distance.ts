import type { AlgorithmModule, EditDistExecPoint, Step, VarRow } from '@/components/player/types';
import { editDistModule } from '@/algorithms/editdist.module';
import { translateSources, valueOf } from '../shared';

function localizeEditDistanceValue(value: VarRow['value']): VarRow['value'] {
  if (typeof value !== 'string') return value;
  return value
    .replace('（相同）', ' (equal)')
    .replace('（不同）', ' (different)')
    .replaceAll('左上', 'top-left')
    .replaceAll('上', 'up')
    .replaceAll('左', 'left');
}

function localizeEditDistanceVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    源串: 'Source',
    目标串: 'Target',
    比较: 'Comparison',
    取值: 'Transition',
    编辑距离: 'Edit distance',
  };
  return vars.map((row) => ({
    name: labels[row.name] ?? row.name,
    value: localizeEditDistanceValue(row.value),
  }));
}

function localizeEditDistanceStep(step: Step<EditDistExecPoint>): Step<EditDistExecPoint> {
  const active = step.matrix?.active;
  const sourceChar = active ? step.matrix?.rowLabels?.[active[0]] : undefined;
  const targetChar = active ? step.matrix?.colLabels?.[active[1]] : undefined;
  const result = active ? step.matrix?.cells[active[0]]?.[active[1]] : undefined;
  const sourceCells = step.matrix?.sources ?? [];
  const sourceValues = sourceCells.map(([row, col]) => step.matrix?.cells[row]?.[col]);
  const captions: Record<EditDistExecPoint, () => string> = {
    init: () =>
      'Initialize the first row with insertion counts and the first column with deletion counts.',
    cellMatch: () =>
      `${sourceChar} equals ${targetChar}, so no edit is needed; copy the top-left value ${result}.`,
    cellDiff: () =>
      `${sourceChar} differs from ${targetChar}; take 1 plus min(${sourceValues.join(', ')}) to get ${result}.`,
    done: () =>
      `The bottom-right cell gives edit distance ${valueOf(step, '编辑距离')} from ${valueOf(step, '源串')} to ${valueOf(step, '目标串')}.`,
  };

  return {
    ...step,
    vars: localizeEditDistanceVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishEditDistanceModule: AlgorithmModule<EditDistExecPoint> = {
  ...editDistModule,
  title: 'Edit Distance',
  buildSteps: (input) => editDistModule.buildSteps(input).map(localizeEditDistanceStep),
  sources: translateSources(editDistModule.sources),
};
