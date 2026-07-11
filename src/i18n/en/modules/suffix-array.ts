import { suffixArrayModule } from '@/algorithms/suffixarray.module';
import { createEnglishAdapter } from '../shared';

export const englishSuffixArrayModule = createEnglishAdapter(suffixArrayModule, {
  title: 'Suffix Array',
  captions: {
    init: 'Start with every text suffix and rank it by its first character.',
    sort: 'Sort suffix indices by their current pair of doubled-length ranks.',
    rank: 'Assign new compact ranks to equal and unequal rank pairs.',
    done: 'All suffix ranks are unique and their index order is the suffix array.',
  },
});
