import { cocktailSortModule } from '@/algorithms/cocktail.module';
import { createEnglishAdapter } from '../shared';

export const englishCocktailSortModule = createEnglishAdapter(cocktailSortModule, {
  title: 'Cocktail Shaker Sort',
  captions: {
    forwardPass: 'Start a forward pass that moves the largest remaining value to the right.',
    fCompare: 'Compare the highlighted adjacent pair while scanning from left to right.',
    fSwap: 'Swap the forward pair so the larger value moves right.',
    fNoSwap: 'Keep the forward pair because it is already ordered.',
    backwardPass: 'Start a backward pass that moves the smallest remaining value to the left.',
    bCompare: 'Compare the highlighted adjacent pair while scanning from right to left.',
    bSwap: 'Swap the backward pair so the smaller value moves left.',
    bNoSwap: 'Keep the backward pair because it is already ordered.',
    done: 'Both boundaries have met and the array is sorted.',
  },
});
