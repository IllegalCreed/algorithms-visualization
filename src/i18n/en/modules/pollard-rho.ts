import { rhoModule } from '@/algorithms/rho.module';
import { createEnglishAdapter } from '../shared';

export const englishPollardRhoModule = createEnglishAdapter(rhoModule, {
  title: "Pollard's Rho Factorization",
  captions: {
    init: 'Begin with a composite integer whose useful factor is too large for short trial division.',
    seed: 'Choose a modular polynomial and seed for the pseudo-random sequence.',
    race: 'Advance the tortoise once and hare twice, then compute the gcd of their difference with n.',
    hit: 'The gcd is strictly between one and n, revealing a nontrivial factor.',
    reveal: 'Viewed modulo the factor, the sequence collision forms the characteristic rho shape.',
    done: 'Combine primality tests, recursion, and random restarts to finish the factorization pipeline.',
  },
});
