import type {
  AlgorithmModule,
  GcdExecPoint,
  GcdSquare,
  GcdTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { GCD_A, GCD_B, gcd, gcdSteps, gcdTiling } from './gcd';
import { gcdSources } from './gcd.sources';

/** 固定 gcd(30,18) 辗转相除逐除法步重走，产出矩形铺砖轨胖步骤（GcdView）。
 *  init 原矩形 → 每除法步 cut 切 ⌊a/b⌋ 个正方形、剩余收缩 → done 铺满、最小正方形边长 = gcd。 */
export function buildGcdSteps(): Step<GcdExecPoint>[] {
  const a0 = GCD_A;
  const b0 = GCD_B;
  const steps = gcdSteps();
  const { squares, remainings } = gcdTiling();
  const g = gcd(a0, b0);
  const result: Step<GcdExecPoint>[] = [];

  // 递推链：gcd(30,18)=gcd(18,12)=gcd(12,6)=gcd(6,0)=6
  const chain = [`gcd(${a0},${b0})`, ...steps.map((st) => `gcd(${st.b},${st.r})`)];
  const chainStr = `${chain.join(' = ')} = ${g}`;

  const emit = (
    point: GcdExecPoint,
    gcdTrack: GcdTrack,
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const vars: VarRow[] = [
      { name: '矩形', value: `${a0}×${b0}` },
      { name: '递推', value: chainStr },
      ...extra,
    ];
    result.push({ array: [], pointers: [], emphasis: {}, vars, point, gcd: gcdTrack, caption });
  };

  emit(
    'init',
    { a: a0, b: b0, squares: [], remaining: { x: 0, y: 0, w: a0, h: b0 } },
    `求 gcd(${a0}, ${b0})：把它看成一个 ${a0}×${b0} 的矩形，反复从长边切下能放进去的最大正方形`,
  );

  const shown: GcdSquare[] = [];
  steps.forEach((st, k) => {
    const stepSquares = squares.filter((s) => s.step === k);
    const startIdx = shown.length;
    shown.push(...stepSquares);
    const current = stepSquares.map((_, i) => startIdx + i);
    emit(
      'cut',
      { a: a0, b: b0, squares: [...shown], current, remaining: remainings[k] },
      `${st.a} ÷ ${st.b} = ${st.q} 余 ${st.r}：切下 ${st.q} 个 ${st.b}×${st.b} 正方形${
        st.r === 0 ? '，正好铺满、没有剩余！' : `，剩下 ${st.r}×${st.b} 的小矩形，继续对它切`
      }`,
      [{ name: '当前', value: `gcd(${st.a}, ${st.b})` }],
    );
  });

  emit(
    'done',
    { a: a0, b: b0, squares: [...shown], current: [], remaining: null },
    `铺满了！用到的最小正方形边长 = ${g}，它能整除每一条边——所以 gcd(${a0}, ${b0}) = ${g}`,
    [{ name: 'gcd', value: `${g}` }],
  );
  return result;
}

export const gcdModule: AlgorithmModule<GcdExecPoint> = {
  title: '欧几里得算法（最大公约数）',
  initialInput: () => [],
  buildSteps: () => buildGcdSteps(),
  sources: gcdSources,
};
