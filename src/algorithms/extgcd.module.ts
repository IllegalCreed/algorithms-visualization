import type {
  AlgorithmModule,
  ExtGcdExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { EG_A, EG_B, extGcd, egRows } from './extgcd';
import { extGcdSources } from './extgcd.sources';

/** 固定 30,18 扩展欧几里得回代表逐步重走，产出矩阵轨胖步骤（纯复用 MatrixView 第 8 消费者）。
 *  下行填 (a,b,q) → 基例 (x,y)=(1,0) → 自底向上回代 x=y'、y=x'−q·y'（sources 高亮引用行）。 */
export function buildExtGcdSteps(): Step<ExtGcdExecPoint>[] {
  const rows = egRows();
  const n = rows.length; // 4 行
  const { g, x, y } = extGcd(EG_A, EG_B);
  const steps: Step<ExtGcdExecPoint>[] = [];

  // 表格：n 行 × 5 列 [a,b,q,x,y]
  const cells: (number | null)[][] = Array.from({ length: n }, () => new Array(5).fill(null));

  const emit = (
    point: ExtGcdExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: ['a', 'b', 'q', 'x', 'y'],
      rowLabels: rows.map((_, i) => (i === n - 1 ? '基例' : `第${i}层`)),
      colLabels: ['a', 'b', 'q', 'x', 'y'],
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [
      { name: '求', value: `${EG_A}·x + ${EG_B}·y = gcd` },
      { name: 'gcd', value: `${g}` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    {},
    `求整数 x, y 使 ${EG_A}·x + ${EG_B}·y = gcd(${EG_A}, ${EG_B})。先照常做除法链「下行」，再从底往上「回代」系数`,
  );

  // 下行：填 a, b, q
  for (let i = 0; i < n - 1; i++) {
    cells[i][0] = rows[i].a;
    cells[i][1] = rows[i].b;
    cells[i][2] = rows[i].q;
    emit(
      'down',
      { active: [i, 2], updatedCell: [i, 2] },
      `下行第 ${i} 层：${rows[i].a} = ${rows[i].q}·${rows[i].b} + ${rows[i].a - (rows[i].q as number) * rows[i].b}，商 q=${rows[i].q}，余数交给下一层`,
      [{ name: '当前层', value: `${i}` }],
    );
  }

  // 基例
  const last = n - 1;
  cells[last][0] = rows[last].a;
  cells[last][1] = 0;
  cells[last][3] = 1;
  cells[last][4] = 0;
  emit(
    'base',
    { active: [last, 3], updatedCell: [last, 4] },
    `b=0 到底：gcd = ${rows[last].a}。恒等式 ${rows[last].a}·1 + 0·0 = ${rows[last].a} 显然成立 → 基例 (x, y) = (1, 0)`,
    [{ name: '基例', value: '(1, 0)' }],
  );

  // 回代
  for (let i = n - 2; i >= 0; i--) {
    const nx = rows[i + 1].x;
    const ny = rows[i + 1].y;
    cells[i][3] = rows[i].x;
    cells[i][4] = rows[i].y;
    emit(
      'up',
      {
        active: [i, 3],
        updatedCell: [i, 4],
        sources: [
          [i + 1, 3],
          [i + 1, 4],
        ],
      },
      `回代第 ${i} 层：x = y′ = ${ny}，y = x′ − q·y′ = ${nx} − ${rows[i].q}·${ny} = ${rows[i].y}；验证 ${rows[i].a}·(${rows[i].x}) + ${rows[i].b}·(${rows[i].y}) = ${rows[i].a * rows[i].x + rows[i].b * rows[i].y} ✓`,
      [{ name: `第${i}层 (x,y)`, value: `(${rows[i].x}, ${rows[i].y})` }],
    );
  }

  emit(
    'done',
    { sources: [] },
    `Bézout 系数出炉：x = ${x}、y = ${y}，即 ${EG_A}·(${x}) + ${EG_B}·(${y}) = ${g}。当 gcd(a,m)=1 时，同样的回代给出 a 的模逆元——RSA 解密密钥就这么算`,
    [{ name: 'Bézout', value: `x=${x}, y=${y}` }],
  );
  return steps;
}

export const extGcdModule: AlgorithmModule<ExtGcdExecPoint> = {
  title: '扩展欧几里得（Bézout 系数）',
  initialInput: () => [],
  buildSteps: () => buildExtGcdSteps(),
  sources: extGcdSources,
};
