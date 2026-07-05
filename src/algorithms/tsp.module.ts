import type {
  AlgorithmModule,
  MatrixTrack,
  Step,
  TspExecPoint,
  VarRow,
} from '@/components/player/types';
import { TSP_N, tspDp, bruteTsp } from './tsp';
import { tspSources } from './tsp.sources';

const MASK_ROWS = [1, 3, 5, 7, 9, 11, 13, 15]; // 含起点 bit0 的 mask
const rowOf = (mask: number): number => MASK_ROWS.indexOf(mask);
const bin = (mask: number): string => mask.toString(2).padStart(TSP_N, '0');
const setTxt = (mask: number): string => {
  const cities: number[] = [];
  for (let i = 0; i < TSP_N; i++) if (mask & (1 << i)) cities.push(i);
  return `{${cities.join(',')}}`;
};

/** 固定 4 城 Held-Karp 状压 DP 逐格重走，产出矩阵轨胖步骤（纯复用 MatrixView 第 12 消费者）。
 *  8 行二进制 mask × 4 城列；fill 步 sources 黄高亮胜出前置格。 */
export function buildTspSteps(): Step<TspExecPoint>[] {
  const { fills, close, best } = tspDp();
  const steps: Step<TspExecPoint>[] = [];

  const cells: (number | null)[][] = Array.from({ length: MASK_ROWS.length }, () =>
    new Array<number | null>(TSP_N).fill(null),
  );
  cells[0][0] = 0; // dp[0001][0] = 0

  const emit = (
    point: TspExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: ['0', '1', '2', '3'],
      rowLabels: MASK_ROWS.map(bin),
      colLabels: ['0', '1', '2', '3'],
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [{ name: '距离', value: '4 城对称矩阵（见代码）' }, ...extra];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    { active: [0, 0] },
    `4 座城市各访问一次回到起点 0，求最短回路。全排列是 O(n!)；状压 DP 的洞察：走到半路，重要的只有「去过哪些城」和「现在在哪」——把集合压成二进制 mask 当行下标：dp[mask][i]。起点 dp[0001][0] = 0`,
    [{ name: '状态数', value: '2ⁿ·n = 64' }],
  );

  for (const f of fills) {
    const prev = f.mask ^ (1 << f.i);
    cells[rowOf(f.mask)][f.i] = f.val;
    const candTxt = f.cands.map((c) => `经城 ${c.j}：${c.cost}`).join('、');
    emit(
      'fill',
      {
        active: [rowOf(f.mask), f.i],
        updatedCell: [rowOf(f.mask), f.i],
        sources: [[rowOf(prev), f.bestJ]],
      },
      `dp[${bin(f.mask)}][${f.i}]（已访 ${setTxt(f.mask)}、现在城 ${f.i}）：上一站只能是 ${setTxt(prev)} 里的城——${candTxt}${f.cands.length > 1 ? '，取小' : ''} → ${f.val}（黄格 = 胜出前置 dp[${bin(prev)}][${f.bestJ}]）`,
      [
        { name: 'mask', value: `${bin(f.mask)} = ${setTxt(f.mask)}` },
        { name: 'dp', value: `${f.val}` },
      ],
    );
  }

  emit(
    'close',
    {
      active: [rowOf(15), 3],
      sources: close.map((c) => [rowOf(15), c.i] as [number, number]),
    },
    `全集行填齐，收尾回起点：${close.map((c) => `dp[1111][${c.i}] + d[${c.i}][0] = ${c.cost}`).join('、')}——取 min = ${best}`,
    [{ name: '回边候选', value: close.map((c) => `${c.cost}`).join(' / ') }],
  );

  emit(
    'done',
    {},
    `最短回路 = ${best}（暴力全排列同为 ${bruteTsp()}，路线 0→2→1→3→0）。Held-Karp O(2ⁿ·n²)：n=20 约 4 亿次运算是实用上限，再大就交给近似算法。「集合当下标」的状压还有子集枚举、轮廓线 DP 等一族玩法`,
    [{ name: '复杂度', value: 'O(2ⁿ·n²)' }],
  );
  return steps;
}

export const tspModule: AlgorithmModule<TspExecPoint> = {
  title: '旅行商 TSP（状压 DP）',
  initialInput: () => [],
  buildSteps: () => buildTspSteps(),
  sources: tspSources,
};
