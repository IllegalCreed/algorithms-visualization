import { selectionSortModule } from '@/algorithms/selection-sort.module';
import { createEnglishAdapter } from '../shared';

export const englishSelectionSortModule = createEnglishAdapter(selectionSortModule, {
  title: 'Selection Sort',
  captions: {
    outerLoop: 'Begin a pass that will choose the minimum of the unsorted suffix.',
    innerLoop: 'Advance the scan through the remaining candidate positions.',
    compare: 'Compare the current candidate with the smallest value seen in this pass.',
    newMin: 'Record the highlighted candidate as the new minimum.',
    swap: 'Swap the pass minimum into the first unsorted position.',
    noSwap: 'The first unsorted position already contains the minimum, so no swap is needed.',
    done: 'Every position has received its final minimum and the array is sorted.',
  },
});
