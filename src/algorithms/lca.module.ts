import type {
  AlgorithmModule,
  LcaExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { LCA_N, buildUp, lcaTrace } from './lca';
import { lcaSources } from './lca.sources';

const ROW_LABELS = ['0', '1', '2', '3', '4', '5', '6', '7'];
const COL_LABELS = ['depth', 'up⁰', 'up¹', 'up²'];

/** 固定 8 节点树的 LCA 倍增重放，产出矩阵轨胖步骤（纯复用 MatrixView 第 16 消费者）。
 *  build 三步逐列填倍增表（递推示例格黄）；查询三段式：对齐跳 → 高位试跳判定 → 父即答案。 */
export function buildLcaSteps(): Step<LcaExecPoint>[] {
  const { depth, up } = buildUp();
  const steps: Step<LcaExecPoint>[] = [];

  const cells: (number | null)[][] = Array.from({ length: LCA_N }, () => [null, null, null, null]);

  const emit = (
    point: LcaExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: COL_LABELS,
      rowLabels: ROW_LABELS,
      colLabels: COL_LABELS,
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [
      { name: '树', value: '0 根；1,2 子；3,4 为 1 的子；5 为 2 的子；6 为 3 的子；7 为 6 的子' },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    {},
    `最近公共祖先（LCA）= 两点家谱的交汇处。朴素做法逐步爬父链 O(n)；倍增法先建「跳表」up[k][u]（u 往上跳 2^k 步的祖先），把一次查询压到 O(log n)。目标：LCA(7, 4) 与 LCA(6, 5)`,
    [{ name: '目标', value: 'LCA(7, 4) 与 LCA(6, 5)' }],
  );

  for (let u = 0; u < LCA_N; u++) {
    cells[u][0] = depth[u];
    cells[u][1] = up[0][u] < 0 ? null : up[0][u];
  }
  emit(
    'build',
    { active: [7, 1], updatedCell: [7, 1] },
    `建表第 1 列：DFS 一遍记下深度 depth 与父亲 up⁰（跳 1 步）。例：depth[7]=4、up⁰[7]=6；根 0 没有父亲（留空 = −1）`,
    [{ name: 'up⁰', value: '= 父数组 fa' }],
  );

  for (let u = 0; u < LCA_N; u++) cells[u][2] = up[1][u] < 0 ? null : up[1][u];
  emit(
    'build',
    {
      active: [7, 2],
      updatedCell: [7, 2],
      sources: [
        [7, 1],
        [6, 1],
      ],
    },
    `建表第 2 列——「爸爸的爸爸」：up¹[u] = up⁰[up⁰[u]]（跳 2 步 = 跳 1 步再跳 1 步）。例：up¹[7] = up⁰[up⁰[7]] = up⁰[6] = 3（黄格 = 用到的两格）；深度不足 2 的留空`,
    [{ name: '递推', value: 'up¹[u] = up⁰[up⁰[u]]' }],
  );

  for (let u = 0; u < LCA_N; u++) cells[u][3] = up[2][u] < 0 ? null : up[2][u];
  emit(
    'build',
    {
      active: [7, 3],
      updatedCell: [7, 3],
      sources: [
        [7, 2],
        [3, 2],
      ],
    },
    `建表第 3 列再翻一倍：up²[u] = up¹[up¹[u]]（跳 4 步 = 跳 2 步再跳 2 步）。全树只有 7 号够深：up²[7] = up¹[up¹[7]] = up¹[3] = 0。表建完，O(n log n)`,
    [{ name: '递推', value: 'up²[u] = up¹[up¹[u]]' }],
  );

  const t1 = lcaTrace(7, 4);
  emit(
    'align',
    { active: [7, 2], sources: [[7, 2]] },
    `查询① LCA(7, 4)：7 更深，先对齐——深度差 = 4 − 2 = 2 = 10₂（二进制拆解），第 1 位是 1 → 沿 up¹ 跳：7 → ${t1.aligns[0].to}。两点同深了（depth = 2）`,
    [
      { name: '深度差', value: '4 − 2 = 2 = 10₂' },
      { name: '当前', value: 'u=3, v=4' },
    ],
  );
  emit(
    'jump',
    {
      active: [3, 1],
      sources: [
        [3, 1],
        [4, 1],
      ],
    },
    `从高位试跳：k=2（空=空）、k=1（0=0）、k=0（1=1）——每层祖先都相同，一次也不跳！规则：祖先相同时不敢跳——那可能已越过 LCA（跳到交汇处上方），只有「不同」才放心跳`,
    [{ name: '判定', value: 'k=2,1,0 全 same → 不跳' }],
  );
  emit(
    'answer',
    { active: [3, 1], sources: [[3, 1]] },
    `3 与 4 停在 LCA 的两个孩子上，父亲即答案：up⁰[3] = 1，LCA(7, 4) = 1`,
    [{ name: '答案①', value: `LCA(7, 4) = ${t1.answer}` }],
  );

  const t2 = lcaTrace(6, 5);
  emit(
    'align',
    { active: [6, 1], sources: [[6, 1]] },
    `查询② LCA(6, 5)：6 更深，深度差 = 3 − 2 = 1 = 1₂ → 沿 up⁰ 跳：6 → ${t2.aligns[0].to}。同深，但 3 ≠ 5，继续`,
    [
      { name: '深度差', value: '3 − 2 = 1 = 1₂' },
      { name: '当前', value: 'u=3, v=5' },
    ],
  );
  emit(
    'jump',
    {
      active: [3, 1],
      sources: [
        [3, 1],
        [5, 1],
      ],
    },
    `试跳：k=2、k=1 祖先相同不跳；k=0：up⁰[3] = 1 ≠ up⁰[5] = 2 → 不同，双跳！3 → 1、5 → 2（两点一起跳才保持同深）`,
    [{ name: '判定', value: 'k=0 不同 → 双跳 (3,5)→(1,2)' }],
  );
  emit(
    'answer',
    { active: [1, 1], sources: [[1, 1]] },
    `1 与 2 停在 LCA 的两个孩子上，父亲即答案：up⁰[1] = 0，LCA(6, 5) = 0（正是根）`,
    [{ name: '答案②', value: `LCA(6, 5) = ${t2.answer}` }],
  );

  emit(
    'done',
    {},
    `建表 O(n log n)、每次查询 O(log n)——海量查询的标配。最常用衍生：树上距离 = depth[u] + depth[v] − 2·depth[LCA]，如 dist(7, 4) = 4 + 2 − 2×1 = 4。离线批量可用 Tarjan（并查集），链上重载场景可树链剖分`,
    [{ name: '复杂度', value: '建表 O(n log n) + 查询 O(log n)' }],
  );
  return steps;
}

export const lcaModule: AlgorithmModule<LcaExecPoint> = {
  title: 'LCA 倍增（最近公共祖先）',
  initialInput: () => [],
  buildSteps: () => buildLcaSteps(),
  sources: lcaSources,
};
