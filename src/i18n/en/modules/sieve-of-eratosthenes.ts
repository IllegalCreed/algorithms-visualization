import type { AlgorithmModule, SieveExecPoint, Step, VarRow } from '@/components/player/types';
import { sieveModule } from '@/algorithms/sieve.module';
import { translateSources } from '../shared';

const SIEVE_SOURCE_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ['剩下没划掉的都是素数', 'remaining unmarked values are prime'],
  ['从 p² 起划掉 p 的倍数', 'mark multiples of p from p^2'],
  ['p 没被划掉 → 素数', 'unmarked p is prime'],
  ['初始都没划掉', 'initially unmarked'],
];

function localizeSieveVars(vars: VarRow[]): VarRow[] {
  return vars.map((row) => {
    if (row.name === '范围') return { name: 'Range', value: row.value };
    if (row.name === '已确认素数') return { name: 'Confirmed primes', value: row.value };
    if (row.name === '当前 p') return { name: 'Current p', value: row.value };
    if (row.name === '一次性确认') {
      return { name: 'Confirmed at once', value: String(row.value).replace(' 个', '') };
    }
    if (row.name === '素数个数') return { name: 'Prime count', value: row.value };
    const marked = row.name.match(/^划掉 (\d+) 的倍数$/);
    return marked
      ? {
          name: `Multiples of ${marked[1]} marked`,
          value: String(row.value).replace(' 个', ''),
        }
      : { ...row };
  });
}

function localizeSieveStep(step: Step<SieveExecPoint>): Step<SieveExecPoint> {
  const sieve = step.sieve!;
  const primes = sieve.states.flatMap((state, value) => (state === 'prime' ? [value] : []));
  const captions: Record<SieveExecPoint, () => string> = {
    init: () =>
      `Lay out 1 through ${sieve.n}; 1 is neither prime nor composite, and all larger values start unmarked.`,
    prime: () => `${sieve.current} is still unmarked, so confirm it as prime.`,
    mark: () =>
      `Mark ${sieve.marking?.join(', ') || 'no new values'} as composite multiples of ${sieve.current}, starting at p^2.`,
    rest: () =>
      `Every remaining unmarked value is prime because each composite up to ${sieve.n} has a factor at most sqrt(${sieve.n}).`,
    done: () => `The primes from 1 through ${sieve.n} are ${primes.join(', ')}.`,
  };

  return {
    ...step,
    vars: localizeSieveVars(step.vars),
    caption: captions[step.point](),
  };
}

export const englishSieveModule: AlgorithmModule<SieveExecPoint> = {
  ...sieveModule,
  title: 'Sieve of Eratosthenes',
  buildSteps: (input) => sieveModule.buildSteps(input).map(localizeSieveStep),
  sources: translateSources(sieveModule.sources, SIEVE_SOURCE_REPLACEMENTS),
};
