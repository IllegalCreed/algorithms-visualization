import { digitDpModule } from '@/algorithms/digitdp.module';
import { createEnglishAdapter } from '../shared';

export const englishDigitDpModule = createEnglishAdapter(digitDpModule, {
  title: 'Digit DP',
  captions: {
    init: 'Split the upper bound into digits and begin in the tight prefix state.',
    free: 'Choose a smaller valid digit, then count every unrestricted valid suffix.',
    tight: 'Match the upper-bound digit and keep the prefix tight when it is valid.',
    broken: 'The tight path used a forbidden digit, so it contributes no valid number.',
    sum: 'Add the free branches and the surviving tight branch for this position.',
    done: 'Adjust the zero case and return the count within the upper bound.',
  },
});
