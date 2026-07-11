import { sccModule } from '@/algorithms/scc.module';
import { createEnglishAdapter } from '../shared';

export const englishSccModule = createEnglishAdapter(sccModule, {
  title: 'Strongly Connected Components',
  captions: {
    enter:
      'Discover this vertex, assign its discovery and low-link values, and push it on the stack.',
    tree: 'Return from a DFS child and propagate its reachable low-link value upward.',
    back: 'Use an edge to a stacked vertex to lower the current low-link value.',
    scc: 'Discovery equals low-link here, so pop one complete strongly connected component.',
    done: 'All vertices belong to a maximal strongly connected component.',
  },
});
