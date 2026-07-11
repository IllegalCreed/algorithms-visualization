import type { AlgorithmModule, Step, SubsetsExecPoint, VarRow } from '@/components/player/types';
import { subsetsModule } from '@/algorithms/subsets.module';
import { translateSources, valueOf } from '../shared';

const SUBSETS_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['撤销（回溯）', 'undo (backtrack)'],
  ['不选 nums[i]', 'exclude nums[i]'],
  ['选 nums[i]', 'include nums[i]'],
];

function localizeDecisionLabel(label = ''): string {
  return label.replace(/^选 /, 'Include ').replace(/^跳过 /, 'Exclude ');
}

function localizeSubsetsVars(vars: VarRow[]): VarRow[] {
  const labels: Record<string, string> = {
    元素: 'Elements',
    当前子集: 'Current subset',
    已收集: 'Recorded',
  };
  return vars.map((row) => ({ name: labels[row.name] ?? row.name, value: row.value }));
}

function localizeSubsetsStep(step: Step<SubsetsExecPoint>): Step<SubsetsExecPoint> {
  const active = step.decisionTree?.activeId;
  const incoming = step.decisionTree?.edges.find((edge) => edge.to === active);
  const decision = localizeDecisionLabel(incoming?.label);
  const subset = valueOf(step, '当前子集');
  const captions: Record<SubsetsExecPoint, () => string> = {
    start: () => 'Start at the empty set and decide whether to include each element in order.',
    include: () => `${decision}; the current subset becomes ${subset}.`,
    exclude: () => `${decision}; the current subset remains ${subset}.`,
    record: () =>
      `All elements are decided, so record subset ${subset} (${valueOf(step, '已收集')}).`,
    backtrack: () =>
      `Return to subset ${subset} after finishing one branch, then explore the alternative decision.`,
    done: () => `The complete power set is recorded: ${valueOf(step, '已收集')} subsets.`,
  };

  return {
    ...step,
    decisionTree: step.decisionTree
      ? {
          ...step.decisionTree,
          edges: step.decisionTree.edges.map((edge) => ({
            ...edge,
            label: localizeDecisionLabel(edge.label),
          })),
        }
      : undefined,
    vars: localizeSubsetsVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishSubsetsModule: AlgorithmModule<SubsetsExecPoint> = {
  ...subsetsModule,
  title: 'Subsets',
  buildSteps: (input) => subsetsModule.buildSteps(input).map(localizeSubsetsStep),
  sources: translateSources(subsetsModule.sources, SUBSETS_SOURCE_REPLACEMENTS),
};
