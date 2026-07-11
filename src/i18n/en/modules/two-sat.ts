import { twoSatModule } from '@/algorithms/twosat.module';
import { createEnglishAdapter } from '../shared';

export const englishTwoSatModule = createEnglishAdapter(twoSatModule, {
  title: '2-SAT',
  captions: {
    init: 'Create one implication-graph vertex for every literal and its negation.',
    clause: 'Convert this two-literal clause into its two contrapositive implication edges.',
    scc: 'Finish one strongly connected component of the implication graph.',
    check: 'Check that this variable and its negation belong to different components.',
    assign: 'Choose the variable value from the reverse topological order of its two components.',
    done: 'Every variable is consistent and the displayed assignment satisfies all clauses.',
  },
});
