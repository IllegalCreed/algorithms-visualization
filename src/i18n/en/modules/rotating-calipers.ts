import { calipersModule } from '@/algorithms/calipers.module';
import { createEnglishAdapter } from '../shared';

export const englishRotatingCalipersModule = createEnglishAdapter(calipersModule, {
  title: 'Rotating Calipers',
  captions: {
    init: 'Load the convex polygon and place the first antipodal support pair.',
    spin: 'Advance the opposite pointer while the supported area continues to increase.',
    done: 'Every antipodal pair has been considered and the maximum squared distance is final.',
  },
});
