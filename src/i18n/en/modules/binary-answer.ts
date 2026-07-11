import { banswerModule } from '@/algorithms/banswer.module';
import { createEnglishAdapter } from '../shared';

export const englishBinaryAnswerModule = createEnglishAdapter(banswerModule, {
  title: 'Binary Search on the Answer',
  captions: {
    init: 'Define the numeric answer interval and its monotone feasibility predicate.',
    probe:
      'Evaluate feasibility at the midpoint and discard the impossible half of the answer range.',
    settle: 'The first feasible boundary has converged to a single answer.',
    done: 'Return the boundary value that optimizes the monotone objective.',
  },
});
