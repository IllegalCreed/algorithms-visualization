import { astarModule } from '@/algorithms/astar.module';
import { createEnglishAdapter } from '../shared';

export const englishAstarModule = createEnglishAdapter(astarModule, {
  title: 'A* Search',
  captions: {
    init: 'Initialize the start with zero path cost and its heuristic estimate to the goal.',
    expand: 'Remove the frontier state with minimum g plus h and relax its traversable neighbors.',
    goal: 'The goal has the smallest frontier estimate, so its optimal path cost is settled.',
    trace: 'Follow predecessor links backward from the goal to reveal the final path.',
    done: 'The optimal route has been reconstructed from start to goal.',
  },
});
