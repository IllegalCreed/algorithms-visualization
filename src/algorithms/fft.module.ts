import type {
  AlgorithmModule,
  Comparator,
  FftExecPoint,
  NetworkTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { FFT_N, fftTrace } from './fft';
import { fftSources } from './fft.sources';

// 蝶形网络（固定）：col0 L=2 相邻对；col1 L=4 跨 2；col2 L=8 跨 4；tag = 旋转因子（ω ≡ ω₈）
const BUTTERFLIES: Comparator[] = [
  { col: 0, a: 0, b: 1, dir: 'asc', tag: '×1' },
  { col: 0, a: 2, b: 3, dir: 'asc', tag: '×1' },
  { col: 0, a: 4, b: 5, dir: 'asc', tag: '×1' },
  { col: 0, a: 6, b: 7, dir: 'asc', tag: '×1' },
  { col: 1, a: 0, b: 2, dir: 'asc', tag: '×1' },
  { col: 1, a: 1, b: 3, dir: 'asc', tag: '×ω²' },
  { col: 1, a: 4, b: 6, dir: 'asc', tag: '×1' },
  { col: 1, a: 5, b: 7, dir: 'asc', tag: '×ω²' },
  { col: 2, a: 0, b: 4, dir: 'asc', tag: '×1' },
  { col: 2, a: 1, b: 5, dir: 'asc', tag: '×ω' },
  { col: 2, a: 2, b: 6, dir: 'asc', tag: '×ω²' },
  { col: 2, a: 3, b: 7, dir: 'asc', tag: '×ω³' },
];

/** 固定 8 点输入的迭代 FFT 重放，产出比较器网络轨胖步骤（复用 NetworkView 第 2 消费者，additive 蝶形）。
 *  位反转重排 + 三层蝶形逐层执行；线值为复数字符串（wireLabels），ω 因子标注在蝶形旁（tag）。 */
export function buildFftSteps(): Step<FftExecPoint>[] {
  const { input, rev, layers } = fftTrace();
  const steps: Step<FftExecPoint>[] = [];

  const emit = (
    point: FftExecPoint,
    labels: string[],
    o: { col?: number | null; done?: boolean },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const network: NetworkTrack = {
      wires: new Array(FFT_N).fill(0),
      wireLabels: [...labels],
      comparators: BUTTERFLIES,
      cols: 3,
      currentCol: o.col ?? null,
      done: o.done ?? false,
    };
    steps.push({ array: [], pointers: [], emphasis: {}, vars: extra, point, network, caption });
  };

  emit(
    'init',
    input.map((v) => `${v}`),
    {},
    `多项式乘法的困境：系数表示下乘法是卷积 O(n²)；换成「点值表示」（在 n 个点上的取值）乘法只要逐点相乘 O(n)——贵在取点值（DFT）本身。FFT 的妙招：取样点用单位根 ω 的幂（ω = e^(-2πi/8)），它的对称性能把变换反复对折。输入：1+2x+3x²+4x³ 补零到 8 点`,
    [
      { name: '输入', value: '[1, 2, 3, 4, 0, 0, 0, 0]' },
      { name: '目标', value: '8 点 DFT，只用 O(n log n)' },
    ],
  );

  emit(
    'bitrev',
    layers[0],
    {},
    `先重排：递归视角是「偶数位一组、奇数位一组」层层往下分；把递归展平成迭代，第 i 线该放 a[位反转(i)]——下标 [${rev.join(', ')}]。重排后蝶形就能全程「相邻块合并」`,
    [{ name: '位反转', value: '000↔000, 001↔100, 010↔010, 011↔110…' }],
  );

  const OMEGA: [string, string][] = [
    ['L=2', '相邻两线配对，旋转因子全为 ×1'],
    ['L=4', '跨度 2 配对，因子 {×1, ×ω²}（ω² = −i）'],
    ['L=8', '跨度 4 配对，因子 {×1, ×ω, ×ω², ×ω³}'],
  ];
  const EXAMPLES = [
    `4 组并行：例 (1, 0) → (1+0, 1−0) = (1, 1)。合并后每段长 2，都是「2 点 DFT」`,
    `例第 1、3 线：u=1、v=3×(−i)=−3i → (1−3i, 1+3i)——复数登场！每段长 4，都是「4 点 DFT」`,
    `最后一层把两个 4 点 DFT 合成 8 点：例第 1、5 线 u=1-3i、v=(2-4i)×ω → 得 -0.41-7.24i 等。完成！`,
  ];
  for (let layer = 0; layer < 3; layer++) {
    emit(
      'twiddle',
      layers[layer],
      { col: layer },
      `第 ${layer + 1} 层（${OMEGA[layer][0]}）：${OMEGA[layer][1]}。蝶形公式：(u, v) → (u + ωv, u − ωv)——一次乘法同时得到「和」与「差」两个点值，这就是对折的省法`,
      [{ name: '本层', value: `${OMEGA[layer][0]}，4 个蝶形并行` }],
    );
    emit(
      'butterfly',
      layers[layer + 1],
      { col: layer },
      `执行第 ${layer + 1} 层：${EXAMPLES[layer]}`,
      [{ name: '输出', value: `[${layers[layer + 1].slice(0, 4).join(', ')}, …]` }],
    );
  }

  emit(
    'done',
    layers[3],
    { done: true },
    `8 点 DFT 完成（与按定义直算逐项全等），3 层 × 4 蝶形 = O(n log n)，对比逐点取值 O(n²)。乘法三部曲：两多项式各做 DFT → 点值逐点相乘 → IDFT 变回系数（ω 换共轭再除 n，同一套蝶形）。要精确整数则用模数域的孪生版 NTT（原根替代 ω）`,
    [
      { name: 'DFT', value: `[${layers[3].slice(0, 3).join(', ')}, …]` },
      { name: '复杂度', value: 'O(n log n)（直算 DFT O(n²)）' },
    ],
  );
  return steps;
}

export const fftModule: AlgorithmModule<FftExecPoint> = {
  title: 'FFT（快速傅里叶变换·蝶形网络）',
  initialInput: () => [],
  buildSteps: () => buildFftSteps(),
  sources: fftSources,
};
