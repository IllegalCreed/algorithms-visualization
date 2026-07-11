import { floydModule } from '@/algorithms/floyd.module';
import { createEnglishAdapter } from '../shared';

export const englishFloydWarshallModule = createEnglishAdapter(floydModule, {
  title: 'Floyd-Warshall',
  captions: {
    init: 'Initialize direct edge distances, zero diagonals, and infinity for unknown routes.',
    pivotStart: 'Allow the highlighted vertex as the next possible intermediate stop.',
    relaxUpdate: 'The route through the pivot is shorter, so update this ordered vertex pair.',
    relaxSkip: 'The route through the pivot is not shorter, so keep the current distance.',
    done: 'Every vertex has served as an intermediate and the all-pairs matrix is complete.',
  },
});
