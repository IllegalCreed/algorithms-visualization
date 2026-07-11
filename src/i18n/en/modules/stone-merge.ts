import { stoneModule } from '@/algorithms/stones.module';
import { createEnglishAdapter } from '../shared';

export const englishStoneMergeModule = createEnglishAdapter(stoneModule, {
  title: 'Stone Merging',
  captions: {
    init: 'Initialize every one-pile interval with zero merge cost.',
    pair: 'Merge this adjacent pair directly and record its interval sum as the cost.',
    split: 'Try every final split of this interval and keep the cheapest two-subinterval plan.',
    done: 'The full interval contains the minimum cost of merging all piles.',
  },
});
