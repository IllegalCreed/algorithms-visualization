import { sudokuModule } from '@/algorithms/sudoku.module';
import { createEnglishAdapter } from '../shared';

export const englishSudokuModule = createEnglishAdapter(sudokuModule, {
  title: 'Sudoku Solver',
  captions: {
    init: 'Load the puzzle and identify the empty cells that require choices.',
    reject: 'This digit conflicts with the active row, column, or three-by-three box.',
    place: 'Place a legal digit and recurse to the next empty cell.',
    backtrack: 'The later puzzle became impossible, so remove this digit and try another.',
    done: 'Every cell is filled and all Sudoku constraints hold.',
  },
});
