import type {
  AlgorithmModule,
  PhiExecPoint,
  SieveCellState,
  SieveTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { PHI_N, PHI_COLS, phiFormula, phiCrossSets } from './phi';
import { phiSources } from './phi.sources';

/** 固定 n=12 互质筛逐质因子重走，产出数字网格轨胖步骤（纯复用 SieveView 第 3 消费者）。
 *  find（试除找到质因子 p）→ cross（划掉 p 的倍数、res·(1−1/p) 记账）→ survive（幸存者=互质，绿）。 */
export function buildPhiSteps(): Step<PhiExecPoint>[] {
  const n = PHI_N;
  const { factors } = phiFormula(n);
  const { crosses, survivors } = phiCrossSets();
  const states: SieveCellState[] = new Array<SieveCellState>(n + 1).fill('unknown');
  const steps: Step<PhiExecPoint>[] = [];

  const emit = (
    point: PhiExecPoint,
    current: number | null,
    marking: number[],
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const sieve: SieveTrack = { n, cols: PHI_COLS, states: [...states], current, marking };
    const vars: VarRow[] = [
      { name: 'n', value: `${n} = 2²·3` },
      { name: '目标', value: `φ(${n}) = 与 ${n} 互质的个数` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, sieve, caption });
  };

  emit(
    'init',
    null,
    [],
    `数 1..${n} 里有几个与 ${n} 互质？${n} = 2²·3，蓝图：把含质因子 2 或 3 的数全划掉，幸存者就是互质的——每个质因子按比例划，正是 φ(n) = n·∏(1−1/p)`,
    [{ name: 'res', value: `${n}` }],
  );

  let resBefore = n;
  crosses.forEach((c, k) => {
    emit(
      'find',
      c.p,
      [],
      `试除找质因子：${c.p} 整除 ${n} → 第 ${k + 1} 个质因子 p = ${c.p}（除尽 ${c.p} 的幂后继续试）`,
      [
        { name: 'res', value: `${resBefore}` },
        { name: '当前 p', value: `${c.p}` },
      ],
    );

    for (const v of c.newly) states[v] = 'composite';
    const ratio = c.p === 2 ? '一半' : `每 ${c.p} 个中的 1 个`;
    emit(
      'cross',
      c.p,
      c.newly,
      `划掉 ${c.p} 的倍数（${ratio}${k > 0 ? '，已划过的不重复算' : ''}）：${c.newly.join('、')}。记账 res = ${resBefore}·(1−1/${c.p}) = ${c.resAfter}`,
      [
        { name: 'res', value: `${resBefore} → ${c.resAfter}` },
        { name: '当前 p', value: `${c.p}` },
      ],
    );
    resBefore = c.resAfter;
  });

  for (const v of survivors) states[v] = 'prime';
  emit(
    'survive',
    null,
    [],
    `幸存者 ${survivors.join('、')} 与 ${n} 互质（注意 1 也算）——恰好 ${survivors.length} 个，等于记账结果 ${n}·(1/2)·(2/3) = ${survivors.length}`,
    [{ name: 'φ(12)', value: `${survivors.length}` }],
  );

  emit(
    'done',
    null,
    [],
    `φ(12) = 4。公式 φ(n) = n·∏(1−1/p) 只看不同质因子；欧拉定理 a^φ(n) ≡ 1 (mod n)（gcd(a,n)=1）给模幂的指数打折，RSA 的 φ(pq) = (p−1)(q−1) 正是私钥 d ≡ e⁻¹ (mod φ) 的舞台`,
    [
      { name: 'φ(12)', value: '4' },
      { name: '因子', value: factors.join(', ') },
    ],
  );
  return steps;
}

export const phiModule: AlgorithmModule<PhiExecPoint> = {
  title: '欧拉函数（互质筛）',
  initialInput: () => [],
  buildSteps: () => buildPhiSteps(),
  sources: phiSources,
};
