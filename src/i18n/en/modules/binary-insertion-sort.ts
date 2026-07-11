import { binaryInsertionSortModule } from '@/algorithms/binary-insertion.module';
import { createEnglishAdapter } from '../shared';

export const englishBinaryInsertionSortModule = createEnglishAdapter(binaryInsertionSortModule, {
  title: 'Binary Insertion Sort',
  captions: {
    outerLoop: 'Take the next key and search for its position inside the sorted prefix.',
    probe: 'Probe the midpoint of the remaining insertion interval.',
    goLeft: 'The key belongs before the probe, so keep the left half.',
    goRight: 'The key belongs after the probe, so keep the right half.',
    found: 'The half-open interval is empty and identifies the stable insertion position.',
    shift: 'Shift one sorted value right to open the insertion gap.',
    insert: 'Place the key at the binary-search boundary.',
    done: 'Every key has been inserted and the array is sorted.',
  },
});
