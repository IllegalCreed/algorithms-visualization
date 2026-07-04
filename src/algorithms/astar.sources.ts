import type { AstarExecPoint, LangSource } from '@/components/player/types';

// A*：优先队列按 f=g+h 弹出；h 可采纳（不高估）则终点出队即最优。
const ts = `function astar(grid: Grid, s: Cell, t: Cell): Cell[] {
  const open = new MinHeap<Cell>();       // 按 f = g + h
  g.set(s, 0); open.push(s, h(s));
  while (!open.empty()) {
    const cur = open.pop();               // 弹出 f 最小
    if (cur === t) break;                 // 终点出队 → 已最优
    for (const nb of neighbors(cur)) {    // 四方向邻居
      const ng = g.get(cur) + 1;
      if (ng < (g.get(nb) ?? Infinity)) { // 松弛
        g.set(nb, ng); parent.set(nb, cur);
        open.push(nb, ng + h(nb));        // f = g + h 入队
      }
    }
  }
  return tracePath(parent, t);            // 沿 parent 回溯
}`;

const python = `def astar(grid, s, t):
    open_q = [(h(s), s)]          # 按 f = g + h
    g = {s: 0}; parent = {}
    while open_q:
        f, cur = heappop(open_q)  # 弹出 f 最小
        if cur == t:
            break                 # 终点出队 → 已最优
        for nb in neighbors(cur): # 四方向邻居
            ng = g[cur] + 1
            if ng < g.get(nb, inf):   # 松弛
                g[nb] = ng; parent[nb] = cur
                heappush(open_q, (ng + h(nb), nb))
    return trace_path(parent, t)  # 沿 parent 回溯`;

const go = `func astar(grid Grid, s, t Cell) []Cell {
\topen := NewMinHeap() // 按 f = g + h
\tg[s] = 0
\topen.Push(s, h(s))
\tfor !open.Empty() {
\t\tcur := open.Pop() // 弹出 f 最小
\t\tif cur == t {
\t\t\tbreak // 终点出队 → 已最优
\t\t}
\t\tfor _, nb := range neighbors(cur) { // 四方向邻居
\t\t\tng := g[cur] + 1
\t\t\tif ng < getOr(g, nb, INF) { // 松弛
\t\t\t\tg[nb] = ng
\t\t\t\tparent[nb] = cur
\t\t\t\topen.Push(nb, ng+h(nb)) // f = g + h 入队
\t\t\t}
\t\t}
\t}
\treturn tracePath(parent, t) // 沿 parent 回溯
}`;

const rust = `fn astar(grid: &Grid, s: Cell, t: Cell) -> Vec<Cell> {
    let mut open = BinaryHeap::new(); // 按 f = g + h（小顶）
    g.insert(s, 0);
    open.push((h(s), s));
    while let Some((_f, cur)) = open.pop() { // 弹出 f 最小
        if cur == t {
            break; // 终点出队 → 已最优
        }
        for nb in neighbors(cur) {           // 四方向邻居
            let ng = g[&cur] + 1;
            if ng < *g.get(&nb).unwrap_or(&i64::MAX) { // 松弛
                g.insert(nb, ng);
                parent.insert(nb, cur);
                open.push((ng + h(nb), nb)); // f = g + h 入队
            }
        }
    }
    trace_path(&parent, t) // 沿 parent 回溯
}`;

export const astarSources: LangSource<AstarExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建 open / expand=弹出+松弛 / goal=终点出队 / trace=回溯 / done=返回
    lineMap: { init: 2, expand: 5, goal: 6, trace: 15, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, expand: 5, goal: 7, trace: 13, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, expand: 6, goal: 8, trace: 19, done: 19 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, expand: 5, goal: 7, trace: 18, done: 18 },
  },
];
