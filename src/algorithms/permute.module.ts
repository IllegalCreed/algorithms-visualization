import type {
  AlgorithmModule,
  DecisionTreeTrack,
  PermuteExecPoint,
  Step,
  VarRow,
} from '@/components/player/types';
import { PERMUTE_ELEMS, buildPermuteTree, permLabel, type PermuteTreeNode } from './permute';
import { permuteSources } from './permute.sources';

const factorial = (k: number): number => (k <= 1 ? 1 : k * factorial(k - 1));

/** 固定 [1,2,3] 逐位「从剩余挑一个」多叉决策树 DFS 细粒度重走，产出决策树轨胖步骤 */
export function buildPermuteSteps(): Step<PermuteExecPoint>[] {
  const n = PERMUTE_ELEMS.length;
  const total = factorial(n);
  const tree = buildPermuteTree();
  const childrenOf = (id: number) => tree.filter((nd) => nd.parent === id);

  const steps: Step<PermuteExecPoint>[] = [];
  const visited: number[] = [];
  const solutions: number[] = [];
  let solCount = 0;

  // 树结构（节点 + 决策边）跨步不变：叶子标最终排列、内部空标签
  const trackNodes = tree.map((t) => ({
    id: t.id,
    label: t.leaf ? permLabel(t.chosen) : '',
    x: t.x,
    y: t.y,
  }));
  const trackEdges = tree
    .filter((t) => t.parent !== -1)
    .map((t) => ({ from: t.parent, to: t.id, label: t.edgeLabel }));

  const pathTo = (nd: PermuteTreeNode): number[] => {
    const ids: number[] = [];
    let cur: PermuteTreeNode | null = nd;
    while (cur) {
      ids.unshift(cur.id);
      cur = cur.parent === -1 ? null : tree[cur.parent];
    }
    return ids;
  };

  const remaining = (chosen: number[]) => PERMUTE_ELEMS.filter((e) => !chosen.includes(e));
  const remLabel = (chosen: number[]) => {
    const r = remaining(chosen);
    return r.length ? `{${r.join(',')}}` : '∅';
  };

  const vars = (nd: PermuteTreeNode): VarRow[] => [
    { name: '元素', value: PERMUTE_ELEMS.join(' ') },
    { name: '当前排列', value: permLabel(nd.chosen) },
    { name: '剩余', value: remLabel(nd.chosen) },
    { name: '已收集', value: `${solCount} / ${total}` },
  ];

  const emit = (point: PermuteExecPoint, nd: PermuteTreeNode, caption: string): void => {
    const track: DecisionTreeTrack = {
      nodes: trackNodes,
      edges: trackEdges,
      activeId: nd.id,
      pathIds: pathTo(nd),
      visitedIds: [...visited],
      solutionIds: [...solutions],
    };
    steps.push({
      array: [],
      pointers: [],
      emphasis: {},
      vars: vars(nd),
      point,
      decisionTree: track,
      caption,
    });
  };

  const visit = (nd: PermuteTreeNode): void => {
    visited.push(nd.id);
    if (nd.depth === 0) {
      emit('start', nd, `空排列：每个位置从「剩余未用元素」里挑一个`);
    } else {
      const picked = nd.chosen[nd.chosen.length - 1];
      emit(
        'choose',
        nd,
        `选 ${picked} → 当前排列 ${permLabel(nd.chosen)}，剩余 ${remLabel(nd.chosen)}`,
      );
    }
    if (nd.leaf) {
      solCount++;
      solutions.push(nd.id);
      emit('record', nd, `元素用完 → 记录第 ${solCount} 个排列 ${permLabel(nd.chosen)}`);
      return;
    }
    const kids = childrenOf(nd.id);
    kids.forEach((kid, idx) => {
      if (idx > 0) {
        emit('backtrack', nd, `回溯到 ${permLabel(nd.chosen)}：撤销上一个选择，挑下一个剩余元素`);
      }
      visit(kid);
    });
  };

  visit(tree[0]);
  emit('done', tree[0], `全部 ${total}（= ${n}!）个排列枚举完毕`);
  return steps;
}

export const permuteModule: AlgorithmModule<PermuteExecPoint> = {
  title: '全排列',
  initialInput: () => [],
  buildSteps: () => buildPermuteSteps(),
  sources: permuteSources,
};
