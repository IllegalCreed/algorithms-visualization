import type {
  AlgorithmModule,
  CoinChangeExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { COINS, COIN_AMOUNT } from './coinchange';
import { coinChangeSources } from './coinchange.sources';

/** 固定硬币 + 金额二维计数 DP 逐格重走，产出矩阵轨胖步骤（纯复用 MatrixView，行=硬币/列=金额）。
 *  与完全背包同构：来源同为本行 dp[i][a-面额]，唯算子由 max 改为「方案数相加」、边界 dp[0][0]=1。 */
export function buildCoinChangeSteps(): Step<CoinChangeExecPoint>[] {
  const m = COINS.length;
  const W = COIN_AMOUNT;
  const rowLabels = ['∅', ...COINS.map(String)]; // ∅ 1 2 5
  const colLabels = Array.from({ length: W + 1 }, (_, a) => String(a)); // 0..5

  const cells: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: W + 1 }, () => null as number | null),
  );

  const steps: Step<CoinChangeExecPoint>[] = [];
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
    { name: '硬币', value: COINS.join(',') },
    { name: '金额', value: W },
    ...extra,
  ];
  const emit = (point: CoinChangeExecPoint, mt: MatrixTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, matrix: mt, caption });
  };

  // 边界：dp[0][0]=1（凑 0 元 1 种），第 0 行其余 = 0
  cells[0][0] = 1;
  for (let a = 1; a <= W; a++) cells[0][a] = 0;
  emit(
    'init',
    matrix({ active: [0, 0], updatedCell: [0, 0] }),
    vars(),
    `边界：凑出金额 0 只有 1 种方案（什么硬币都不选）→ dp[0][0]=1；第 0 行其余金额都凑不出，为 0`,
  );

  for (let i = 1; i <= m; i++) {
    const c = COINS[i - 1];
    for (let a = 0; a <= W; a++) {
      if (c > a) {
        cells[i][a] = cells[i - 1][a];
        emit(
          'skip',
          matrix({ active: [i, a], sources: [[i - 1, a]], updatedCell: [i, a] }),
          vars([
            { name: '当前', value: `硬币 ${c}，金额 ${a}` },
            { name: '判断', value: `面额 ${c} > 金额 ${a}，用不了 → 沿用上一行 = ${cells[i][a]}` },
          ]),
          `硬币 ${c} 比金额 ${a} 大，用不了：沿用上一行 = ${cells[i][a]}`,
        );
      } else {
        const notUse = cells[i - 1][a] as number;
        const useOne = cells[i][a - c] as number;
        cells[i][a] = notUse + useOne;
        emit(
          'add',
          matrix({
            active: [i, a],
            sources: [
              [i - 1, a],
              [i, a - c],
            ],
            updatedCell: [i, a],
          }),
          vars([
            { name: '当前', value: `硬币 ${c}，金额 ${a}` },
            {
              name: '方案数',
              value: `不用=${notUse} + 用一枚(本行[${a - c}])=${useOne} = ${cells[i][a]}`,
            },
          ]),
          `硬币 ${c} 用得上：方案数 = 不用 ${notUse} + 用一枚 ${useOne} = ${cells[i][a]}`,
        );
      }
    }
  }

  emit(
    'done',
    matrix({ active: [m, W] }),
    vars([{ name: '总方案数', value: cells[m][W] as number }]),
    `填完！右下角 = 凑出金额 ${W} 的方案数 = ${cells[m][W]}（1×5、1×3+2、1+2×2、5）`,
  );
  return steps;
}

export const coinChangeModule: AlgorithmModule<CoinChangeExecPoint> = {
  title: '硬币找零方案数',
  initialInput: () => [],
  buildSteps: () => buildCoinChangeSteps(),
  sources: coinChangeSources,
};
