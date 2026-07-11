import { coinChangeModule } from '@/algorithms/coinchange.module';
import { createEnglishAdapter } from '../shared';

export const englishCoinChangeModule = createEnglishAdapter(coinChangeModule, {
  title: 'Coin Change',
  captions: {
    init: 'Set amount zero to zero coins and every positive amount to unreachable.',
    skip: 'This coin does not produce a better reachable count for the current amount.',
    add: 'Extend the best solution for the smaller amount by one copy of this coin.',
    done: 'The target amount now contains its minimum coin count and a predecessor choice.',
  },
});
