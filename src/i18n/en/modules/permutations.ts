import { permuteModule } from '@/algorithms/permute.module';
import { createEnglishAdapter } from '../shared';

export const englishPermutationsModule = createEnglishAdapter(permuteModule, {
  title: 'Permutations',
  captions: {
    start: 'Start at the empty arrangement with every input value available.',
    choose: 'Choose one unused value for the next arrangement position.',
    record: 'Every value is used, so record this complete permutation.',
    backtrack: 'Undo the final choice and try the next unused value at that depth.',
    done: 'Every branch has been explored and all permutations are recorded.',
  },
});
