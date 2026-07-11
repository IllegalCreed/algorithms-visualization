import { zModule } from '@/algorithms/zfunc.module';
import { createEnglishAdapter } from '../shared';

export const englishZFunctionModule = createEnglishAdapter(zModule, {
  title: 'Z Function',
  captions: {
    init: 'Set z at zero to the string length and begin with an empty rightmost Z-box.',
    brute: 'This position lies outside the box, so compare directly from the string prefix.',
    mirror: 'Reuse the mirrored Z value inside the box, capped at the current right boundary.',
    extend: 'The reused match reaches the boundary, so compare forward and extend the box.',
    done: 'Every suffix now stores its longest match with the full string prefix.',
  },
});
