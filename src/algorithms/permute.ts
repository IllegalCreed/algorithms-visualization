// src/algorithms/permute.ts
// 全排列固定元素 + 多叉决策树布局 + oracle。回溯与搜索大类第 3 页（C-057，复用决策树轨）。

export const PERMUTE_ELEMS = [1, 2, 3];

/** 排列决策树节点（每位从剩余未用元素挑一个，多叉，固定布局） */
export interface PermuteTreeNode {
  id: number;
  depth: number; // 已放元素数
  chosen: number[]; // 已放的排列前缀
  x: number;
  y: number;
  parent: number; // -1 = 根
  edgeLabel: string; // 从父到此的决策（'选 k'），根为 ''
  leaf: boolean; // depth === n
}

/** 逐位「从剩余挑一个」建多叉排列树（前序 = 叶子左→右）并算坐标 */
export function buildPermuteTree(): PermuteTreeNode[] {
  const elems = PERMUTE_ELEMS;
  const n = elems.length;
  const nodes: PermuteTreeNode[] = [];

  const build = (depth: number, chosen: number[], parent: number, edgeLabel: string): void => {
    const id = nodes.length;
    nodes.push({
      id,
      depth,
      chosen: [...chosen],
      x: 0,
      y: 0,
      parent,
      edgeLabel,
      leaf: depth === n,
    });
    if (depth < n) {
      // 子 = 剩余未用元素（升序），每个一支
      for (const e of elems) {
        if (!chosen.includes(e)) {
          build(depth + 1, [...chosen, e], id, `选 ${e}`);
        }
      }
    }
  };
  build(0, [], -1, '');

  // 布局：叶子（前序天然左→右）横向均分 640 宽；内部节点 x = 各子中点（自底向上）
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

/** DFS（剩余升序优先）叶子序 = 全部 n! 个排列，供 module 断言 */
export function permutationsAll(): number[][] {
  return buildPermuteTree()
    .filter((nd) => nd.leaf)
    .map((nd) => nd.chosen);
}

/** 排列显示标签：[1,3,2]（有序元组，区别于子集的 {1,3} 集合） */
export function permLabel(chosen: number[]): string {
  return `[${chosen.join(',')}]`;
}
