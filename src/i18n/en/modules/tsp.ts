import { tspModule } from '@/algorithms/tsp.module';
import { createEnglishAdapter } from '../shared';

export const englishTspModule = createEnglishAdapter(tspModule, {
  title: 'Traveling Salesperson DP',
  captions: {
    init: 'Start at city zero with only its bit set and zero path cost.',
    fill: 'Reach this endpoint from the best predecessor in the mask without the endpoint bit.',
    close: 'Add the edge back to the start and compare complete tours.',
    done: 'The full-mask return transition gives the shortest Hamiltonian tour.',
  },
});
