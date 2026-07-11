import { mrModule } from '@/algorithms/mr.module';
import { createEnglishAdapter } from '../shared';

export const englishMillerRabinModule = createEnglishAdapter(mrModule, {
  title: 'Miller-Rabin Primality Test',
  captions: {
    init: 'Choose the next witness base for this odd primality candidate.',
    decomp: 'Write n minus one as an odd factor times a power of two.',
    pow: 'Compute the witness base raised to the odd factor modulo n.',
    square: 'Square the residue through the power-of-two chain and look for minus one.',
    verdict: 'This witness either proves compositeness or passes its strong probable-prime test.',
    done: 'All required witnesses have passed, so the bounded integer is prime.',
  },
});
