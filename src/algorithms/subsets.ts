// src/algorithms/subsets.ts
// 子集生成固定元素 + 决策树布局 + oracle。回溯与搜索大类第 2 页（C-056，决策树轨首发）。

export const SUBSET_ELEMS = [1, 2, 3];

/** 决策树节点（选/不选二叉决策树，固定布局） */
export interface SubsetTreeNode {
  id: number;
  depth: number; // 已决策元素数 = 下一个待决策元素下标
  chosen: number[]; // 已选入的元素（根→此的「选」决策）
  x: number;
  y: number;
  parent: number; // -1 = 根
  edgeLabel: string; // 从父到此的决策（'选 k' / '跳过 k'），根为 ''
  pathKey: string; // 'I'(选)/'E'(不选) 决策串，根 ''
  leaf: boolean; // depth === n
}

/** 逐元素「选/不选」建满二叉决策树（前序 = 叶子左→右）并算坐标 */
export function buildSubsetTree(): SubsetTreeNode[] {
  const elems = SUBSET_ELEMS;
  const n = elems.length;
  const nodes: SubsetTreeNode[] = [];

  const build = (
    depth: number,
    chosen: number[],
    parent: number,
    edgeLabel: string,
    pathKey: string,
  ): void => {
    const id = nodes.length;
    nodes.push({
      id,
      depth,
      chosen: [...chosen],
      x: 0,
      y: 0,
      parent,
      edgeLabel,
      pathKey,
      leaf: depth === n,
    });
    if (depth < n) {
      const e = elems[depth];
      build(depth + 1, [...chosen, e], id, `选 ${e}`, pathKey + 'I'); // 左枝：选
      build(depth + 1, chosen, id, `跳过 ${e}`, pathKey + 'E'); // 右枝：不选
    }
  };
  build(0, [], -1, '', '');

  // 布局：叶子（前序天然左→右）横向均分 640 宽；内部节点 x = 两子中点（自底向上）
  const leaves = nodes.filter((nd) => nd.leaf);
  const W = 640;
  const gap = W / (leaves.length + 1);
  leaves.forEach((nd, i) => {
    nd.x = gap * (i + 1);
  });
  for (let d = n - 1; d >= 0; d--) {
    for (const nd of nodes.filter((x) => x.depth === d)) {
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

/** DFS（选优先）叶子序 = 全部 2^n 个子集（幂集），供 module 断言 */
export function subsetsAll(): number[][] {
  return buildSubsetTree()
    .filter((nd) => nd.leaf)
    .map((nd) => nd.chosen);
}

/** 子集显示标签：{1,3} / 空集 ∅ */
export function subsetLabel(chosen: number[]): string {
  return chosen.length ? `{${chosen.join(',')}}` : '∅';
}
