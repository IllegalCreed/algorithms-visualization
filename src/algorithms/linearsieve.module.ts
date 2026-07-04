import type {
  AlgorithmModule,
  LinearSieveExecPoint,
  SieveCellState,
  SieveTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { LS_N, LS_COLS } from './linearsieve';
import { linearSieveSources } from './linearsieve.sources';

/** 固定 N=30 线性筛（欧拉筛）逐 i 重走，产出数字网格轨胖步骤（复用 SieveView + spf 角标）。
 *  外层 i 遍历所有数，对素数 p 划 i×p、spf[i×p]=p，i%p==0 即停 → 每合数只被最小质因子划一次。 */
export function buildLinearSieveSteps(): Step<LinearSieveExecPoint>[] {
  const n = LS_N;
  const cols = LS_COLS;
  const states: SieveCellState[] = new Array<SieveCellState>(n + 1).fill('unknown');
  states[1] = 'special';
  const spf: (number | null)[] = new Array<number | null>(n + 1).fill(null);
  const primes: number[] = [];
  const steps: Step<LinearSieveExecPoint>[] = [];

  const emit = (
    point: LinearSieveExecPoint,
    current: number | null,
    marking: number[],
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const sieve: SieveTrack = { n, cols, states: [...states], current, marking, spf: [...spf] };
    const vars: VarRow[] = [
      { name: '范围', value: `1..${n}` },
      { name: '已确认素数', value: `${primes.length}` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, sieve, caption });
  };

  // 处理外层一个 i，返回本步划掉的倍数 + 停因
  const doOuter = (i: number): { marks: number[]; broke: string; brokeP: number } => {
    if (states[i] === 'unknown') {
      states[i] = 'prime';
      primes.push(i);
    }
    const marks: number[] = [];
    let broke = 'exhausted';
    let brokeP = 0;
    for (const p of primes) {
      if (i * p > n) {
        broke = 'overflow';
        break;
      }
      states[i * p] = 'composite';
      spf[i * p] = p;
      marks.push(i * p);
      if (i % p === 0) {
        broke = 'divisible';
        brokeP = p;
        break;
      }
    }
    return { marks, broke, brokeP };
  };

  emit(
    'init',
    null,
    [],
    `数字 1..${n} 排成网格（与埃氏筛同一张）；线性筛外层 i 遍历每个数，让每个合数只被它的最小质因子划一次`,
  );

  // i=2..10 逐 i 一步
  for (let i = 2; i <= 10; i++) {
    const kind = states[i] === 'unknown' ? '素数' : '合数';
    const { marks, broke, brokeP } = doOuter(i);
    const bTxt =
      broke === 'divisible'
        ? `；${i} % ${brokeP} == 0 → 停（再往后划就重复了）`
        : broke === 'overflow'
          ? `；i×2>${n}，无可划`
          : '';
    const mTxt = marks.length
      ? `划掉 ${marks.map((m) => `${i}×${m / i}=${m}`).join('、')}（角标记最小质因子）`
      : '无新划';
    emit('mark', i, marks, `i=${i}（${kind}）：${mTxt}${bTxt}`, [
      { name: '当前 i', value: `${i}` },
    ]);
  }

  // i=11..15 合并一步（各只划 i×2）
  const tail: number[] = [];
  for (let i = 11; i <= 15; i++) tail.push(...doOuter(i).marks);
  emit(
    'mark',
    null,
    tail,
    `i=11..15：各只划掉 i×2（${tail.join('、')}），都被最小质因子 2 划一次`,
    [{ name: '当前 i', value: '11..15' }],
  );

  // i=16..30 不再划，确认剩余素数
  const restPrimes: number[] = [];
  for (let i = 16; i <= n; i++) {
    const before = primes.length;
    doOuter(i);
    if (primes.length > before) restPrimes.push(i);
  }
  emit(
    'rest',
    null,
    [],
    `i=16..${n}：i×2 已 >${n}，不再划新的；其中没被划的 ${restPrimes.join('、')} 是素数`,
    [{ name: '一次性确认', value: `${restPrimes.length} 个` }],
  );

  emit(
    'done',
    null,
    [],
    `筛完！1..${n} 的素数共 ${primes.length} 个：${primes.join('、')}。每个合数只被它的最小质因子划一次（右下角标），全程无重复划 → 严格 O(N)`,
    [{ name: '素数个数', value: `${primes.length}` }],
  );
  return steps;
}

export const linearSieveModule: AlgorithmModule<LinearSieveExecPoint> = {
  title: '线性筛（欧拉筛）',
  initialInput: () => [],
  buildSteps: () => buildLinearSieveSteps(),
  sources: linearSieveSources,
};
