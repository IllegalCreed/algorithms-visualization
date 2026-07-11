import { phiModule } from '@/algorithms/phi.module';
import { createEnglishAdapter } from '../shared';

export const englishEulerPhiModule = createEnglishAdapter(phiModule, {
  title: "Euler's Totient Function",
  captions: {
    init: 'Begin with all candidates below n and the product result equal to n.',
    find: 'Discover a distinct prime factor of n.',
    cross: 'Remove the fraction of candidates divisible by this prime factor.',
    survive: 'The remaining highlighted values are exactly the integers coprime to n.',
    done: 'Every distinct prime factor has contributed to the totient product.',
  },
});
