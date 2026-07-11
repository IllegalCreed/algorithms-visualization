import { lcpArrayModule } from '@/algorithms/lcparray.module';
import { createEnglishAdapter } from '../shared';

export const englishLcpArrayModule = createEnglishAdapter(lcpArrayModule, {
  title: 'LCP Array',
  captions: {
    init: 'Build inverse suffix ranks and initialize the reusable prefix length to zero.',
    fill: 'Compare this suffix with its previous suffix-array neighbor and store their common prefix.',
    skip: 'The first suffix has no previous neighbor, so its LCP entry is zero.',
    done: 'Every adjacent suffix pair has a longest common prefix value.',
  },
});
