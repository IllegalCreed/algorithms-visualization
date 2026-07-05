import type {
  AlgorithmModule,
  MatrixTrack,
  RerootExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { RR_N, rerootTrace, bruteDist } from './reroot';
import { rerootSources } from './reroot.sources';

const ROW_LABELS = ['0·根', '1·L', '2·R', '3·LL', '4·LR'];
const POS = ['根 0', 'L 1', 'R 2', 'LL 3', 'LR 4'];

/** 固定 5 节点树的换根 DP 二次扫描重放，产出矩阵轨胖步骤（纯复用 MatrixView 第 15 消费者）。
 *  第一趟后序填 size/down（孩子四格黄）；root 收官 ans[0]=down[0]；第二趟前序换根公式逐项代入。 */
export function buildRerootSteps(): Step<RerootExecPoint>[] {
  const { downFills, reroots, ans } = rerootTrace();
  const steps: Step<RerootExecPoint>[] = [];

  const cells: (number | null)[][] = Array.from({ length: RR_N }, () => [null, null, null]);

  const emit = (
    point: RerootExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: ['size', 'down', 'ans'],
      rowLabels: ROW_LABELS,
      colLabels: ['size', 'down', 'ans'],
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [{ name: '树', value: '0 根；1,2 为子；3,4 为 1 的子' }, ...extra];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    {},
    `求「树上所有点到 u 的距离和」——每个 u 都要！逐点 BFS 是 O(n²)。换根 DP 二次扫描：第一趟后序算「子树内」（size 与 down），第二趟前序把答案从父亲推给孩子，全树 O(n)`,
    [{ name: '目标', value: 'ans[u] = Σ dist(u, ·)，全部 5 个' }],
  );

  for (const f of downFills) {
    cells[f.u][0] = f.size;
    cells[f.u][1] = f.down;
    const isLeaf = f.kids.length === 0;
    emit(
      'down',
      {
        active: [f.u, 1],
        updatedCell: [f.u, 1],
        sources: isLeaf
          ? []
          : f.kids.flatMap(
              (k) =>
                [
                  [k, 0],
                  [k, 1],
                ] as [number, number][],
            ),
      },
      isLeaf
        ? `第一趟（后序）：叶子 ${POS[f.u]}——size=1、down=0（子树里只有自己）`
        : `第一趟：${POS[f.u]}——size = 1 + ${f.kids.map((k) => cells[k][0]).join(' + ')} = ${f.size}；down = ${f.kids.map((k) => `(${cells[k][1]}+${cells[k][0]})`).join(' + ')} = ${f.down}（孩子子树整体抬 1 步，黄格 = 孩子的 size/down）`,
      [{ name: '当前', value: POS[f.u] }],
    );
  }

  cells[0][2] = ans[0];
  emit(
    'root',
    { active: [0, 2], updatedCell: [0, 2], sources: [[0, 1]] },
    `第一趟收官：根的子树就是整棵树——ans[0] = down[0] = ${ans[0]}。别的节点逐个重跑？不必：换根登场`,
    [{ name: 'ans[0]', value: `${ans[0]}` }],
  );

  for (const r of reroots) {
    cells[r.v][2] = r.ansV;
    emit(
      'reroot',
      {
        active: [r.v, 2],
        updatedCell: [r.v, 2],
        sources: [
          [r.parent, 2],
          [r.v, 0],
        ],
      },
      `第二趟（前序）：根从 ${r.parent} 挪到 ${r.v}——${r.v} 子树里 ${r.sizeV} 个点近了 1 步、其余 ${RR_N - r.sizeV} 个点远了 1 步：ans[${r.v}] = ${r.ansP} − ${r.sizeV} + ${RR_N - r.sizeV} = ${r.ansV}`,
      [{ name: `ans[${r.v}]`, value: `${r.ansV}` }],
    );
  }

  emit(
    'done',
    {},
    `ans = [${ans.join(', ')}]（逐点 BFS 暴力同为 [${bruteDist().join(', ')}]），两趟 DFS 共 O(n)。二次扫描三件套：①第一趟后序算子树内；②答案对「挪一步」可增量修正（可减性）；③第二趟前序沿树传递。最远距离、树的中心同款`,
    [{ name: '复杂度', value: 'O(n)（对比逐点 O(n²)）' }],
  );
  return steps;
}

export const rerootModule: AlgorithmModule<RerootExecPoint> = {
  title: '换根 DP（树中距离之和）',
  initialInput: () => [],
  buildSteps: () => buildRerootSteps(),
  sources: rerootSources,
};
