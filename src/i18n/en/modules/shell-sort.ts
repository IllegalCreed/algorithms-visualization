import { shellSortModule } from '@/algorithms/shell-sort.module';
import { createEnglishAdapter } from '../shared';

export const englishShellSortModule = createEnglishAdapter(shellSortModule, {
  title: 'Shell Sort',
  captions: {
    gapChange: 'Reduce the gap and form a new set of interleaved subsequences.',
    groupStart: 'Focus on one gap-separated subsequence.',
    outerLoop: 'Take the next key from this subsequence for gapped insertion.',
    compare: 'Compare the key with the preceding value at the same gap.',
    shift: 'Shift the larger gapped value forward by one gap.',
    insert: 'Place the key in its ordered position within the current subsequence.',
    done: 'The final gap-one insertion pass is complete and the array is sorted.',
  },
});
