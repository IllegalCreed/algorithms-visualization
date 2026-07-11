import { fastPowModule } from '@/algorithms/fastpower.module';
import { createEnglishAdapter } from '../shared';

export const englishFastPowerModule = createEnglishAdapter(fastPowModule, {
  title: 'Binary Exponentiation',
  captions: {
    init: 'Initialize the result to one and represent the exponent by its binary bits.',
    mul: 'The current exponent bit is one, so multiply the result by this squared base.',
    skip: 'The current exponent bit is zero, so skip multiplying the result.',
    done: 'All bits are consumed and the accumulated product equals the requested power.',
  },
});
