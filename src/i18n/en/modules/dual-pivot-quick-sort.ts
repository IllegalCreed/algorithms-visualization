import { dualPivotQuickSortModule } from '@/algorithms/dual-pivot-quick.module';
import { createEnglishAdapter } from '../shared';

export const englishDualPivotQuickSortModule = createEnglishAdapter(dualPivotQuickSortModule, {
  title: 'Dual-Pivot Quick Sort',
  captions: {
    pop: 'Take the next unsorted interval from the work stack.',
    pivotSelect: 'Order the endpoint pivots and initialize three partition regions.',
    compare: 'Compare the scan value with both pivots.',
    less: 'Move the value into the region below the left pivot.',
    between: 'Keep the value in the region between the two pivots.',
    greater: 'Move the value into the region above the right pivot.',
    pivotPlace: 'Place both pivots between their completed regions.',
    push: 'Push each nontrivial outer or middle interval for later partitioning.',
    done: 'All three-way intervals are complete and the array is sorted.',
  },
});
