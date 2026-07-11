import { ternaryModule } from '@/algorithms/ternary.module';
import { createEnglishAdapter } from '../shared';

export const englishTernarySearchModule = createEnglishAdapter(ternaryModule, {
  title: 'Ternary Search',
  captions: {
    init: 'Begin with an interval known to contain one peak of a unimodal objective.',
    probe: 'Evaluate the two one-third probes and discard the side that cannot contain the peak.',
    peak: 'The interval is sufficiently small and its best remaining point is the peak estimate.',
    done: 'Return the maximizing point and objective value.',
  },
});
