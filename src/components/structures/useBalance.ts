export interface BNode {
  id: string;
  value: number;
  x: number;
  y: number;
}
export interface BalanceLayout {
  nodes: BNode[];
  edges: [number, number][]; // 节点下标对
  height: number; // 层数
  worst: number; // 最坏查找比较次数
}
export interface SearchResult {
  path: number[]; // 走过的节点下标
  steps: number;
}
export interface UseBalance {
  chain: BalanceLayout; // 退化：值 1–7 右斜链
  balanced: BalanceLayout; // 平衡：值 4/2/6/1/3/5/7 完全二叉树
  search: (target: number, mode: 'chain' | 'balanced') => SearchResult;
}

const CHAIN_VALUES = [1, 2, 3, 4, 5, 6, 7];
const BAL_VALUES = [4, 2, 6, 1, 3, 5, 7]; // 完全二叉树 pos 0..6

const depthOf = (p: number): number => Math.floor(Math.log2(p + 1));
const xOf = (p: number): number => {
  const d = depthOf(p);
  return ((p - (2 ** d - 1) + 0.5) / 2 ** d) * 404;
};

export function useBalance(): UseBalance {
  // 退化：每个节点的右孩子是下一个（BST 按序插入 → 右斜链）
  const chain: BalanceLayout = {
    nodes: CHAIN_VALUES.map((value, i) => ({ id: `c${i}`, value, x: 70 + i * 46, y: 30 + i * 40 })),
    edges: [0, 1, 2, 3, 4, 5].map((i) => [i, i + 1] as [number, number]),
    height: 7,
    worst: 7,
  };
  // 平衡：完全二叉树（pos 定位复用 TreeView 公式）
  const balanced: BalanceLayout = {
    nodes: BAL_VALUES.map((value, p) => ({
      id: `b${p}`,
      value,
      x: xOf(p),
      y: 34 + depthOf(p) * 84,
    })),
    edges: [1, 2, 3, 4, 5, 6].map((p) => [p, (p - 1) >> 1] as [number, number]),
    height: 3,
    worst: 3,
  };

  const search = (target: number, mode: 'chain' | 'balanced'): SearchResult => {
    if (mode === 'chain') {
      const path: number[] = [];
      for (let i = 0; i < CHAIN_VALUES.length; i++) {
        path.push(i);
        if (CHAIN_VALUES[i] === target) return { path, steps: path.length };
        if (target < CHAIN_VALUES[i]) break; // 该往左（无）→ 不在
      }
      return { path, steps: path.length };
    }
    const path: number[] = [];
    let p = 0;
    while (p < BAL_VALUES.length) {
      path.push(p);
      if (BAL_VALUES[p] === target) return { path, steps: path.length };
      p = target < BAL_VALUES[p] ? 2 * p + 1 : 2 * p + 2;
    }
    return { path, steps: path.length };
  };

  return { chain, balanced, search };
}
