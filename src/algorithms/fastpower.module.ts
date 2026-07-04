import type {
  AlgorithmModule,
  PowerBlock,
  PowerExecPoint,
  PowerTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { FP_A, FP_N, fastPow, powBlocks } from './fastpower';
import { fastPowerSources } from './fastpower.sources';

/** 固定 a=3,n=13 快速幂逐位重走，产出幂块轨胖步骤（PowerView）。
 *  init 展示二进制 → 逐位：mul（位=1 底数平方出块+选中+result 乘入）/ skip（位=0 出块不乘）→ done result=aⁿ。 */
export function buildFastPowSteps(): Step<PowerExecPoint>[] {
  const a = FP_A;
  const n = FP_N;
  const binary = n.toString(2);
  const allBlocks = powBlocks();
  const g = fastPow(a, n);
  const steps: Step<PowerExecPoint>[] = [];

  const shown: PowerBlock[] = [];
  let result = 1;

  const selExpSum = allBlocks
    .filter((b) => b.selected)
    .map((b) => b.exp)
    .join('+'); // 1+4+8
  const selProduct = allBlocks
    .filter((b) => b.selected)
    .map((b) => b.value)
    .join(' × '); // 3 × 81 × 6561

  const emit = (
    point: PowerExecPoint,
    current: number | null,
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const power: PowerTrack = {
      a,
      n,
      binary,
      blocks: shown.map((b) => ({ ...b })),
      current,
      result,
      done: point === 'done',
    };
    const vars: VarRow[] = [
      { name: '求', value: `${a}^${n}` },
      { name: '指数二进制', value: `${binary}₂` },
      { name: '结果', value: `${result}` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, power, caption });
  };

  emit(
    'init',
    null,
    `求 ${a}^${n}：把指数 ${n} 写成二进制 ${binary}₂；底数从 ${a} 起反复平方（${a}¹→${a}²→${a}⁴→${a}⁸），位为 1 就把当前平方乘进结果`,
  );

  allBlocks.forEach((b, idx) => {
    shown.push({ ...b });
    if (b.bit === 1) {
      result *= b.value;
      emit(
        'mul',
        idx,
        `第 ${b.k} 位（从低位数）= 1：当前平方 ${a}^${b.exp} = ${b.value} 乘入结果 → ${result}`,
        [{ name: '当前位', value: `第 ${b.k} 位 = 1（乘入）` }],
      );
    } else {
      emit(
        'skip',
        idx,
        `第 ${b.k} 位 = 0：跳过 ${a}^${b.exp} = ${b.value}（不乘），底数继续平方到下一块`,
        [{ name: '当前位', value: `第 ${b.k} 位 = 0（跳过）` }],
      );
    }
  });

  emit(
    'done',
    null,
    `扫完所有位：${a}^${n} = ${a}^(${selExpSum}) = ${selProduct} = ${g}（只用了 ${allBlocks.length} 次平方 + ${allBlocks.filter((b) => b.selected).length} 次乘法）`,
    [{ name: '选中指数和', value: `${selExpSum} = ${n}` }],
  );
  return steps;
}

export const fastPowModule: AlgorithmModule<PowerExecPoint> = {
  title: '快速幂（二进制取幂）',
  initialInput: () => [],
  buildSteps: () => buildFastPowSteps(),
  sources: fastPowerSources,
};
