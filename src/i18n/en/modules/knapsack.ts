import type { AlgorithmModule, KnapsackExecPoint, Step, VarRow } from '@/components/player/types';
import { knapsackModule } from '@/algorithms/knapsack.module';
import { CAPACITY, ITEM_LABELS, VALUES, WEIGHTS } from '@/algorithms/knapsack';
import { translateSources } from '../shared';

const knapsackItems = ITEM_LABELS.map(
  (label, index) => `${label}(weight=${WEIGHTS[index]}, value=${VALUES[index]})`,
).join(' ');

function localizeKnapsackStep(step: Step<KnapsackExecPoint>): Step<KnapsackExecPoint> {
  const active = step.matrix?.active;
  const row = active?.[0] ?? 0;
  const capacity = active?.[1] ?? 0;
  const label = ITEM_LABELS[row - 1];
  const weight = WEIGHTS[row - 1];
  const value = VALUES[row - 1];
  const result = active ? step.matrix?.cells[row]?.[capacity] : undefined;
  const baseVars: VarRow[] = [
    { name: 'Capacity', value: CAPACITY },
    { name: 'Items', value: knapsackItems },
  ];

  if (step.point === 'init') {
    return {
      ...step,
      vars: baseVars,
      caption: 'With no items or zero capacity, the best value is 0.',
    };
  }

  if (step.point === 'done') {
    return {
      ...step,
      vars: [...baseVars, { name: 'Optimal value', value: result ?? 0 }],
      caption: `The bottom-right cell gives the optimal value ${result}: take items A and B.`,
    };
  }

  const current = `Item ${label} (weight=${weight}, value=${value}), capacity ${capacity}`;
  if (step.point === 'cellSkip') {
    return {
      ...step,
      vars: [
        ...baseVars,
        { name: 'Current', value: current },
        {
          name: 'Decision',
          value: `${weight} > ${capacity}; it does not fit, so copy ${result} from the row above`,
        },
      ],
      caption: `${label} does not fit at capacity ${capacity}; copy the value ${result} from the row above.`,
    };
  }

  const skip = step.matrix?.cells[row - 1]?.[capacity] ?? 0;
  const previous = step.matrix?.cells[row - 1]?.[capacity - weight] ?? 0;
  const take = Number(previous) + value;
  return {
    ...step,
    vars: [
      ...baseVars,
      { name: 'Current', value: current },
      {
        name: 'Decision',
        value: `max(skip=${skip}, take=${previous}+${value}=${take}) = ${result}`,
      },
    ],
    caption: `${label} fits: choose max(skip ${skip}, take ${take}) = ${result}.`,
  };
}

export const englishKnapsackModule: AlgorithmModule<KnapsackExecPoint> = {
  ...knapsackModule,
  title: '0/1 Knapsack',
  buildSteps: (input) => knapsackModule.buildSteps(input).map(localizeKnapsackStep),
  sources: translateSources(knapsackModule.sources),
};
