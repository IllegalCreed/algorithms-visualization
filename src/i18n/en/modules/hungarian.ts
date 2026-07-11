import { hungarianModule } from '@/algorithms/hungarian.module';
import { createEnglishAdapter } from '../shared';

export const englishHungarianModule = createEnglishAdapter(hungarianModule, {
  title: 'Bipartite Matching',
  captions: {
    init: 'Begin with every left and right vertex unmatched.',
    try: 'Try this edge; an occupied right vertex asks its current partner to move.',
    match: 'An augmenting path succeeded, so flip its edges and grow the matching by one.',
    fail: 'This branch cannot reach a free right vertex, so backtrack.',
    done: 'No additional left vertex can be augmented and the matching is maximum.',
  },
});
