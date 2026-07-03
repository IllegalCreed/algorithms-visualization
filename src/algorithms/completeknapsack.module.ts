import type {
  AlgorithmModule,
  KnapsackExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { ITEM_LABELS, WEIGHTS, VALUES, CAPACITY } from './completeknapsack';
import { completeKnapsackSources } from './completeknapsack.sources';

/** 固定物品 + 容量二维 DP 逐格重走，产出矩阵轨胖步骤（纯复用 MatrixView + KnapsackExecPoint，行=物品/列=容量）。
 *  与 0-1 唯一差别：cellChoose 的「取」来源在本行 dp[i][w-wt]（同一物品可重复取）。 */
export function buildCompleteKnapsackSteps(): Step<KnapsackExecPoint>[] {
  const m = ITEM_LABELS.length;
  const W = CAPACITY;
  const rowLabels = ['∅', ...ITEM_LABELS]; // ∅ A B C
  const colLabels = Array.from({ length: W + 1 }, (_, w) => String(w)); // 0..6

  // cells：(m+1)×(W+1)，未填为 null；第 0 行/列 = 0（边界）
  const cells: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: W + 1 }, () => null as number | null),
  );
  for (let w = 0; w <= W; w++) cells[0][w] = 0;
  for (let i = 0; i <= m; i++) cells[i][0] = 0;

  const steps: Step<KnapsackExecPoint>[] = [];
  const snapshot = () => cells.map((row) => [...row]);
  const matrix = (opts: {
    active?: [number, number] | null;
    sources?: [number, number][];
    updatedCell?: [number, number] | null;
  }): MatrixTrack => ({
    labels: colLabels,
    rowLabels,
    colLabels,
    emptyText: '',
    cells: snapshot(),
    active: opts.active ?? null,
    sources: opts.sources ?? [],
    updatedCell: opts.updatedCell ?? null,
  });
  const vars = (extra: VarRow[] = []): VarRow[] => [
    { name: '容量', value: W },
    {
      name: '物品',
      value: ITEM_LABELS.map((l, k) => `${l}(重${WEIGHTS[k]},值${VALUES[k]})`).join(' '),
    },
    ...extra,
  ];
  const emit = (point: KnapsackExecPoint, mt: MatrixTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, matrix: mt, caption });
  };

  emit(
    'init',
    matrix({}),
    vars(),
    `边界：没有物品（第 0 行）或容量为 0（第 0 列）时，最大价值都是 0`,
  );

  for (let i = 1; i <= m; i++) {
    const wt = WEIGHTS[i - 1];
    const val = VALUES[i - 1];
    const label = ITEM_LABELS[i - 1];
    for (let w = 1; w <= W; w++) {
      if (wt > w) {
        cells[i][w] = cells[i - 1][w];
        emit(
          'cellSkip',
          matrix({ active: [i, w], sources: [[i - 1, w]], updatedCell: [i, w] }),
          vars([
            { name: '当前', value: `物品 ${label}(重${wt},值${val})，容量 ${w}` },
            { name: '判断', value: `重 ${wt} > 容量 ${w}，装不下 → 沿用上一行 = ${cells[i][w]}` },
          ]),
          `${label} 重 ${wt} 装不下容量 ${w}：沿用上一行 = ${cells[i][w]}`,
        );
      } else {
        const skip = cells[i - 1][w] as number;
        // 完全背包：「取」来自本行 cells[i][w-wt]（0-1 是 cells[i-1][w-wt]）——取完还能再取同一件
        const take = (cells[i][w - wt] as number) + val;
        cells[i][w] = Math.max(skip, take);
        emit(
          'cellChoose',
          matrix({
            active: [i, w],
            sources: [
              [i - 1, w],
              [i, w - wt],
            ],
            updatedCell: [i, w],
          }),
          vars([
            { name: '当前', value: `物品 ${label}(重${wt},值${val})，容量 ${w}` },
            {
              name: '取舍',
              value: `max(不取=${skip}, 取=本行[${w - wt}]${cells[i][w - wt]}+${val}=${take}) = ${cells[i][w]}`,
            },
          ]),
          `${label} 装得下：max(不取 ${skip}, 取本行 ${take}) = ${cells[i][w]}（取完可再取 ${label}）`,
        );
      }
    }
  }

  emit(
    'done',
    matrix({ active: [m, W] }),
    vars([{ name: '最优值', value: cells[m][W] as number }]),
    `填完！右下角 = 最大价值 = ${cells[m][W]}（A 拿 3 次：重 2×3=6、值 5×3=15；同样物品若按 0-1 只能拿 12）`,
  );
  return steps;
}

export const completeKnapsackModule: AlgorithmModule<KnapsackExecPoint> = {
  title: '完全背包',
  initialInput: () => [],
  buildSteps: () => buildCompleteKnapsackSteps(),
  sources: completeKnapsackSources,
};
