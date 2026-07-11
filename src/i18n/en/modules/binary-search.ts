import type { AlgorithmModule, BsExecPoint, QuizItem, Step } from '@/components/player/types';
import { bsearchModule } from '@/algorithms/bsearch.module';
import { translateSources, valueOf } from '../shared';

function translatedBsearchQuiz(
  point: BsExecPoint,
  quiz: QuizItem | undefined,
): QuizItem | undefined {
  if (!quiz) return undefined;
  if (point === 'mid') {
    return {
      question: 'arr[4] = 9 is smaller than target 17. What is the next candidate range?',
      options: ['[5, 9], the right half', '[0, 3], the left half', '[0, 9], unchanged'],
      answer: 0,
    };
  }
  return {
    question: 'What does lo > hi mean after the candidate range becomes empty?',
    options: [
      'The target is absent; return -1',
      'Scan from the start to confirm',
      'The array is unsorted',
    ],
    answer: 0,
  };
}

function localizeBsearchStep(step: Step<BsExecPoint>): Step<BsExecPoint> {
  const target = valueOf(step, 'target');
  const range = valueOf(step, '[lo, hi]');
  const mid = Number(valueOf(step, 'mid'));
  const probe = Number.isInteger(mid) ? step.array[mid]?.[1] : undefined;
  const captions: Record<BsExecPoint, () => string> = {
    init: () => `Search for target ${target} in the sorted array; start with range ${range}.`,
    mid: () =>
      `Probe mid = ${mid}: arr[${mid}] = ${probe} ${Number(probe) < Number(target) ? '<' : Number(probe) > Number(target) ? '>' : '='} ${target}.`,
    cut: () => `Discard the impossible half; the candidate range is now ${range}.`,
    found: () => `Found target ${target} at index ${mid}.`,
    empty: () => `The candidate range ${range} is empty, so target ${target} is absent. Return -1.`,
    done: () => 'Binary Search halves the candidate range at every comparison: O(log n) time.',
  };

  return {
    ...step,
    vars: step.vars.map((row) =>
      row.name === '复杂度' ? { name: 'Complexity', value: row.value } : { ...row },
    ),
    caption: captions[step.point](),
    quiz: translatedBsearchQuiz(step.point, step.quiz),
  };
}

export const englishBsearchModule: AlgorithmModule<BsExecPoint> = {
  ...bsearchModule,
  title: 'Binary Search',
  buildSteps: (input) => bsearchModule.buildSteps(input).map(localizeBsearchStep),
  sources: translateSources(bsearchModule.sources),
};
