import type {
  AlgorithmModule,
  MatrixTrack,
  Step,
  StoneExecPoint,
  VarRow,
} from '@/components/player/types';
import { ST_PILES, stonesDp, bruteMerge } from './stones';
import { stoneSources } from './stones.sources';

/** 固定 [4,1,3,2] 区间 DP 逐格重走，产出矩阵轨胖步骤（纯复用 MatrixView 第 11 消费者）。
 *  上三角表：对角 0、len 由短及长逐格填；split 步 sources 黄高亮最优拆分对。 */
export function buildStoneSteps(input: number[]): Step<StoneExecPoint>[] {
  const piles = [...input];
  const n = piles.length;
  const { fills } = stonesDp();
  const steps: Step<StoneExecPoint>[] = [];
  const labels = piles.map((p) => String(p));

  const cells: (number | null)[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : null)),
  );

  const emit = (
    point: StoneExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels,
      rowLabels: labels,
      colLabels: labels,
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [{ name: '石堆', value: `[${piles.join(', ')}]` }, ...extra];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    {},
    `4 堆石子 [${piles.join(', ')}]，每次只能合并相邻两堆、代价 = 两堆之和，求合成一堆的最小总代价。贪心「每次挑最小」会错——用区间 DP：dp[i][j] = 合并第 i..j 堆的最小代价，对角线自己合自己 = 0`,
  );

  for (const f of fills) {
    cells[f.i][f.j] = f.val;
    if (f.len === 2) {
      emit(
        'pair',
        { active: [f.i, f.j], updatedCell: [f.i, f.j] },
        `len=2：第 ${f.i}、${f.j} 堆相邻直合，只有一种方式——dp[${f.i}][${f.j}] = ${piles[f.i]} + ${piles[f.j]} = ${f.val}`,
        [
          { name: '区间', value: `[${f.i}, ${f.j}]` },
          { name: 'dp', value: `${f.val}` },
        ],
      );
    } else {
      const candTxt = f.cands.map((c) => `k=${c.k}：${c.cost}`).join('、');
      emit(
        'split',
        {
          active: [f.i, f.j],
          updatedCell: [f.i, f.j],
          sources: [
            [f.i, f.bestK],
            [f.bestK + 1, f.j],
          ],
        },
        `len=${f.len}：dp[${f.i}][${f.j}] 枚举分割点（${candTxt}）取小 → 最优 k=${f.bestK}（黄格 dp[${f.i}][${f.bestK}]+dp[${f.bestK + 1}][${f.j}]），再加本次合并代价 sum=${f.sum}：${f.val - f.sum} + ${f.sum} = ${f.val}`,
        [
          { name: '区间', value: `[${f.i}, ${f.j}]` },
          { name: '最优 k', value: `${f.bestK}` },
          { name: 'dp', value: `${f.val}` },
        ],
      );
    }
  }

  emit(
    'done',
    { active: [0, n - 1] },
    `dp[0][${n - 1}] = 20（暴力枚举全部合并顺序同为 ${bruteMerge()}）。区间 DP 范式：区间由短及长、枚举分割点，O(n³)；环形版拆环成链翻倍，四边形不等式可优化到 O(n²)`,
    [{ name: '复杂度', value: 'O(n³)' }],
  );
  return steps;
}

export const stoneModule: AlgorithmModule<StoneExecPoint> = {
  title: '石子合并（区间 DP）',
  initialInput: () => [...ST_PILES],
  buildSteps: (input) => buildStoneSteps(input),
  sources: stoneSources,
};
