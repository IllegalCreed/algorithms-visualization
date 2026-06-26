/** 固定词集：共享前缀 ca（cat/car/card/cup）、car（car/card）、do（do/dog） */
export const TRIE_WORDS = ['cat', 'car', 'card', 'cup', 'do', 'dog'];

export interface TNode {
  id: string;
  char: string; // 入此节点的边字符；root 为 ''
  isEnd: boolean; // 一个单词在此结束
  depth: number;
  x: number;
  y: number;
  parent: number; // 父节点下标；root 为 -1
}
export interface TrieSearchResult {
  path: number[]; // 走过的节点下标（含 root）
  found: boolean; // 精确命中（走到底且 isEnd）
  reason: 'found' | 'prefix-only' | 'no-edge';
}
export interface PrefixResult {
  path: number[]; // 到前缀节点的路径
  prefixNode: number; // 前缀节点下标；无则 -1
  subtree: number[]; // 前缀节点子树全部下标
  words: string[]; // 子树内全部完整词（排序）
}
export interface UseTrie {
  nodes: TNode[];
  edges: [number, number][]; // [父, 子]
  words: string[]; // 词集（排序）
  search: (word: string) => TrieSearchResult;
  startsWith: (prefix: string) => PrefixResult;
}

interface BuildNode {
  char: string;
  isEnd: boolean;
  children: Map<string, BuildNode>;
}

export function useTrie(): UseTrie {
  // 1) 建树
  const root: BuildNode = { char: '', isEnd: false, children: new Map() };
  for (const w of TRIE_WORDS) {
    let cur = root;
    for (const ch of w) {
      if (!cur.children.has(ch))
        cur.children.set(ch, { char: ch, isEnd: false, children: new Map() });
      cur = cur.children.get(ch)!;
    }
    cur.isEnd = true;
  }

  // 2) DFS 前序扁平化 + leaf-packing 布局
  const nodes: TNode[] = [];
  const edges: [number, number][] = [];
  let idc = 0;
  let leafX = 0;
  const layout = (bn: BuildNode, depth: number, parent: number): number => {
    const idx = nodes.length;
    const node: TNode = {
      id: `t${idc++}`,
      char: bn.char,
      isEnd: bn.isEnd,
      depth,
      x: 0,
      y: 30 + depth * 60,
      parent,
    };
    nodes.push(node);
    if (parent >= 0) edges.push([parent, idx]);
    const keys = [...bn.children.keys()].sort();
    if (keys.length === 0) {
      node.x = 50 + leafX * 105;
      leafX += 1;
    } else {
      let sum = 0;
      for (const k of keys) sum += nodes[layout(bn.children.get(k)!, depth + 1, idx)].x;
      node.x = sum / keys.length;
    }
    return idx;
  };
  layout(root, 0, -1);

  // 3) 纯查询
  const childByChar = (parent: number, ch: string): number => {
    for (const [p, c] of edges) if (p === parent && nodes[c].char === ch) return c;
    return -1;
  };
  const descendants = (r: number): number[] => {
    const out = [r];
    for (const [p, c] of edges) if (p === r) out.push(...descendants(c));
    return out;
  };
  const wordOf = (idx: number): string => {
    const chars: string[] = [];
    let cur = idx;
    while (cur > 0) {
      chars.push(nodes[cur].char);
      cur = nodes[cur].parent;
    }
    return chars.reverse().join('');
  };

  const search = (word: string): TrieSearchResult => {
    const path = [0];
    let cur = 0;
    for (const ch of word) {
      const next = childByChar(cur, ch);
      if (next === -1) return { path, found: false, reason: 'no-edge' };
      cur = next;
      path.push(cur);
    }
    return nodes[cur].isEnd
      ? { path, found: true, reason: 'found' }
      : { path, found: false, reason: 'prefix-only' };
  };
  const startsWith = (prefix: string): PrefixResult => {
    const path = [0];
    let cur = 0;
    for (const ch of prefix) {
      const next = childByChar(cur, ch);
      if (next === -1) return { path, prefixNode: -1, subtree: [], words: [] };
      cur = next;
      path.push(cur);
    }
    const subtree = descendants(cur);
    const words = subtree
      .filter((i) => nodes[i].isEnd)
      .map(wordOf)
      .sort();
    return { path, prefixNode: cur, subtree, words };
  };

  const words = nodes
    .map((n, i) => (n.isEnd ? wordOf(i) : null))
    .filter((w): w is string => w !== null)
    .sort();

  return { nodes, edges, words, search, startsWith };
}
