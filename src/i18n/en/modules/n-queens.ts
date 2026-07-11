import type { AlgorithmModule, NQueensExecPoint, Step, VarRow } from '@/components/player/types';
import { queensModule } from '@/algorithms/queens.module';
import { translateSources } from '../shared';

function square(step: Step<NQueensExecPoint>): string {
  const cell = step.board?.tryCell;
  if (!cell) return '-';
  return `${String.fromCharCode(65 + cell[1])}${cell[0] + 1}`;
}

function localizeNQueensVars(step: Step<NQueensExecPoint>): VarRow[] {
  const labels: Record<string, string> = {
    棋盘: 'Board',
    已放皇后: 'Placed queens',
    结果: 'Result',
    尝试: 'Attempt',
    放置: 'Placement',
    回溯: 'Backtrack',
  };
  return step.vars.map((row) => {
    let value = row.value;
    if (row.name === '结果') value = 'Solution found';
    if (row.name === '尝试') value = `${square(step)} conflicts`;
    if (row.name === '放置') value = `Place at ${square(step)}`;
    if (row.name === '回溯') value = `Remove queen from ${square(step)}`;
    return { name: labels[row.name] ?? row.name, value };
  });
}

function localizeNQueensStep(step: Step<NQueensExecPoint>): Step<NQueensExecPoint> {
  const captions: Record<NQueensExecPoint, () => string> = {
    init: () => 'Start with an empty board and place one queen in each column from left to right.',
    tryConflict: () =>
      `${square(step)} is attacked by ${step.board?.conflictCells?.length ?? 0} placed queen(s), so reject it.`,
    place: () => `${square(step)} is safe; place a queen and recurse into the next column.`,
    backtrack: () =>
      `The later columns cannot be completed, so remove the queen from ${square(step)} and try the next row.`,
    solved: () => 'All queens are placed with no shared row, column, or diagonal.',
  };

  return {
    ...step,
    vars: localizeNQueensVars(step),
    caption: captions[step.point](),
  };
}

export const englishNQueensModule: AlgorithmModule<NQueensExecPoint> = {
  ...queensModule,
  title: 'N-Queens',
  buildSteps: (input) => queensModule.buildSteps(input).map(localizeNQueensStep),
  sources: translateSources(queensModule.sources),
};
