import { ahoCorasickModule } from '@/algorithms/ahocorasick.module';
import { createEnglishAdapter } from '../shared';

export const englishAhoCorasickModule = createEnglishAdapter(ahoCorasickModule, {
  title: 'Aho-Corasick Automaton',
  captions: {
    insert: 'Insert the next pattern through shared trie-prefix edges.',
    fail: "Build this state's failure link to the longest proper suffix that is also a trie prefix.",
    match:
      'Consume the next text character, following failure links until a transition is available.',
    hit: 'This state or its output chain completes one or more patterns at the current text position.',
    done: 'The text scan is complete and every overlapping pattern occurrence is reported.',
  },
});
