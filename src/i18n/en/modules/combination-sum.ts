import { combsumModule } from '@/algorithms/combsum.module';
import { createEnglishAdapter } from '../shared';

export const englishCombinationSumModule = createEnglishAdapter(combsumModule, {
  title: 'Combination Sum',
  captions: {
    start: 'Begin with an empty combination and the full remaining target.',
    include: 'Choose this candidate and keep its index available for repeated use.',
    prune: 'This candidate exceeds the remaining target, so prune it and every larger candidate.',
    record: 'The remaining target is zero, so record this nondecreasing combination.',
    backtrack: 'Undo the final choice and continue with the next candidate.',
    done: 'Every canonical branch has been explored without duplicate combinations.',
  },
});
