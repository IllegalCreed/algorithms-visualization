import { threeWayQuickSortModule } from '@/algorithms/three-way-quick.module';
import { createEnglishAdapter } from '../shared';

export const englishThreeWayQuickSortModule = createEnglishAdapter(threeWayQuickSortModule, {
  title: 'Three-Way Quick Sort',
  captions: {
    pop: 'Take the next unsorted interval from the explicit work stack.',
    pivotSelect: 'Choose a pivot and initialize less-than, equal, and greater-than regions.',
    compare: 'Compare the scan value with the pivot.',
    less: 'Move this value into the less-than region and advance both left boundaries.',
    greater: 'Move this value into the greater-than region; inspect the replacement next.',
    equal: 'Leave this value in the equal region and advance the scan.',
    push: 'Push the nontrivial less-than and greater-than intervals for later processing.',
    done: 'Every interval is complete; equal pivot blocks are already in final position.',
  },
});
