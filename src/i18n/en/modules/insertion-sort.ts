import { insertionSortModule } from '@/algorithms/insertion-sort.module';
import { createEnglishAdapter } from '../shared';

export const englishInsertionSortModule = createEnglishAdapter(insertionSortModule, {
  title: 'Insertion Sort',
  captions: {
    outerLoop:
      'Remove the next key from the unsorted suffix and open a position in the sorted prefix.',
    compare: 'Compare the key with the sorted value immediately to its left.',
    shift: 'Shift the larger sorted value one position right.',
    insert: 'Place the key in the gap where every value to its left is no larger.',
    done: 'The sorted prefix now spans the entire array.',
  },
});
