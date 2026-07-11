import { completeKnapsackModule } from '@/algorithms/completeknapsack.module';
import { createEnglishAdapter } from '../shared';

export const englishCompleteKnapsackModule = createEnglishAdapter(completeKnapsackModule, {
  title: 'Unbounded Knapsack',
  captions: {
    init: 'Initialize zero value for every capacity before considering any item type.',
    cellSkip: 'This capacity cannot improve by taking the current item, so keep the previous best.',
    cellChoose:
      'Take one more copy of the current item and reuse the same item row for the remainder.',
    done: 'Every item type and capacity has been evaluated.',
  },
});
