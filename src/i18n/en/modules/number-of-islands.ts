import { islandsModule } from '@/algorithms/islands.module';
import { createEnglishAdapter } from '../shared';

export const englishNumberOfIslandsModule = createEnglishAdapter(islandsModule, {
  title: 'Number of Islands',
  captions: {
    scan: 'Scan the next grid cell for land that does not belong to a known component.',
    found: 'This unseen land cell starts a new island and a new flood fill.',
    flood: 'Visit one connected land neighbor and mark it as part of the current island.',
    done: 'Every land cell is assigned and the island count is complete.',
  },
});
