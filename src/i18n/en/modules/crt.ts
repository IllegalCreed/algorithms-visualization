import { crtModule } from '@/algorithms/crt.module';
import { createEnglishAdapter } from '../shared';

export const englishCrtModule = createEnglishAdapter(crtModule, {
  title: 'Chinese Remainder Theorem',
  captions: {
    init: 'Multiply the pairwise coprime moduli to obtain the combined period M.',
    mi: 'Remove this modulus from M so the partial product vanishes under every other modulus.',
    inv: 'Find the partial product inverse under its own modulus.',
    term: 'Build one term that equals this residue here and zero under every other modulus.',
    sum: 'Add all dedicated residue terms into one combined integer.',
    done: 'Reduce the sum modulo M to obtain the unique smallest non-negative solution.',
  },
});
