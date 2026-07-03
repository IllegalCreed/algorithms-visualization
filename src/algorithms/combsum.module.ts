import type {
  AlgorithmModule,
  CombSumExecPoint,
  DecisionTreeTrack,
  Step,
  VarRow,
} from '@/components/player/types';
import {
  COMBSUM_CANDIDATES,
  COMBSUM_TARGET,
  buildCombSumTree,
  combLabel,
  type CombSumTreeNode,
} from './combsum';
import { combsumSources } from './combsum.sources';

/** 固定候选 [1,2,3,4] 目标 5，start-index 组合决策树 + 剪枝 DFS 细粒度重走，产出决策树轨胖步骤 */
export function buildCombSumSteps(): Step<CombSumExecPoint>[] {
  const T = COMBSUM_TARGET;
  const tree = buildCombSumTree();
  const childrenOf = (id: number) => tree.filter((nd) => nd.parent === id);

  const steps: Step<CombSumExecPoint>[] = [];
  const visited: number[] = [];
  const solutions: number[] = [];
  const pruned: number[] = [];
  let solCount = 0;

  // 树结构（节点 + 决策边）跨步不变：解叶/剪枝节点标组合、其余空标签
  const trackNodes = tree.map((t) => ({
    id: t.id,
    label: t.solution || t.pruned ? combLabel(t.chosen) : '',
    x: t.x,
    y: t.y,
  }));
  const trackEdges = tree
    .filter((t) => t.parent !== -1)
    .map((t) => ({ from: t.parent, to: t.id, label: t.edgeLabel }));

  const pathTo = (nd: CombSumTreeNode): number[] => {
    const ids: number[] = [];
    let cur: CombSumTreeNode | null = nd;
    while (cur) {
      ids.unshift(cur.id);
      cur = cur.parent === -1 ? null : tree[cur.parent];
    }
    return ids;
  };

  const vars = (nd: CombSumTreeNode): VarRow[] => [
    { name: '候选', value: COMBSUM_CANDIDATES.join(' ') },
    { name: '目标', value: `${T}` },
    { name: '当前组合', value: combLabel(nd.chosen) },
    { name: '当前和', value: `${nd.sum}` },
    { name: '已找到', value: `${solCount}` },
  ];

  const emit = (point: CombSumExecPoint, nd: CombSumTreeNode, caption: string): void => {
    const track: DecisionTreeTrack = {
      nodes: trackNodes,
      edges: trackEdges,
      activeId: nd.id,
      pathIds: pathTo(nd),
      visitedIds: [...visited],
      solutionIds: [...solutions],
      prunedIds: [...pruned],
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

  const visit = (nd: CombSumTreeNode): void => {
    visited.push(nd.id);
    const kids = childrenOf(nd.id);
    if (nd.parent === -1) {
      emit('start', nd, `空组合，和 0，逐个加数凑目标 ${T}`);
    } else if (nd.pruned) {
      pruned.push(nd.id);
      const picked = nd.chosen[nd.chosen.length - 1];
      emit(
        'prune',
        nd,
        `选 ${picked} → ${combLabel(nd.chosen)} 和=${nd.sum} > 目标 ${T}：剪枝，不再展开这一支`,
      );
      return;
    } else {
      const picked = nd.chosen[nd.chosen.length - 1];
      const dead = !nd.solution && kids.length === 0;
      const tail = nd.solution
        ? ` = 目标 ${T}`
        : dead
          ? `，无更多数可选且 ≠ ${T}：此路不通`
          : ` ≤ ${T}，继续`;
      emit('include', nd, `选 ${picked} → ${combLabel(nd.chosen)} 和=${nd.sum}${tail}`);
    }
    if (nd.solution) {
      solCount++;
      solutions.push(nd.id);
      emit('record', nd, `和 = 目标 ${T} → 记录第 ${solCount} 个组合 ${combLabel(nd.chosen)}`);
      return;
    }
    kids.forEach((kid, idx) => {
      if (idx > 0) {
        emit('backtrack', nd, `回溯到 ${combLabel(nd.chosen)}：撤销上一个数，换下一个`);
      }
      visit(kid);
    });
  };

  visit(tree[0]);
  emit('done', tree[0], `全部探索完：共找到 ${solCount} 个和为 ${T} 的组合`);
  return steps;
}

export const combsumModule: AlgorithmModule<CombSumExecPoint> = {
  title: '组合总和',
  initialInput: () => [],
  buildSteps: () => buildCombSumSteps(),
  sources: combsumSources,
};
