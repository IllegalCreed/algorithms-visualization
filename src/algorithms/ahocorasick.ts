// src/algorithms/ahocorasick.ts
// AC 自动机 Aho-Corasick 固定实例 + Trie + BFS fail + 多模式匹配 oracle。字符串第 7 页（C-075，复用 GraphView）。
// 模式 {he, she, hers} + 文本 "ushers"；8 状态、3 条非平凡 fail 边、命中 she[1,3]/he[2,3]/hers[2,5]。

export const AC_PATTERNS = ['he', 'she', 'hers'];
export const AC_TEXT = 'ushers';

export interface AcState {
  id: number;
  char: string; // 入边字符（root 为 ''）
  parent: number; // 父状态（root 为 -1）
  depth: number;
  goto: Record<string, number>; // 转移
  out: number[]; // 以此结尾的模式下标（已沿 fail 链合并）
  fail: number; // fail 指针
  label: string; // 路径串（root 为 'ε'）
}

/** 构 Trie + BFS 建 fail（父的 fail 先算好），返回状态表 + BFS 序。
 *  fail=[0,0,0,0,1,2,0,3]；非平凡 fail：sh→h、she→he、hers→s。 */
export function buildAc(): { states: AcState[]; bfsOrder: number[] } {
  const states: AcState[] = [
    { id: 0, char: '', parent: -1, depth: 0, goto: {}, out: [], fail: 0, label: 'ε' },
  ];
  const newNode = (parent: number, char: string): number => {
    const id = states.length;
    states.push({
      id,
      char,
      parent,
      depth: states[parent].depth + 1,
      goto: {},
      out: [],
      fail: 0,
      label: states[parent].label === 'ε' ? char : states[parent].label + char,
    });
    return id;
  };
  // 建 Trie
  AC_PATTERNS.forEach((pat, pi) => {
    let s = 0;
    for (const c of pat) {
      if (states[s].goto[c] === undefined) states[s].goto[c] = newNode(s, c);
      s = states[s].goto[c];
    }
    states[s].out.push(pi);
  });
  // BFS 建 fail
  const bfsOrder: number[] = [];
  const queue: number[] = [];
  for (const c of Object.keys(states[0].goto)) {
    const v = states[0].goto[c];
    states[v].fail = 0;
    queue.push(v);
  }
  while (queue.length) {
    const u = queue.shift() as number;
    bfsOrder.push(u);
    for (const c of Object.keys(states[u].goto)) {
      const v = states[u].goto[c];
      queue.push(v);
      let f = states[u].fail;
      while (f !== 0 && states[f].goto[c] === undefined) f = states[f].fail;
      const cand = states[f].goto[c];
      states[v].fail = cand !== undefined && cand !== v ? cand : 0;
      // 输出链合并：out[v] += out[fail[v]]
      states[v].out = [...states[v].out, ...states[states[v].fail].out];
    }
  }
  return { states, bfsOrder };
}

/** 在文本上跑自动机，返回所有命中（含重叠）。→ she[1,3]、he[2,3]、hers[2,5]。 */
export function acMatch(): { pat: string; start: number; end: number }[] {
  const { states } = buildAc();
  const hits: { pat: string; start: number; end: number }[] = [];
  let s = 0;
  for (let i = 0; i < AC_TEXT.length; i++) {
    const c = AC_TEXT[i];
    while (s !== 0 && states[s].goto[c] === undefined) s = states[s].fail;
    s = states[s].goto[c] ?? 0;
    for (const pi of states[s].out) {
      const L = AC_PATTERNS[pi].length;
      hits.push({ pat: AC_PATTERNS[pi], start: i - L + 1, end: i });
    }
  }
  return hits;
}

/** 8 状态固定坐标（viewBox 460×300）：h 链左（h→he→her→hers）/ s 链右（s→sh→she）/ root 顶。 */
export const AC_VERTS = [
  { id: 0, label: 'ε', x: 230, y: 34 },
  { id: 1, label: 'h', x: 150, y: 96 },
  { id: 2, label: 'e', x: 150, y: 158 },
  { id: 3, label: 's', x: 330, y: 96 },
  { id: 4, label: 'h', x: 330, y: 158 },
  { id: 5, label: 'e', x: 330, y: 220 },
  { id: 6, label: 'r', x: 150, y: 220 },
  { id: 7, label: 's', x: 150, y: 282 },
];
