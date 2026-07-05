import type {
  AlgorithmModule,
  DigitDpExecPoint,
  MatrixTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import { DD_N, DD_BAN, digitWalk, bruteCount } from './digitdp';
import { digitDpSources } from './digitdp.sources';

const ROW_LABELS = ['百位 2', '十位 4', '个位 5', '合计'];
const POS = ['百位', '十位', '个位'];

/** 固定 N=245、禁 4 的按位走上界重放，产出矩阵轨胖步骤（纯复用 MatrixView 第 14 消费者）。
 *  每位 free（自由分支记账）+ tight（贴着走判定）两步；断裂后整位跳过。 */
export function buildDigitDpSteps(): Step<DigitDpExecPoint>[] {
  const { rows, total, ans } = digitWalk();
  const steps: Step<DigitDpExecPoint>[] = [];

  const cells: (number | null)[][] = Array.from({ length: 4 }, () => new Array(4).fill(null));

  const emit = (
    point: DigitDpExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: ['位上', '可选数', '后缀 9^k', '小计'],
      rowLabels: ROW_LABELS,
      colLabels: ['位上', '可选数', '后缀 9^k', '小计'],
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [{ name: 'N / 禁', value: `${DD_N} / 数字 ${DD_BAN}` }, ...extra];
    steps.push({ array: [], pointers: [], emphasis: {}, vars, point, matrix, caption });
  };

  emit(
    'init',
    {},
    `统计 [1, ${DD_N}] 里不含数字 ${DD_BAN} 的数——逐个检查在 N=10¹⁸ 时爆炸。数位 DP 按位从高到低「走上界」：每位分两条路——自由分支（本位填得比上界位小，后缀彻底自由）和贴着走（恰好填上界位数字，继续受约束）`,
    [{ name: 'tight', value: '✓（起步贴着上界）' }],
  );

  let running = 0;
  rows.forEach((r, i) => {
    if (r.cnt === null) {
      cells[i][0] = r.d;
      emit(
        'broken',
        { active: [i, 0] },
        `${POS[i]}（上界位 ${r.d}）：tight 早已断裂——没有任何数还贴着上界走到这里，整位跳过`,
        [{ name: 'tight', value: '✗（已断）' }],
      );
      return;
    }
    cells[i][0] = r.d;
    cells[i][1] = r.cnt;
    cells[i][2] = r.pow;
    cells[i][3] = r.sub;
    running += r.sub!;
    const choices: string[] = [];
    for (let x = 0; x < r.d; x++) if (x !== DD_BAN) choices.push(String(x));
    emit(
      'free',
      { active: [i, 3], updatedCell: [i, 3] },
      `${POS[i]}自由分支：本位可填 {${choices.join(',')}}（< ${r.d} 且 ≠ ${DD_BAN}）共 ${r.cnt} 种，后面 ${i === 0 ? '两' : '一'}位随便填（每位 9 种）→ ${r.cnt} × ${r.pow} = ${r.sub}`,
      [
        { name: 'tight', value: '✓' },
        { name: '累计', value: `${running}` },
      ],
    );
    emit(
      'tight',
      { active: [i, 0] },
      r.tightOk
        ? `贴着走判定：本位恰填上界位 ${r.d}（${r.d} ≠ ${DD_BAN} 合法）→ tight 延续，进入下一位`
        : `贴着走判定：上界位就是 ${r.d}——被禁数字！tight 断裂：不存在「贴着 245 走过十位」的合法数，后面的位全部无路`,
      [{ name: 'tight', value: r.tightOk ? '✓ 延续' : '✗ 断裂！' }],
    );
  });

  cells[3][3] = total;
  emit(
    'sum',
    {
      active: [3, 3],
      updatedCell: [3, 3],
      sources: [
        [0, 3],
        [1, 3],
      ],
    },
    `小计相加：162 + 36 = ${total}——这数的是 [0, ${DD_N}]（自由分支里全 0 也算一个），去掉 0 → [1, ${DD_N}] 共 ${ans} 个`,
    [{ name: '答案', value: `${ans}` }],
  );

  emit(
    'done',
    {},
    `答案 ${ans}（暴力逐个检查同为 ${bruteCount()}），只走了 3 个位——O(位数)。通用模板是记忆化搜索 dp(pos, tight, state)：state 按题意换成前导零/上一位数字/模数余数，就能数「不含 62」「二进制 1 的个数」「windy 数」等一族问题`,
    [{ name: '复杂度', value: 'O(位数 × 状态)' }],
  );
  return steps;
}

export const digitDpModule: AlgorithmModule<DigitDpExecPoint> = {
  title: '数位 DP（按位走上界）',
  initialInput: () => [],
  buildSteps: () => buildDigitDpSteps(),
  sources: digitDpSources,
};
