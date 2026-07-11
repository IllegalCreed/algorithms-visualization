import { radixSortModule } from '@/algorithms/radix-sort.module';
import { createEnglishAdapter } from '../shared';

export const englishRadixSortModule = createEnglishAdapter(radixSortModule, {
  title: 'Radix Sort',
  captions: {
    passStart: 'Begin a stable bucket pass for the next base-ten digit.',
    distribute: 'Place the highlighted value into the bucket selected by this digit.',
    collect: 'Collect the next bucket value back into the array in stable order.',
    done: 'Every significant digit has been processed and the array is sorted.',
  },
});
