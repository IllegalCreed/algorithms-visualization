import { boyerMooreModule } from '@/algorithms/boyermoore.module';
import { createEnglishAdapter } from '../shared';

export const englishBoyerMooreModule = createEnglishAdapter(boyerMooreModule, {
  title: 'Boyer-Moore String Matching',
  captions: {
    start: 'Align the pattern at this text window and begin comparing from its right edge.',
    match: 'These characters match, so continue one position left within the same alignment.',
    badChar: 'A mismatch permits a safe bad-character shift to the next alignment.',
    found: 'Every pattern character matched at this alignment.',
    done: 'No remaining alignment can contain the pattern.',
  },
});
