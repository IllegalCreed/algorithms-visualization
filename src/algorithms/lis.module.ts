import type {
  AlgorithmModule,
  LisExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { LIS_INPUT } from './lis';
import { lisSources } from './lis.sources';

/** 固定输入 [1,3,2,4,3,5] 一维 DP 逐格重走（值行 + dp 行两行表），复用 MatrixView 零改动 */
export function buildLisSteps(): Step<LisExecPoint>[] {
  const a = LIS_INPUT;
  const n = a.length;
  const rowLabels = ['值', 'dp'];
  const colLabels = a.map((_, i) => String(i));
  const dp = Array<number>(n).fill(1);
  const pred = Array<number>(n).fill(-1);

  const steps: Step<LisExecPoint>[] = [];
  const matrix = (opts: {
    active?: [number, number] | null;
    sources?: [number, number][];
    updatedCell?: [number, number] | null;
    pathCells?: [number, number][];
  }): MatrixTrack => ({
    labels: colLabels,
    rowLabels,
    colLabels,
    cells: [a.map((v) => v as number | null), dp.map((v) => v as number | null)],
    active: opts.active ?? null,
    sources: opts.sources ?? [],
    updatedCell: opts.updatedCell ?? null,
    pathCells: opts.pathCells ?? [],
  });
  const vars = (extra: VarRow[] = []): VarRow[] => [
    { name: '输入', value: a.join(' ') },
    { name: 'dp', value: dp.join(' ') },
    ...extra,
  ];
  const emit = (point: LisExecPoint, mt: MatrixTrack, v: VarRow[], caption: string) => {
    steps.push({ array: [], pointers: [], emphasis: {}, vars: v, point, matrix: mt, caption });
  };

  emit('init', matrix({}), vars(), `每个元素自身是长度 1 的递增子序列：dp 全部初始化为 1`);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const canExtend = a[j] < a[i] && dp[j] + 1 > dp[i];
      const src: [number, number][] = [
        [0, i],
        [0, j],
        [1, j],
      ];
      if (canExtend) {
        dp[i] = dp[j] + 1;
        pred[i] = j;
        emit(
          'extend',
          matrix({ active: [1, i], sources: src, updatedCell: [1, i] }),
          vars([
            { name: '当前 i', value: `a[${i}]=${a[i]}` },
            { name: '回看 j', value: `a[${j}]=${a[j]}` },
          ]),
          `a[${j}]=${a[j]} < a[${i}]=${a[i]} 且能变长 → dp[${i}] = dp[${j}]+1 = ${dp[i]}`,
        );
      } else {
        emit(
          'scan',
          matrix({ active: [1, i], sources: src }),
          vars([
            { name: '当前 i', value: `a[${i}]=${a[i]}` },
            { name: '回看 j', value: `a[${j}]=${a[j]}` },
          ]),
          a[j] >= a[i]
            ? `a[${j}]=${a[j]} ≥ a[${i}]=${a[i]}：接不上，跳过`
            : `a[${j}]<a[${i}] 但 dp[${j}]+1=${dp[j] + 1} 不比 dp[${i}]=${dp[i]} 大：跳过`,
        );
      }
    }
  }

  let best = 0;
  for (let i = 1; i < n; i++) if (dp[i] > dp[best]) best = i;
  emit(
    'fillDone',
    matrix({ active: [1, best] }),
    vars([{ name: 'LIS 长度', value: dp[best] }]),
    `dp 填完，最大 dp = ${dp[best]} = LIS 长度（在 a[${best}]=${a[best]} 结尾）`,
  );

  const idx: number[] = [];
  let cur = best;
  while (cur !== -1) {
    idx.unshift(cur);
    cur = pred[cur];
  }
  const vals = idx.map((i) => a[i]);
  emit(
    'result',
    matrix({ pathCells: idx.map((i) => [0, i] as [number, number]) }),
    vars([
      { name: 'LIS', value: vals.join('→') },
      { name: '长度', value: vals.length },
    ]),
    `回溯 pred 恢复：最长递增子序列 LIS = ${vals.join('→')}（长度 ${vals.length}）`,
  );
  return steps;
}

export const lisModule: AlgorithmModule<LisExecPoint> = {
  title: '最长递增子序列',
  initialInput: () => [],
  buildSteps: () => buildLisSteps(),
  sources: lisSources,
};
