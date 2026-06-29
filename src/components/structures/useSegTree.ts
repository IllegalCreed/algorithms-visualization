import { ref, type Ref } from 'vue';

/** 固定数组：8 个元素，建求和线段树（完美二叉树，15 节点） */
export const SEG_ARRAY = [2, 5, 1, 4, 9, 3, 7, 6];

export interface SegNode {
  id: string;
  pos: number; // 0 下标堆式：children 2p+1 / 2p+2、parent (p-1)>>1
  lo: number;
  hi: number;
  sum: number;
  depth: number;
  isLeaf: boolean;
}
export interface SegQueryResult {
  sum: number;
  covered: number[]; // 取用的「整段」节点 pos（O(log n) 个）
}
export interface SegUpdateResult {
  path: number[]; // 叶→根路径上的节点 pos
}
export interface UseSegTree {
  nodes: Ref<SegNode[]>; // 15 节点（8 叶 pos 7..14 + 7 内部）
  size: number; // 元素数 8
  query: (l: number, r: number) => SegQueryResult;
  update: (i: number, val: number) => SegUpdateResult;
  reset: () => void;
}

/** 递归建求和线段树，写入 nodes[pos] */
function build(
  arr: number[],
  nodes: SegNode[],
  pos: number,
  lo: number,
  hi: number,
  depth: number,
) {
  const isLeaf = lo === hi;
  if (isLeaf) {
    nodes[pos] = { id: `sg${pos}`, pos, lo, hi, sum: arr[lo], depth, isLeaf: true };
    return;
  }
  const mid = (lo + hi) >> 1;
  build(arr, nodes, 2 * pos + 1, lo, mid, depth + 1);
  build(arr, nodes, 2 * pos + 2, mid + 1, hi, depth + 1);
  nodes[pos] = {
    id: `sg${pos}`,
    pos,
    lo,
    hi,
    sum: nodes[2 * pos + 1].sum + nodes[2 * pos + 2].sum,
    depth,
    isLeaf: false,
  };
}

function buildTree(arr: number[]): SegNode[] {
  const nodes: SegNode[] = [];
  build(arr, nodes, 0, 0, arr.length - 1, 0);
  return nodes;
}

export function useSegTree(): UseSegTree {
  const size = SEG_ARRAY.length;
  const nodes = ref<SegNode[]>(buildTree(SEG_ARRAY));

  /** 区间查询：把 [l,r] 拆成若干「正好被某节点完整覆盖」的整段（canonical cover） */
  const query = (l: number, r: number): SegQueryResult => {
    const covered: number[] = [];
    const list = nodes.value;
    const go = (pos: number): number => {
      const node = list[pos];
      if (r < node.lo || node.hi < l) return 0; // 不相交
      if (l <= node.lo && node.hi <= r) {
        covered.push(pos); // 完全落入 → 整段取用
        return node.sum;
      }
      return go(2 * pos + 1) + go(2 * pos + 2); // 部分相交 → 下沉
    };
    const sum = go(0);
    return { sum, covered };
  };

  /** 单点更新：下沉到叶 [i,i] 改值，再沿叶→根重算每个祖先的和 */
  const update = (i: number, val: number): SegUpdateResult => {
    const list = nodes.value;
    const rootToLeaf: number[] = [];
    let pos = 0;
    while (!list[pos].isLeaf) {
      rootToLeaf.push(pos);
      const mid = (list[pos].lo + list[pos].hi) >> 1;
      pos = i <= mid ? 2 * pos + 1 : 2 * pos + 2;
    }
    rootToLeaf.push(pos); // 叶
    list[pos] = { ...list[pos], sum: val };
    const path = [...rootToLeaf].reverse(); // 叶→根
    for (const p of path) {
      if (!list[p].isLeaf) {
        list[p] = { ...list[p], sum: list[2 * p + 1].sum + list[2 * p + 2].sum };
      }
    }
    nodes.value = [...list];
    return { path };
  };

  const reset = () => {
    nodes.value = buildTree(SEG_ARRAY);
  };

  return { nodes, size, query, update, reset };
}
