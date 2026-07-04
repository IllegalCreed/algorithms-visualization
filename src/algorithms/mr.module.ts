import type {
  AlgorithmModule,
  MatrixTrack,
  MrExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { MR_CASES, mrChain } from './mr';
import { mrSources } from './mr.sources';

const SUP = ['⁰', '¹', '²', '³', '⁴'];

/** 固定双试验（41 真质数 / 561 卡迈克尔伪装者）米勒-拉宾平方链逐格重走，
 *  产出矩阵轨胖步骤（纯复用 MatrixView 第 10 消费者）。 */
export function buildMrSteps(): Step<MrExecPoint>[] {
  const steps: Step<MrExecPoint>[] = [];
  const cells: (number | null)[][] = [
    [null, null, null, null],
    [null, null, null, null],
  ];

  const emit = (
    point: MrExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: ['a^d', '平方¹', '平方²', '平方³'],
      rowLabels: ['41（真质数）', '561（伪装者）'],
      colLabels: ['a^d', '平方¹', '平方²', '平方³'],
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [{ name: '底数', value: 'a = 2' }, ...extra];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    {},
    `大数是不是质数？试除到 √n 太慢；费马测试 a^(n−1)≡1 会被卡迈克尔数骗过。米勒-拉宾在「开平方」处设卡：质数模下 x²≡1 只有 x≡±1 两个解`,
  );

  MR_CASES.forEach(({ n, a }, row) => {
    const r = mrChain(n, a);
    const extra: VarRow[] = [
      { name: 'n', value: `${n}` },
      { name: 'n−1', value: `2^${r.s}·${r.d}` },
    ];

    emit(
      'decomp',
      { active: [row, 0] },
      `试验${row === 0 ? '①' : '②'} n = ${n}：把 n−1 = ${n - 1} 的 2 全部拆出来 → ${n - 1} = 2${SUP[r.s]}·${r.d}（s=${r.s}, d=${r.d}）`,
      extra,
    );

    cells[row][0] = r.chain[0];
    emit(
      'pow',
      { active: [row, 0], updatedCell: [row, 0] },
      `x₀ = ${a}^${r.d} mod ${n} = ${r.chain[0]}${r.chain[0] === 1 || r.chain[0] === n - 1 ? '——直接 ±1，通过' : `——既非 1 也非 −1（${n - 1}），开始连续平方`}`,
      extra,
    );

    for (let i = 1; i < r.chain.length; i++) {
      cells[row][i] = r.chain[i];
      const v = r.chain[i];
      const prev = r.chain[i - 1];
      let note: string;
      if (v === n - 1) note = `= ${n} − 1 ≡ −1——撞到 −1！`;
      else if (v === 1) note = `= 1，可它的前一个是 ${prev}（≠ ±1）——「非平凡平方根」现形！`;
      else note = `既非 1 也非 −1，继续平方`;
      emit(
        'square',
        { active: [row, i], updatedCell: [row, i] },
        `平方${SUP[i]}：${prev}² mod ${n} = ${v}${note}`,
        extra,
      );
    }

    if (r.verdict === 'probable-prime') {
      emit(
        'verdict',
        { sources: [[row, r.chain.length - 1]] },
        `试验①判定：链撞到了 -1（${n - 1}），后续平方全是 1、与质数行为一致 → ${n} 通过本轮测试（试除确认它确实是质数）`,
        extra,
      );
    } else {
      emit(
        'verdict',
        {
          sources: [
            [row, r.chain.length - 2],
            [row, r.chain.length - 1],
          ],
        },
        `试验②判定：${r.chain[r.chain.length - 2]}² ≡ 1 而 ${r.chain[r.chain.length - 2]} ∉ {1, ${n - 1}}——质数模下 x²≡1 只有 ±1 两解，非平凡平方根出现 → ${n} 是合数！（561=3·11·17，费马测试却被 2^560≡1 骗过）`,
        extra,
      );
    }
  });

  emit(
    'done',
    {},
    `一轮测试抓错概率 ≤ 1/4，随机试 k 个底数误报 ≤ 4^(−k)；对 64 位整数试固定底数集即可确定性判素。OpenSSL/RSA 选大质数用的正是它——快速幂做引擎、平方根设卡`,
    [{ name: '误报率', value: '≤ 4^(−k)' }],
  );
  return steps;
}

export const mrModule: AlgorithmModule<MrExecPoint> = {
  title: '米勒-拉宾素性测试',
  initialInput: () => [],
  buildSteps: () => buildMrSteps(),
  sources: mrSources,
};
