import { topDownMergeSortModule } from '@/algorithms/top-down-merge.module';
import { createEnglishAdapter } from '../shared';

export const englishTopDownMergeSortModule = createEnglishAdapter(topDownMergeSortModule, {
  title: 'Top-Down Merge Sort',
  captions: {
    split: 'Split the current interval into two smaller recursive problems.',
    mergeStart: 'Both halves are sorted; begin merging them into the auxiliary array.',
    compare: 'Compare the next unmerged value from each sorted half.',
    takeLeft: 'Copy the smaller left value into the next auxiliary position.',
    takeRight: 'Copy the smaller right value into the next auxiliary position.',
    drainLeft: 'The right half is empty, so copy the remaining left value.',
    drainRight: 'The left half is empty, so copy the remaining right value.',
    writeBack: 'Copy this merged auxiliary value back into the original interval.',
    done: 'The root interval has been merged and the array is sorted.',
  },
});
