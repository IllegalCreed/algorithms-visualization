import { rotSearchModule } from '@/algorithms/rotsearch.module';
import { createEnglishAdapter } from '../shared';

export const englishRotatedSearchModule = createEnglishAdapter(rotSearchModule, {
  title: 'Search in a Rotated Sorted Array',
  captions: {
    init: 'Begin with the entire rotated sorted array as the candidate interval.',
    probe:
      'Probe the midpoint, identify the sorted half, and retain the half that can contain the target.',
    found: 'The midpoint equals the target, so return its index.',
    done: 'The candidate interval is empty and the target is absent.',
  },
});
