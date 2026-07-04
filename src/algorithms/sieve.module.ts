import type {
  AlgorithmModule,
  SieveCellState,
  SieveExecPoint,
  SieveTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { SIEVE_N, SIEVE_COLS } from './sieve';
import { sieveSources } from './sieve.sources';

/** 固定 N=30 埃氏筛逐素数重走，产出数字网格轨胖步骤（SieveView）。
 *  init 网格 → 每素数 prime（绿）+ mark（划从 p² 起的倍数，红→灰）→ rest（p²>N 剩余全素数）→ done。 */
export function buildSieveSteps(): Step<SieveExecPoint>[] {
  const n = SIEVE_N;
  const cols = SIEVE_COLS;
  const states: SieveCellState[] = new Array<SieveCellState>(n + 1).fill('unknown');
  states[1] = 'special'; // 1 既非素也非合
  const primes: number[] = [];
  const steps: Step<SieveExecPoint>[] = [];

  const emit = (
    point: SieveExecPoint,
    current: number | null,
    marking: number[],
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const sieve: SieveTrack = { n, cols, states: [...states], current, marking };
    const vars: VarRow[] = [
      { name: '范围', value: `1..${n}` },
      { name: '已确认素数', value: `${primes.length}` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, sieve, caption });
  };

  emit(
    'init',
    null,
    [],
    `数字 1..${n} 排成网格；1 既不是素数也不是合数；从 2 开始，每找到一个还没被划掉的数就是素数，再划掉它的所有倍数`,
  );

  for (let p = 2; p * p <= n; p++) {
    if (states[p] !== 'unknown') continue; // 已被更小素数划掉 → 跳过
    states[p] = 'prime';
    primes.push(p);
    emit('prime', p, [], `${p} 还没被划掉 → 是素数（绿）`, [{ name: '当前 p', value: `${p}` }]);
    const marks: number[] = [];
    for (let m = p * p; m <= n; m += p) {
      if (states[m] === 'unknown') {
        states[m] = 'composite';
        marks.push(m);
      }
    }
    emit(
      'mark',
      p,
      marks,
      `划掉 ${p} 的倍数（从 ${p * p} 起——更小的倍数已被更小素数划过）：${marks.join(', ')} → 都是合数（灰）`,
      [{ name: `划掉 ${p} 的倍数`, value: `${marks.length} 个` }],
    );
  }

  // p²>N：剩余未划的都是素数
  const rest: number[] = [];
  for (let v = 2; v <= n; v++) {
    if (states[v] === 'unknown') {
      states[v] = 'prime';
      primes.push(v);
      rest.push(v);
    }
  }
  primes.sort((a, b) => a - b);
  emit(
    'rest',
    null,
    [],
    `再往后 p²>${n}（√${n}≈${Math.sqrt(n).toFixed(1)}）：任何 ≤${n} 的合数都有一个 ≤√${n} 的质因子、早被划掉了，所以剩下没划掉的 ${rest.join(', ')} 全是素数（绿）`,
    [{ name: '一次性确认', value: `${rest.length} 个` }],
  );

  emit('done', null, [], `筛完！1..${n} 的素数共 ${primes.length} 个：${primes.join(', ')}`, [
    { name: '素数个数', value: `${primes.length}` },
  ]);
  return steps;
}

export const sieveModule: AlgorithmModule<SieveExecPoint> = {
  title: '埃氏筛（素数筛）',
  initialInput: () => [],
  buildSteps: () => buildSieveSteps(),
  sources: sieveSources,
};
