import type {
  AlgorithmModule,
  CrtExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { CRT_RS, CRT_MS, crtRows, crtSolve } from './crt';
import { crtSources } from './crt.sources';

const SUB = ['₀', '₁', '₂'];
const CIRCLED = ['①', '②', '③'];

/** 固定孙子算经同余组逐步构造，产出矩阵轨胖步骤（纯复用 MatrixView 第 9 消费者）。
 *  每行三步：Mᵢ = M/mᵢ（只在本条同余有声音）→ tᵢ 扩欧求逆（校准成 1）→ 专属项 rᵢ·Mᵢ·tᵢ；
 *  再合计、mod M 归约出最小非负解。 */
export function buildCrtSteps(): Step<CrtExecPoint>[] {
  const rows = crtRows();
  const { M, sum, x } = crtSolve();
  const steps: Step<CrtExecPoint>[] = [];

  // 表格：3 条同余 + 合计行 × 5 列 [r, m, Mᵢ, tᵢ, 项]
  const cells: (number | null)[][] = Array.from({ length: 4 }, () => new Array(5).fill(null));
  rows.forEach((row, i) => {
    cells[i][0] = row.r;
    cells[i][1] = row.m;
  });

  const emit = (
    point: CrtExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: ['r', 'm', 'Mᵢ', 'tᵢ', '项'],
      rowLabels: ['同余①', '同余②', '同余③', '合计'],
      colLabels: ['r', 'm', 'Mᵢ', 'tᵢ', '项'],
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [
      { name: '同余组', value: CRT_RS.map((r, i) => `x≡${r} (mod ${CRT_MS[i]})`).join('、') },
      { name: 'M', value: `${CRT_MS.join('·')} = ${M}` },
      ...extra,
    ];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    {},
    `今有物不知其数：x≡2 (mod 3)、x≡3 (mod 5)、x≡2 (mod 7)，模两两互质 → M = 3·5·7 = ${M}，解在 mod ${M} 内唯一。给每条同余造一个「专属项」`,
  );

  rows.forEach((row, i) => {
    const others = CRT_MS.filter((_, j) => j !== i);
    cells[i][2] = row.Mi;
    emit(
      'mi',
      { active: [i, 2], updatedCell: [i, 2], sources: [[i, 1]] },
      `M${SUB[i]} = ${M}/${row.m} = ${row.Mi} = ${others.join('·')}：含其余所有模、唯独不含 ${row.m}——对 ${others.join('、')} 取模都是 0，只在 mod ${row.m} 里「有声音」`,
      [{ name: '当前同余', value: CIRCLED[i] }],
    );

    const mid = row.Mi % row.m;
    cells[i][3] = row.ti;
    emit(
      'inv',
      {
        active: [i, 3],
        updatedCell: [i, 3],
        sources: [
          [i, 2],
          [i, 1],
        ],
      },
      `${row.Mi} ≡ ${mid} (mod ${row.m})，扩展欧几里得求逆：t${SUB[i]} = ${row.ti}（${mid}·${row.ti} = ${mid * row.ti} ≡ 1 mod ${row.m}），把这条同余里的「声音」校准成 1`,
      [{ name: '当前同余', value: CIRCLED[i] }],
    );

    cells[i][4] = row.term;
    emit(
      'term',
      {
        active: [i, 4],
        updatedCell: [i, 4],
        sources: [
          [i, 0],
          [i, 2],
          [i, 3],
        ],
      },
      `专属项 r${SUB[i]}·M${SUB[i]}·t${SUB[i]} = ${row.r}·${row.Mi}·${row.ti} = ${row.term}：mod ${row.m} 下 ≡ ${row.r}·1 = ${row.r} ✓，mod ${others.join('/')} 下含因子 ${row.Mi} → 0`,
      [{ name: '当前同余', value: CIRCLED[i] }],
    );
  });

  cells[3][4] = sum;
  emit(
    'sum',
    {
      active: [3, 4],
      updatedCell: [3, 4],
      sources: [
        [0, 4],
        [1, 4],
        [2, 4],
      ],
    },
    `三项相加：${rows.map((r) => r.term).join(' + ')} = ${sum}。每条同余下只有自己的项「发声」、其余项 ≡ 0，所以 ${sum} 同时满足三条同余`,
    [{ name: '合计', value: `${sum}` }],
  );

  emit(
    'done',
    { sources: [] },
    `${sum} mod ${M} = ${x}——最小非负解 x = ${x}（今有物二十三）。mod ${M} 意义下唯一；RSA-CRT 正是把大模数运算拆到小模数里各自算、再用它合并提速`,
    [{ name: 'x', value: `${x}` }],
  );
  return steps;
}

export const crtModule: AlgorithmModule<CrtExecPoint> = {
  title: '中国剩余定理（孙子算经）',
  initialInput: () => [],
  buildSteps: () => buildCrtSteps(),
  sources: crtSources,
};
