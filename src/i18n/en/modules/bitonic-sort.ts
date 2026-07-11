import { bitonicModule } from '@/algorithms/bitonic.module';
import { createEnglishAdapter } from '../shared';

export const englishBitonicSortModule = createEnglishAdapter(bitonicModule, {
  title: 'Bitonic Sort',
  captions: {
    init: 'Arrange the input at the left edge of the fixed comparison network.',
    column: 'Run every independent comparator in this network column in parallel.',
    done: 'All network columns are complete and the output is sorted.',
  },
});
