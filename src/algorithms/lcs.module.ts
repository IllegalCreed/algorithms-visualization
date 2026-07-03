import type {
  AlgorithmModule,
  LcsExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { LCS_X, LCS_Y } from './lcs';
import { lcsSources } from './lcs.sources';

/** 固定两串（ABCD / ACDF）二维 DP 填表 + 回溯恢复解，产出矩阵轨胖步骤（复用 + 扩展 MatrixView pathCells） */
export function buildLcsSteps(): Step<LcsExecPoint>[] {
  const m = LCS_X.length;
  const n = LCS_Y.length;
  const rowLabels = ['∅', ...LCS_X.split('')]; // ∅ A B C D
  const colLabels = ['∅', ...LCS_Y.split('')]; // ∅ A C D F

  const cells: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => null as number | null),
  );
  for (let j = 0; j <= n; j++) cells[0][j] = 0;
  for (let i = 0; i <= m; i++) cells[i][0] = 0;

  const steps: Step<LcsExecPoint>[] = [];
  const snapshot = () => cells.map((row) => [...row]);
  const matrix = (opts: {
    active?: [number, number] | null;
    sources?: [number, number][];
    updatedCell?: [number, number] | null;
    pathCells?: [number, number][];
  }): MatrixTrack => ({
    labels: colLabels,
    rowLabels,
    colLabels,
    emptyText: '',
    cells: snapshot(),
    active: opts.active ?? null,
    sources: opts.sources ?? [],
    updatedCell: opts.updatedCell ?? null,
    pathCells: opts.pathCells ?? [],
  });
  const vars = (extra: VarRow[] = []): VarRow[] => [
    { name: '串 X', value: LCS_X },
    { name: '串 Y', value: LCS_Y },
    ...extra,
  ];
  const emit = (point: LcsExecPoint, mt: MatrixTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, matrix: mt, caption });
  };

  emit('init', matrix({}), vars(), `边界：空串与任何串的 LCS 长度为 0（第 0 行 / 第 0 列全 0）`);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const xc = LCS_X[i - 1];
      const yc = LCS_Y[j - 1];
      if (xc === yc) {
        cells[i][j] = (cells[i - 1][j - 1] as number) + 1;
        emit(
          'match',
          matrix({ active: [i, j], sources: [[i - 1, j - 1]], updatedCell: [i, j] }),
          vars([
            { name: '比较', value: `${xc} = ${yc}（相同）` },
            { name: '取值', value: `左上 dp[${i - 1}][${j - 1}] + 1 = ${cells[i][j]}` },
          ]),
          `${xc}=${yc}：公共子序列 + 1，取左上 + 1 = ${cells[i][j]}`,
        );
      } else {
        const up = cells[i - 1][j] as number;
        const left = cells[i][j - 1] as number;
        cells[i][j] = Math.max(up, left);
        emit(
          'mismatch',
          matrix({
            active: [i, j],
            sources: [
              [i - 1, j],
              [i, j - 1],
            ],
            updatedCell: [i, j],
          }),
          vars([
            { name: '比较', value: `${xc} ≠ ${yc}（不同）` },
            { name: '取值', value: `max(上 ${up}, 左 ${left}) = ${cells[i][j]}` },
          ]),
          `${xc}≠${yc}：丢一个字符，取 max(上 ${up}, 左 ${left}) = ${cells[i][j]}`,
        );
      }
    }
  }

  emit(
    'fillDone',
    matrix({ active: [m, n] }),
    vars([{ name: 'LCS 长度', value: cells[m][n] as number }]),
    `填完！右下角 = LCS 长度 = ${cells[m][n]}；接下来从右下角回溯恢复出 LCS`,
  );

  // 回溯：从右下角回走，匹配收字符走对角，否则往大的上/左走
  let i = m;
  let j = n;
  const path: [number, number][] = [];
  let lcs = '';
  while (i > 0 && j > 0) {
    path.push([i, j]);
    const xc = LCS_X[i - 1];
    const yc = LCS_Y[j - 1];
    if (xc === yc) {
      lcs = xc + lcs;
      emit(
        'trace',
        matrix({ active: [i, j], pathCells: [...path], sources: [[i - 1, j - 1]] }),
        vars([
          { name: '回溯', value: `(${i},${j}) ${xc}=${yc} 匹配` },
          { name: '已恢复', value: lcs },
        ]),
        `回走 (${i},${j})：${xc}=${yc} 匹配 → 收进 LCS「${lcs}」，走左上对角`,
      );
      i--;
      j--;
    } else {
      const up = cells[i - 1][j] as number;
      const left = cells[i][j - 1] as number;
      const dir = up >= left ? '上' : '左';
      emit(
        'trace',
        matrix({ active: [i, j], pathCells: [...path] }),
        vars([
          { name: '回溯', value: `(${i},${j}) ${xc}≠${yc}` },
          { name: '已恢复', value: lcs || '（空）' },
        ]),
        `回走 (${i},${j})：${xc}≠${yc}，往较大的${dir}走`,
      );
      if (up >= left) i--;
      else j--;
    }
  }

  emit(
    'done',
    matrix({ pathCells: [...path] }),
    vars([
      { name: 'LCS', value: lcs },
      { name: '长度', value: lcs.length },
    ]),
    `回溯完成：最长公共子序列 LCS = ${lcs}（长度 ${lcs.length}）`,
  );
  return steps;
}

export const lcsModule: AlgorithmModule<LcsExecPoint> = {
  title: '最长公共子序列',
  initialInput: () => [],
  buildSteps: () => buildLcsSteps(),
  sources: lcsSources,
};
