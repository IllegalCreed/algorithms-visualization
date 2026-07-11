import { bentleyModule } from '@/algorithms/bentley.module';
import { createEnglishAdapter } from '../shared';

export const englishBentleyOttmannModule = createEnglishAdapter(bentleyModule, {
  title: 'Bentley-Ottmann Sweep Line',
  captions: {
    init: 'Initialize endpoint events and an empty vertical sweep-line status.',
    start: 'Insert a segment at its left endpoint and test its new status neighbors.',
    cross: 'Report this intersection, swap segment order, and schedule newly adjacent pairs.',
    end: 'Remove a segment at its right endpoint and test the neighbors that become adjacent.',
    done: 'All events are processed and every segment intersection is reported.',
  },
});
