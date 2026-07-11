import type { AlgorithmModule, QuickExecPoint, QuizItem, Step } from '@/components/player/types';
import { quickSortModule } from '@/algorithms/quick-sort.module';
import { translateSources, valueOf } from '../shared';

function translatedQuickQuiz(
  point: QuickExecPoint,
  quiz: QuizItem | undefined,
): QuizItem | undefined {
  if (!quiz) return undefined;
  if (point === 'pivotSelect') {
    return {
      question: 'Which element does this Lomuto partition use as its pivot?',
      options: ['The last element', 'The first element', 'A random element'],
      answer: 0,
    };
  }
  return {
    question: 'What happens after the pivot reaches its final position?',
    options: [
      'Process the left and right subranges',
      'Scan the entire array for another pivot',
      'Stop sorting immediately',
    ],
    answer: 0,
  };
}

function localizeQuickStep(step: Step<QuickExecPoint>): Step<QuickExecPoint> {
  const lo = valueOf(step, 'lo');
  const hi = valueOf(step, 'hi');
  const pivot = valueOf(step, 'pivot');
  const i = valueOf(step, 'i');
  const j = valueOf(step, 'j');
  const aj = valueOf(step, 'a[j]');
  const depth = valueOf(step, '栈深');
  const caption: Record<QuickExecPoint, () => string> = {
    pop: () => `Pop interval [${lo}, ${hi}] from the work stack.`,
    pivotSelect: () => `Choose a[${hi}] = ${pivot} as the pivot.`,
    compare: () =>
      `Compare a[${j}] = ${aj} with pivot ${pivot}: ${Number(aj) < Number(pivot) ? '<' : '>='}.`,
    swap: () => `Move a[${j}] into the less-than region and advance i to ${i}.`,
    noSwap: () => `a[${j}] is at least the pivot, so leave it in place and continue.`,
    pivotPlace: () => `Place the pivot at index ${i}; this position is now final.`,
    push: () => `Push the non-trivial subranges; ${depth} interval(s) remain.`,
    done: () => 'Done. Every value is in sorted order.',
  };

  return {
    ...step,
    vars: step.vars.map((row) =>
      row.name === '栈深' ? { name: 'Stack depth', value: row.value } : { ...row },
    ),
    caption: caption[step.point](),
    quiz: translatedQuickQuiz(step.point, step.quiz),
  };
}

export const englishQuickSortModule: AlgorithmModule<QuickExecPoint> = {
  ...quickSortModule,
  title: 'Quick Sort',
  buildSteps: (input) => quickSortModule.buildSteps(input).map(localizeQuickStep),
  sources: translateSources(quickSortModule.sources),
  inputSpec: quickSortModule.inputSpec
    ? {
        ...quickSortModule.inputSpec,
        hint: 'Enter 2 to 12 integers from 1 to 99, separated by commas',
      }
    : undefined,
};
