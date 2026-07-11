import { wordSearchModule } from '@/algorithms/wordsearch.module';
import { createEnglishAdapter } from '../shared';

export const englishWordSearchModule = createEnglishAdapter(wordSearchModule, {
  title: 'Word Search',
  captions: {
    start: 'Try this grid cell as the first character of the target word.',
    match: 'The cell matches the next character; mark it and continue to an adjacent cell.',
    mismatch: 'This cell cannot extend the word, so reject the branch.',
    backtrack: 'No continuation works here; unmark the cell and return to the previous character.',
    found: 'Every character has matched along one valid non-repeating path.',
  },
});
