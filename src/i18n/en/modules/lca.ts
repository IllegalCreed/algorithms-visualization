import { lcaModule } from '@/algorithms/lca.module';
import { createEnglishAdapter } from '../shared';

export const englishLcaModule = createEnglishAdapter(lcaModule, {
  title: 'Lowest Common Ancestor',
  captions: {
    init: 'Root the tree and prepare depths plus powers-of-two ancestor columns.',
    build: 'Fill this ancestor entry by jumping twice through the previous column.',
    align: 'Lift the deeper query node by the binary decomposition of the depth difference.',
    jump: 'Lift both nodes by the largest safe power whose ancestors still differ.',
    answer: 'The nodes now have the same parent, which is their lowest common ancestor.',
    done: 'Preprocessing and the logarithmic ancestor query are complete.',
  },
});
