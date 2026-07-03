// src/algorithms/combsum.ts
// 组合总和固定候选/目标 + start-index 剪枝决策树布局 + oracle。回溯与搜索大类第 4 页（C-058，决策树剪枝）。

export const COMBSUM_CANDIDATES = [1, 2, 3, 4];
export const COMBSUM_TARGET = 5;

/** 组合总和决策树节点（每节点一个组合，加数超目标即剪枝，固定布局） */
export interface CombSumTreeNode {
  id: number;
  depth: number; // 已选个数
  chosen: number[]; // 已选的组合
  sum: number; // 当前和
  x: number;
  y: number;
  parent: number; // -1 = 根
  edgeLabel: string; // 从父到此的决策（'选 k'），根为 ''
  pruned: boolean; // sum > 目标（超标被砍）
  solution: boolean; // sum === 目标
}

/** start-index 建组合决策树（前序）：加数 ≤ 目标继续、> 目标剪枝、= 目标记录，pruned/solution 不再展开 */
export function buildCombSumTree(): CombSumTreeNode[] {
  const cand = COMBSUM_CANDIDATES;
  const T = COMBSUM_TARGET;
  const nodes: CombSumTreeNode[] = [];

  const build = (
    start: number,
    chosen: number[],
    sum: number,
    parent: number,
    edgeLabel: string,
  ): void => {
    const id = nodes.length;
    const pruned = sum > T;
    const solution = sum === T;
    nodes.push({
      id,
      depth: chosen.length,
      chosen: [...chosen],
      sum,
      x: 0,
      y: 0,
      parent,
      edgeLabel,
      pruned,
      solution,
    });
    if (pruned || solution) return; // 剪枝 / 命中：不再展开
    for (let i = start; i < cand.length; i++) {
      build(i + 1, [...chosen, cand[i]], sum + cand[i], id, `选 ${cand[i]}`);
    }
  };
  build(0, [], 0, -1, '');

  // 布局：叶子（前序天然左→右）横向均分 640 宽；内部节点 x = 各子中点（自底向上）
  const childIds = new Set(nodes.filter((n) => n.parent !== -1).map((n) => n.parent));
  const leaves = nodes.filter((n) => !childIds.has(n.id));
  const W = 640;
  const gap = W / (leaves.length + 1);
  leaves.forEach((nd, i) => {
    nd.x = gap * (i + 1);
  });
  const maxDepth = Math.max(...nodes.map((n) => n.depth));
  for (let d = maxDepth - 1; d >= 0; d--) {
    for (const nd of nodes.filter((x) => x.depth === d && childIds.has(x.id))) {
      const kids = nodes.filter((x) => x.parent === nd.id);
      nd.x = kids.reduce((s, k) => s + k.x, 0) / kids.length;
    }
  }
  const topY = 34;
  const rowGap = 74;
  nodes.forEach((nd) => {
    nd.y = topY + nd.depth * rowGap;
  });
  return nodes;
}

/** DFS（候选升序）解序 = 全部和为目标的组合，供 module 断言 */
export function combSumAll(): number[][] {
  return buildCombSumTree()
    .filter((nd) => nd.solution)
    .map((nd) => nd.chosen);
}

/** 组合显示标签：{1,4} / 空组合 ∅ */
export function combLabel(chosen: number[]): string {
  return chosen.length ? `{${chosen.join(',')}}` : '∅';
}
