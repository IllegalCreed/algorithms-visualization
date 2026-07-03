import type {
  AlgorithmModule,
  EditDistExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { SOURCE, TARGET } from './editdist';
import { editDistSources } from './editdist.sources';

/** 固定两串（SAT→SUN）二维 DP 逐格重走，产出矩阵轨胖步骤（复用 MatrixView，DP 大类首发） */
export function buildEditDistSteps(): Step<EditDistExecPoint>[] {
  const m = SOURCE.length;
  const n = TARGET.length;
  const rowLabels = ['∅', ...SOURCE.split('')]; // ∅ S A T
  const colLabels = ['∅', ...TARGET.split('')]; // ∅ S U N

  // cells：(m+1)×(n+1)，未填为 null
  const cells: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => null as number | null),
  );
  for (let j = 0; j <= n; j++) cells[0][j] = j;
  for (let i = 0; i <= m; i++) cells[i][0] = i;

  const steps: Step<EditDistExecPoint>[] = [];
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
    { name: '源串', value: SOURCE },
    { name: '目标串', value: TARGET },
    ...extra,
  ];
  const emit = (point: EditDistExecPoint, mt: MatrixTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, matrix: mt, caption });
  };

  emit(
    'init',
    matrix({}),
    vars(),
    `边界：空串变成前 j 个字符需插 j 次（第 0 行）；前 i 个变成空串需删 i 次（第 0 列）`,
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const sc = SOURCE[i - 1];
      const tc = TARGET[j - 1];
      if (sc === tc) {
        cells[i][j] = cells[i - 1][j - 1];
        emit(
          'cellMatch',
          matrix({ active: [i, j], sources: [[i - 1, j - 1]], updatedCell: [i, j] }),
          vars([
            { name: '比较', value: `${sc} = ${tc}（相同）` },
            { name: '取值', value: `左上 dp[${i - 1}][${j - 1}] = ${cells[i][j]}` },
          ]),
          `${sc}=${tc}，不用编辑：取左上 = ${cells[i][j]}`,
        );
      } else {
        const diag = cells[i - 1][j - 1] as number;
        const up = cells[i - 1][j] as number;
        const left = cells[i][j - 1] as number;
        cells[i][j] = 1 + Math.min(diag, up, left);
        emit(
          'cellDiff',
          matrix({
            active: [i, j],
            sources: [
              [i - 1, j - 1],
              [i - 1, j],
              [i, j - 1],
            ],
            updatedCell: [i, j],
          }),
          vars([
            { name: '比较', value: `${sc} ≠ ${tc}（不同）` },
            { name: '取值', value: `1 + min(左上 ${diag}, 上 ${up}, 左 ${left}) = ${cells[i][j]}` },
          ]),
          `${sc}≠${tc}：1 + 三邻居最小(${diag},${up},${left}) = ${cells[i][j]}`,
        );
      }
    }
  }

  emit(
    'done',
    matrix({ active: [m, n] }),
    vars([{ name: '编辑距离', value: cells[m][n] as number }]),
    `填完！右下角 = 编辑距离 = ${cells[m][n]}（${SOURCE}→${TARGET}）`,
  );
  return steps;
}

export const editDistModule: AlgorithmModule<EditDistExecPoint> = {
  title: '编辑距离',
  initialInput: () => [],
  buildSteps: () => buildEditDistSteps(),
  sources: editDistSources,
};
