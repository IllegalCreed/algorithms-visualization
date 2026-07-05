import type {
  AlgorithmModule,
  MatrixTrack,
  Step,
  TreeDpExecPoint,
  VarRow,
} from '@/components/player/types';
import { TD_VALS, treeDpFills, bruteRob } from './treedp';
import { treeDpSources } from './treedp.sources';

const ROW_LABELS = ['根 4', 'L 1', 'R 5', 'LL 3', 'LR 6'];
const POS = ['根', 'L', 'R', 'LL', 'LR'];

/** 固定完全二叉树 [4,1,5,3,6] 树形 DP 后序重走，产出矩阵轨胖步骤（纯复用 MatrixView 第 13 消费者）。
 *  行序 = 节点、填序 = 后序（跳行本身即教学点）；sel/not 两步分别高亮不同来源。 */
export function buildTreeDpSteps(input: number[]): Step<TreeDpExecPoint>[] {
  const vals = [...input];
  const n = vals.length;
  const { fills, best } = treeDpFills();
  const steps: Step<TreeDpExecPoint>[] = [];

  const cells: (number | null)[][] = Array.from({ length: n }, () => [null, null]);

  const emit = (
    point: TreeDpExecPoint,
    o: {
      active?: [number, number] | null;
      updatedCell?: [number, number] | null;
      sources?: [number, number][];
    },
    caption: string,
    extra: VarRow[] = [],
  ): void => {
    const matrix: MatrixTrack = {
      labels: ['选', '不选'],
      rowLabels: ROW_LABELS,
      colLabels: ['选', '不选'],
      cells: cells.map((r) => [...r]),
      emptyText: '',
      active: o.active ?? null,
      updatedCell: o.updatedCell ?? null,
      sources: o.sources ?? [],
    };
    const vars: VarRow[] = [{ name: '树（层序）', value: `[${vals.join(', ')}]` }, ...extra],
      step: Step<TreeDpExecPoint> = {
        array: [],
        pointers: [],
        emphasis: {},
        vars,
        point,
        matrix,
        caption,
      };
    steps.push(step);
  };

  emit(
    'init',
    {},
    `二叉树上打家劫舍：父子不能同偷，求最大金额。树：根 4，左子 1（孩子 3、6）、右子 5。每个节点两个状态——选（值 + Σ孩子的不选）/ 不选（Σ max(孩子两态)）；孩子先算完父亲才能算 → 按后序填表`,
    [{ name: '后序', value: 'LL → LR → L → R → 根' }],
  );

  for (const f of fills) {
    if (f.kids.length === 0) {
      cells[f.i][0] = f.sel;
      cells[f.i][1] = f.notv;
      emit(
        'leaf',
        { active: [f.i, 0], updatedCell: [f.i, 0] },
        `叶子 ${POS[f.i]}（值 ${f.val}）：没有孩子——选 = ${f.val}、不选 = 0，一步双格`,
        [{ name: '节点', value: `${POS[f.i]}（${f.val}）` }],
      );
    } else {
      cells[f.i][0] = f.sel;
      emit(
        'sel',
        {
          active: [f.i, 0],
          updatedCell: [f.i, 0],
          sources: f.kids.map((k) => [k, 1] as [number, number]),
        },
        `${POS[f.i]}（值 ${f.val}）「选」：偷它则孩子都不能偷——${f.val} + ${f.kids.map((k) => `不选(${POS[k]})=${cells[k][1]}`).join(' + ')} = ${f.sel}（黄格 = 孩子的不选）`,
        [{ name: '节点', value: `${POS[f.i]}（${f.val}）` }],
      );
      cells[f.i][1] = f.notv;
      emit(
        'not',
        {
          active: [f.i, 1],
          updatedCell: [f.i, 1],
          sources: f.kids.flatMap((k) => [[k, 0] as [number, number], [k, 1] as [number, number]]),
        },
        `${POS[f.i]}「不选」：孩子自由发挥各取最大——${f.kids.map((k) => `max(${cells[k][0]}, ${cells[k][1]})`).join(' + ')} = ${f.notv}`,
        [{ name: '节点', value: `${POS[f.i]}（${f.val}）` }],
      );
    }
  }

  emit(
    'best',
    {
      active: [0, 1],
      sources: [
        [0, 0],
        [0, 1],
      ],
    },
    `根算完，答案 = max(选 13, 不选 14) = 14——不偷根、拿下 3 + 6 + 5 三家`,
    [{ name: '答案', value: `${best}` }],
  );

  emit(
    'done',
    {},
    `树形 DP 三要素：状态挂在节点上、子树天然是子问题、后序遍历天然是拓扑序——答案 14（暴力枚举不相邻子集同为 ${bruteRob()}）。同款还有「没有上司的舞会」；再进阶是树上背包与换根 DP`,
    [{ name: '复杂度', value: 'O(n)' }],
  );
  return steps;
}

export const treeDpModule: AlgorithmModule<TreeDpExecPoint> = {
  title: '树形 DP（打家劫舍 III）',
  initialInput: () => [...TD_VALS],
  buildSteps: (input) => buildTreeDpSteps(input),
  sources: treeDpSources,
};
