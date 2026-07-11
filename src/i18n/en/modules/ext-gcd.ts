import { extGcdModule } from '@/algorithms/extgcd.module';
import { createEnglishAdapter } from '../shared';

export const englishExtGcdModule = createEnglishAdapter(extGcdModule, {
  title: 'Extended Euclidean Algorithm',
  captions: {
    init: 'Begin the Euclidean division chain while tracking coefficient equations.',
    down: 'Divide a by b and recurse on b with the remainder.',
    base: 'The second value is zero, so gcd equals the first with coefficients one and zero.',
    up: 'Substitute the returned coefficients backward through this quotient equation.',
    done: 'The final coefficients satisfy the displayed Bezout identity.',
  },
});
