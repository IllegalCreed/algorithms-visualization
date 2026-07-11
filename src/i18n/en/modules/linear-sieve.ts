import { linearSieveModule } from '@/algorithms/linearsieve.module';
import { createEnglishAdapter } from '../shared';

export const englishLinearSieveModule = createEnglishAdapter(linearSieveModule, {
  title: 'Linear Sieve',
  captions: {
    init: 'Initialize the prime list and smallest-prime-factor table through the limit.',
    mark: 'Generate this composite from its smallest prime factor and stop before duplicate generation.',
    rest: 'The current value was never marked, so record it as a new prime.',
    done: 'Every number is classified and each composite was generated exactly once.',
  },
});
