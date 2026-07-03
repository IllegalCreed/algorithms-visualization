import type {
  AlgorithmModule,
  DecisionTreeTrack,
  Step,
  SubsetsExecPoint,
  VarRow,
} from '@/components/player/types';
import { SUBSET_ELEMS, buildSubsetTree, subsetLabel, type SubsetTreeNode } from './subsets';
import { subsetsSources } from './subsets.sources';

/** 固定 [1,2,3] 逐元素「选/不选」决策树 DFS 细粒度重走，产出决策树轨胖步骤 */
export function buildSubsetsSteps(): Step<SubsetsExecPoint>[] {
  const n = SUBSET_ELEMS.length;
  const tree = buildSubsetTree();
  const byKey: Record<string, SubsetTreeNode> = {};
  for (const nd of tree) byKey[nd.pathKey] = nd;

  const steps: Step<SubsetsExecPoint>[] = [];
  const visited: number[] = [];
  const solutions: number[] = [];
  let solCount = 0;

  // 树结构（节点 + 决策边）跨步不变：叶子标最终子集、内部空标签
  const trackNodes = tree.map((t) => ({
    id: t.id,
    label: t.leaf ? subsetLabel(t.chosen) : '',
    x: t.x,
    y: t.y,
  }));
  const trackEdges = tree
    .filter((t) => t.parent !== -1)
    .map((t) => ({ from: t.parent, to: t.id, label: t.edgeLabel }));

  const pathTo = (nd: SubsetTreeNode): number[] => {
    const ids: number[] = [];
    let cur: SubsetTreeNode | null = nd;
    while (cur) {
      ids.unshift(cur.id);
      cur = cur.parent === -1 ? null : tree[cur.parent];
    }
    return ids;
  };

  const vars = (nd: SubsetTreeNode): VarRow[] => [
    { name: '元素', value: SUBSET_ELEMS.join(' ') },
    { name: '当前子集', value: subsetLabel(nd.chosen) },
    { name: '已收集', value: `${solCount} / ${1 << n}` },
  ];

  const emit = (point: SubsetsExecPoint, nd: SubsetTreeNode, caption: string): void => {
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

  const visit = (nd: SubsetTreeNode): void => {
    visited.push(nd.id);
    if (nd.depth === 0) {
      emit('start', nd, `从空集 ∅ 出发，对每个元素依次决定「选」或「不选」`);
    } else {
      const e = SUBSET_ELEMS[nd.depth - 1];
      if (nd.pathKey.endsWith('I')) {
        emit('include', nd, `选 ${e} → 当前子集 ${subsetLabel(nd.chosen)}`);
      } else {
        emit('exclude', nd, `跳过 ${e} → 当前子集 ${subsetLabel(nd.chosen)}`);
      }
    }
    if (nd.leaf) {
      solCount++;
      solutions.push(nd.id);
      emit('record', nd, `决策完所有元素 → 记录第 ${solCount} 个子集 ${subsetLabel(nd.chosen)}`);
      return;
    }
    visit(byKey[nd.pathKey + 'I']); // 先走「选」子树
    emit(
      'backtrack',
      nd,
      `「选 ${SUBSET_ELEMS[nd.depth]}」子树探索完，回溯到 ${subsetLabel(nd.chosen)}，改试「不选 ${SUBSET_ELEMS[nd.depth]}」`,
    );
    visit(byKey[nd.pathKey + 'E']); // 再走「不选」子树
  };

  visit(tree[0]);
  emit('done', tree[0], `全部 2^${n} = ${1 << n} 个子集枚举完毕（幂集）`);
  return steps;
}

export const subsetsModule: AlgorithmModule<SubsetsExecPoint> = {
  title: '子集生成',
  initialInput: () => [],
  buildSteps: () => buildSubsetsSteps(),
  sources: subsetsSources,
};
