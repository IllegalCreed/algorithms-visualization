import { maxFlowModule } from '@/algorithms/maxflow.module';
import { createEnglishAdapter } from '../shared';

export const englishMaxFlowModule = createEnglishAdapter(maxFlowModule, {
  title: 'Maximum Flow',
  captions: {
    init: 'Initialize every network edge with zero flow and its full residual capacity.',
    find: 'Find a source-to-sink path using only edges with positive residual capacity.',
    augment: 'Push the path bottleneck forward and add matching reverse residual capacity.',
    done: 'No augmenting path remains, so the current flow is maximum.',
  },
});
