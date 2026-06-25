import { ref, type Ref } from 'vue';

/** 限 4 层：完全二叉树 pos 0..14（第 4 层 8 个槽） */
export const TREE_MAX_POS = 14;

export interface TreeNode {
  id: string;
  value: number;
  pos: number; // 完全二叉树位序号：根=0，左=2·pos+1，右=2·pos+2
}
export interface InsertResult {
  ok: boolean;
  reason?: 'dup' | 'depth';
  pos?: number; // 落子位置（ok 时）
  path: number[]; // 比较经过的节点 pos（供组件逐层高亮）
}
export interface SearchResult {
  found: boolean;
  pos?: number;
  path: number[];
}
export interface UseTree {
  nodes: Ref<TreeNode[]>;
  has: (value: number) => boolean;
  nodeAt: (pos: number) => TreeNode | undefined;
  insert: (value: number) => InsertResult;
  search: (value: number) => SearchResult;
  inorder: () => number[];
  reset: () => void;
}

/** 初始预填：按 BST 插入顺序建成平衡 3 层（pos 0..6） */
const INITIAL = [50, 30, 70, 20, 40, 60, 80];

export function useTree(): UseTree {
  let idn = 0;
  const nodes = ref<TreeNode[]>([]);
  const nodeAt = (pos: number): TreeNode | undefined => nodes.value.find((n) => n.pos === pos);
  const has = (value: number): boolean => nodes.value.some((n) => n.value === value);

  const place = (value: number): InsertResult => {
    let pos = 0;
    const path: number[] = [];
    while (nodeAt(pos)) {
      path.push(pos);
      pos = value < nodeAt(pos)!.value ? 2 * pos + 1 : 2 * pos + 2;
      if (pos > TREE_MAX_POS) return { ok: false, reason: 'depth', path };
    }
    nodes.value.push({ id: `t${idn++}`, value, pos });
    return { ok: true, pos, path };
  };
  const insert = (value: number): InsertResult => {
    if (has(value)) return { ok: false, reason: 'dup', path: [] };
    return place(value);
  };
  const search = (value: number): SearchResult => {
    let pos = 0;
    const path: number[] = [];
    while (nodeAt(pos)) {
      const nd = nodeAt(pos)!;
      path.push(pos);
      if (nd.value === value) return { found: true, pos, path };
      pos = value < nd.value ? 2 * pos + 1 : 2 * pos + 2;
    }
    return { found: false, path };
  };
  const inorder = (): number[] => {
    const acc: number[] = [];
    const walk = (pos: number): void => {
      const nd = nodeAt(pos);
      if (!nd) return;
      walk(2 * pos + 1);
      acc.push(nd.value);
      walk(2 * pos + 2);
    };
    walk(0);
    return acc;
  };
  const reset = (): void => {
    nodes.value = [];
    for (const v of INITIAL) place(v);
  };

  reset();
  return { nodes, has, nodeAt, insert, search, inorder, reset };
}
