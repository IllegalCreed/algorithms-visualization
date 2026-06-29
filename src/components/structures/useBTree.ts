/** 固定 2 层 B+ 树（阶-5，每节点最多 4 key）：root 路标 + 3 叶（数据全在叶 + 叶链） */
export interface BNode {
  id: string;
  keys: number[];
  isLeaf: boolean;
  childrenIds: string[]; // 内部节点的子指针（叶子为空）
  nextId: string | null; // 叶链 next（仅叶子；最后一个为 null）
}
export interface BSearchResult {
  path: string[]; // 下钻路径节点 id（root→叶）
  found: boolean;
  leafId: string;
  hitKey: number | null;
}
export interface BRangeResult {
  leafPath: string[]; // 范围扫描经过的叶 id
  values: number[]; // 扫到的 [lo,hi] 内的 key
}
export interface UseBTree {
  nodes: BNode[]; // [root, l0, l1, l2]
  byId: (id: string) => BNode;
  search: (target: number) => BSearchResult;
  rangeScan: (lo: number, hi: number) => BRangeResult;
}

function buildTree(): BNode[] {
  return [
    {
      id: 'bt-root',
      keys: [25, 45],
      isLeaf: false,
      childrenIds: ['bt-l0', 'bt-l1', 'bt-l2'],
      nextId: null,
    },
    { id: 'bt-l0', keys: [5, 10, 15, 20], isLeaf: true, childrenIds: [], nextId: 'bt-l1' },
    { id: 'bt-l1', keys: [25, 30, 35, 40], isLeaf: true, childrenIds: [], nextId: 'bt-l2' },
    { id: 'bt-l2', keys: [45, 50, 55, 60], isLeaf: true, childrenIds: [], nextId: null },
  ];
}

export function useBTree(): UseBTree {
  const nodes = buildTree();
  const byId = (id: string) => nodes.find((n) => n.id === id)!;

  /** 内部节点按 routerKey 选子：childIndex = key ≤ target 的个数（routerKey = 右子树首 key，>= 走右） */
  const descend = (target: number): { path: string[]; leaf: BNode } => {
    const path: string[] = [];
    let node = byId('bt-root');
    path.push(node.id);
    while (!node.isLeaf) {
      const idx = node.keys.filter((k) => k <= target).length;
      node = byId(node.childrenIds[idx]);
      path.push(node.id);
    }
    return { path, leaf: node };
  };

  const search = (target: number): BSearchResult => {
    const { path, leaf } = descend(target);
    const found = leaf.keys.includes(target);
    return { path, found, leafId: leaf.id, hitKey: found ? target : null };
  };

  /** B+ 树范围查：定位起点叶，沿 next 链向右收集 [lo,hi]，遇某叶末 key > hi 即停 */
  const rangeScan = (lo: number, hi: number): BRangeResult => {
    const { leaf } = descend(lo);
    const leafPath: string[] = [];
    const values: number[] = [];
    let cur: BNode | null = leaf;
    while (cur) {
      leafPath.push(cur.id);
      for (const k of cur.keys) if (k >= lo && k <= hi) values.push(k);
      if (cur.keys[cur.keys.length - 1] > hi) break; // 后续叶更大，停
      cur = cur.nextId ? byId(cur.nextId) : null;
    }
    return { leafPath, values };
  };

  return { nodes, byId, search, rangeScan };
}
