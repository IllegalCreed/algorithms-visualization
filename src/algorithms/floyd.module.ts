import type {
  AlgorithmModule,
  FloydExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { FLOYD_LABELS, FLOYD_N, floydInitMatrix } from './floyd';
import { floydSources } from './floyd.sources';

/** 固定 4 点有向带权图，Floyd 三重循环细粒度重走（只对候选单元出步），产出矩阵轨胖步骤 */
export function buildFloydSteps(): Step<FloydExecPoint>[] {
  const n = FLOYD_N;
  const labels = FLOYD_LABELS;
  const cells = floydInitMatrix();

  const steps: Step<FloydExecPoint>[] = [];
  let updated = 0;
  const snapshot = () => cells.map((row) => [...row]);
  const matrix = (opts: {
    pivot?: number | null;
    active?: [number, number] | null;
    sources?: [number, number][];
    updatedCell?: [number, number] | null;
  }): MatrixTrack => ({
    labels: [...labels],
    cells: snapshot(),
    pivot: opts.pivot ?? null,
    active: opts.active ?? null,
    sources: opts.sources ?? [],
    updatedCell: opts.updatedCell ?? null,
  });
  const vars = (k: number | string, extra: VarRow[] = []): VarRow[] => [
    { name: 'n', value: n },
    { name: '中转 k', value: typeof k === 'number' ? labels[k] : k },
    ...extra,
    { name: '已更新', value: updated },
  ];
  const emit = (point: FloydExecPoint, m: MatrixTrack, v: VarRow[], caption: string) => {
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: v,
      point,
      graph: undefined,
      matrix: m,
      caption,
    });
  };

  emit('init', matrix({}), vars('-'), `距离矩阵初始化为邻接矩阵（对角 0，有边取权，其余 ∞）`);

  for (let k = 0; k < n; k++) {
    emit(
      'pivotStart',
      matrix({ pivot: k }),
      vars(k),
      `以 ${labels[k]} 为中转点：看谁「经 ${labels[k]}」更短（高亮第 ${labels[k]} 行/列）`,
    );
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === k || j === k || i === j) continue;
        if (cells[i][k] === null || cells[k][j] === null) continue; // 无「经 k」的路 → 不必比较
        const via = cells[i][k]! + cells[k][j]!;
        const cur = cells[i][j];
        const sources: [number, number][] = [
          [i, k],
          [k, j],
        ];
        const detail: VarRow[] = [
          { name: '当前 (i,j)', value: `${labels[i]}→${labels[j]}` },
          {
            name: '比较',
            value: `${labels[i]}→${labels[k]}→${labels[j]} = ${via} vs ${cur === null ? '∞' : cur}`,
          },
        ];
        if (cur === null || via < cur) {
          cells[i][j] = via;
          updated++;
          emit(
            'relaxUpdate',
            matrix({ pivot: k, active: [i, j], sources, updatedCell: [i, j] }),
            vars(k, detail),
            `更短！${labels[i]}→${labels[j]} 更新为 ${via}（经 ${labels[k]} 中转）`,
          );
        } else {
          emit(
            'relaxSkip',
            matrix({ pivot: k, active: [i, j], sources }),
            vars(k, detail),
            `经 ${labels[k]} 不更短（${via} ≥ ${cur}），保持`,
          );
        }
      }
    }
  }

  emit('done', matrix({}), vars('done'), `三重循环完成，全源最短距离矩阵已定`);
  return steps;
}

export const floydModule: AlgorithmModule<FloydExecPoint> = {
  title: 'Floyd-Warshall 多源最短路',
  initialInput: () => [],
  buildSteps: () => buildFloydSteps(),
  sources: floydSources,
};
