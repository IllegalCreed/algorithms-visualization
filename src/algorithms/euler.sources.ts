import type { EulerExecPoint, LangSource } from '@/components/player/types';

// 欧拉路径 Hierholzer：奇度判定 → 栈法走边消边、卡住弹栈进路径 → 反转。
const ts = `function eulerPath(n: number, edges: [number, number][]): number[] {
  const adj = Array.from({ length: n }, () => [] as { v: number; eid: number }[]);
  edges.forEach(([u, v], i) => { adj[u].push({ v, eid: i }); adj[v].push({ v: u, eid: i }); });
  const deg = adj.map((a) => a.length);
  const odd = [...Array(n).keys()].filter((u) => deg[u] % 2 === 1);  // 判定：奇度点 0/2
  if (odd.length !== 0 && odd.length !== 2) return [];
  const start = odd.length ? odd[0] : 0;         // 有奇度点必须从它出发
  const used = new Array(edges.length).fill(false);
  const stack = [start];
  const path: number[] = [];
  while (stack.length) {
    const u = stack[stack.length - 1];
    const next = adj[u].find((e) => !used[e.eid]);
    if (next) {
      used[next.eid] = true;                     // 还有未用边：消边 + 压栈
      stack.push(next.v);
    } else {
      stack.pop();                               // 卡住：弹栈进路径
      path.push(u);
    }
  }
  return path.reverse();                         // 反转弹出序即欧拉路径
}`;

const python = `def euler_path(n, edges):
    adj = [[] for _ in range(n)]
    for i, (u, v) in enumerate(edges):
        adj[u].append((v, i)); adj[v].append((u, i))
    deg = [len(a) for a in adj]
    odd = [u for u in range(n) if deg[u] % 2 == 1]   # 判定：奇度点 0/2
    if len(odd) not in (0, 2):
        return []
    start = odd[0] if odd else 0
    used = [False] * len(edges)
    stack, path = [start], []
    while stack:
        u = stack[-1]
        nxt = next(((v, i) for v, i in adj[u] if not used[i]), None)
        if nxt:
            used[nxt[1]] = True            # 还有未用边：消边 + 压栈
            stack.append(nxt[0])
        else:
            path.append(stack.pop())       # 卡住：弹栈进路径
    return path[::-1]                      # 反转即欧拉路径`;

const go = `func eulerPath(n int, edges [][2]int) []int {
	type he struct{ v, eid int }
	adj := make([][]he, n)
	for i, e := range edges {
		adj[e[0]] = append(adj[e[0]], he{e[1], i})
		adj[e[1]] = append(adj[e[1]], he{e[0], i})
	}
	odd := []int{}
	for u := 0; u < n; u++ {
		if len(adj[u])%2 == 1 {
			odd = append(odd, u)        // 判定：奇度点 0/2
		}
	}
	if len(odd) != 0 && len(odd) != 2 {
		return nil
	}
	start := 0
	if len(odd) > 0 {
		start = odd[0]
	}
	used := make([]bool, len(edges))
	stack := []int{start}
	path := []int{}
	for len(stack) > 0 {
		u := stack[len(stack)-1]
		moved := false
		for _, e := range adj[u] {
			if !used[e.eid] {
				used[e.eid] = true      // 还有未用边：消边 + 压栈
				stack = append(stack, e.v)
				moved = true
				break
			}
		}
		if !moved {
			stack = stack[:len(stack)-1]
			path = append(path, u)      // 卡住：弹栈进路径
		}
	}
	for i, j := 0, len(path)-1; i < j; i, j = i+1, j-1 {
		path[i], path[j] = path[j], path[i]
	}
	return path                         // 反转即欧拉路径
}`;

const rust = `fn euler_path(n: usize, edges: &[(usize, usize)]) -> Vec<usize> {
    let mut adj = vec![vec![]; n];
    for (i, &(u, v)) in edges.iter().enumerate() {
        adj[u].push((v, i));
        adj[v].push((u, i));
    }
    let odd: Vec<usize> = (0..n).filter(|&u| adj[u].len() % 2 == 1).collect(); // 判定
    if odd.len() != 0 && odd.len() != 2 {
        return vec![];
    }
    let start = *odd.first().unwrap_or(&0);
    let mut used = vec![false; edges.len()];
    let mut stack = vec![start];
    let mut path = vec![];
    while let Some(&u) = stack.last() {
        if let Some(&(v, eid)) = adj[u].iter().find(|&&(_, e)| !used[e]) {
            used[eid] = true;            // 还有未用边：消边 + 压栈
            stack.push(v);
        } else {
            path.push(stack.pop().unwrap()); // 卡住：弹栈进路径
        }
    }
    path.reverse();                      // 反转即欧拉路径
    path
}`;

export const eulerSources: LangSource<EulerExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 1, check: 5, walk: 15, back: 18, done: 22 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 1, check: 6, walk: 16, back: 19, done: 20 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 1, check: 11, walk: 29, back: 37, done: 43 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 1, check: 7, walk: 17, back: 20, done: 23 },
  },
];
