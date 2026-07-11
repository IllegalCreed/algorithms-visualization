import { rerootModule } from '@/algorithms/reroot.module';
import { createEnglishAdapter } from '../shared';

export const englishRerootDpModule = createEnglishAdapter(rerootModule, {
  title: 'Rerooting DP',
  captions: {
    init: 'Root the tree once and prepare subtree sizes plus downward distance sums.',
    down: 'Combine child subtrees postorder to finish this node size and downward sum.',
    root: 'The original root downward sum is also its whole-tree answer.',
    reroot:
      'Move the root across this edge: the child subtree gets closer and every other node gets farther.',
    done: 'The preorder transfer has produced a whole-tree answer for every possible root.',
  },
});
