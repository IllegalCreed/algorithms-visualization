import type { AlgorithmModule, ExecPoint, Step } from '@/components/player/types';
import { bubbleSortModule } from '@/algorithms/bubble-sort.module';
import { translateSources, valueOf } from '../shared';

function localizeBubbleStep(step: Step<ExecPoint>): Step<ExecPoint> {
  const pass = valueOf(step, 'pass');
  const j = Number(valueOf(step, 'j'));
  const left = valueOf(step, 'a[j]');
  const right = valueOf(step, 'a[j+1]');
  let caption: string;

  switch (step.point) {
    case 'outerLoop':
      caption = `Start pass ${pass}; the largest remaining value will reach the unsorted suffix.`;
      break;
    case 'innerLoop':
      caption = `Inspect adjacent positions ${j} and ${j + 1}.`;
      break;
    case 'compare':
      caption = `Compare ${left} and ${right}: ${Number(left) > Number(right) ? 'out of order' : 'already ordered'}.`;
      break;
    case 'swap':
      caption = `Swap ${left} and ${right} so the larger value moves one position right.`;
      break;
    case 'noSwap':
      caption = `Keep ${left} before ${right}; no swap is needed.`;
      break;
    case 'done':
      caption = 'Every pass is complete and the array is sorted.';
      break;
    default:
      caption = 'Advance Bubble Sort by one adjacent comparison.';
  }

  return { ...step, caption };
}

export const englishBubbleSortModule: AlgorithmModule<ExecPoint> = {
  ...bubbleSortModule,
  title: 'Bubble Sort',
  buildSteps: (input) => bubbleSortModule.buildSteps(input).map(localizeBubbleStep),
  sources: translateSources(bubbleSortModule.sources),
  inputSpec: bubbleSortModule.inputSpec
    ? {
        ...bubbleSortModule.inputSpec,
        hint: 'Enter 2 to 12 integers from 1 to 99, separated by commas',
      }
    : undefined,
};
