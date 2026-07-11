import { eulerModule } from '@/algorithms/euler.module';
import { createEnglishAdapter } from '../shared';

export const englishEulerPathModule = createEnglishAdapter(eulerModule, {
  title: 'Eulerian Path',
  captions: {
    init: 'Load the connected graph and the requirement to use every edge exactly once.',
    check: 'Check vertex degrees and choose the required odd endpoint when one exists.',
    walk: 'Consume one unused edge and push its destination onto the traversal stack.',
    back: 'This vertex has no unused edge, so pop it into the reversed final path.',
    done: 'Reverse the popped sequence to obtain an Eulerian path containing every edge once.',
  },
});
