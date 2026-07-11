import { treeDpModule } from '@/algorithms/treedp.module';
import { createEnglishAdapter } from '../shared';

export const englishTreeDpModule = createEnglishAdapter(treeDpModule, {
  title: 'Tree Dynamic Programming',
  captions: {
    init: 'Root the tree and prepare selected and unselected states for every node.',
    leaf: 'A leaf contributes its own value when selected and zero when unselected.',
    sel: 'Select this node, so every child must use its unselected state.',
    not: 'Leave this node unselected and take the better state from each child.',
    best: 'Choose the better selected or unselected state at the root.',
    done: 'All postorder states are complete and the optimum is known.',
  },
});
