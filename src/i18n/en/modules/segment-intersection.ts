import { segIntModule } from '@/algorithms/segint.module';
import { createEnglishAdapter } from '../shared';

export const englishSegmentIntersectionModule = createEnglishAdapter(segIntModule, {
  title: 'Line Segment Intersection',
  captions: {
    init: 'Load both closed segments and their four endpoints.',
    test: 'Evaluate orientation cross products and the required bounding relationships.',
    verdict:
      'Combine the signs and collinear endpoint cases into the final intersection classification.',
    done: 'The segment pair has been classified without enumerating points along either segment.',
  },
});
