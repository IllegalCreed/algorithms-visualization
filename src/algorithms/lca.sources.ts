import type { LangSource, LcaExecPoint } from '@/components/player/types';

// LCA 倍增：建表（depth + up[k] 爸爸的爸爸递推）→ 查询三段式（对齐 / 试跳 / 父即答案）。
const ts = `function lca(n: number, fa: number[], LOG: number, u: number, v: number): number {
  const depth = new Array(n).fill(0);          // 建表：depth + up[0] = fa
  const up = [fa.slice()];
  for (let i = 1; i < n; i++) depth[i] = depth[fa[i]] + 1;
  for (let k = 1; k < LOG; k++)                // 爸爸的爸爸
    up.push(up[k - 1].map((p) => (p < 0 ? -1 : up[k - 1][p])));
  if (depth[u] < depth[v]) [u, v] = [v, u];
  for (let k = LOG - 1; k >= 0; k--)           // ① 对齐：深度差按二进制拆跳
    if ((depth[u] - depth[v]) & (1 << k)) u = up[k][u];
  if (u === v) return u;
  for (let k = LOG - 1; k >= 0; k--)
    if (up[k][u] !== up[k][v]) {               // ② 试跳：祖先不同才跳
      u = up[k][u];
      v = up[k][v];
    }
  return up[0][u];                             // ③ 停在两孩子，父即答案
}`;

const python = `def lca(n, fa, LOG, u, v):
    depth = [0] * n                    # 建表：depth + up[0] = fa
    up = [fa[:]]
    for i in range(1, n):
        depth[i] = depth[fa[i]] + 1
    for k in range(1, LOG):            # 爸爸的爸爸
        up.append([-1 if p < 0 else up[k-1][p] for p in up[k-1]])
    if depth[u] < depth[v]:
        u, v = v, u
    for k in range(LOG - 1, -1, -1):   # ① 对齐：深度差按二进制拆跳
        if (depth[u] - depth[v]) >> k & 1:
            u = up[k][u]
    if u == v:
        return u
    for k in range(LOG - 1, -1, -1):
        if up[k][u] != up[k][v]:       # ② 试跳：祖先不同才跳
            u = up[k][u]
            v = up[k][v]
    return up[0][u]                    # ③ 停在两孩子，父即答案`;

const go = `func lca(n int, fa []int, LOG, u, v int) int {
	depth := make([]int, n)             // 建表：depth + up[0] = fa
	up := [][]int{append([]int{}, fa...)}
	for i := 1; i < n; i++ {
		depth[i] = depth[fa[i]] + 1
	}
	for k := 1; k < LOG; k++ {          // 爸爸的爸爸
		row := make([]int, n)
		for x := 0; x < n; x++ {
			if up[k-1][x] < 0 {
				row[x] = -1
			} else {
				row[x] = up[k-1][up[k-1][x]]
			}
		}
		up = append(up, row)
	}
	if depth[u] < depth[v] {
		u, v = v, u
	}
	for k := LOG - 1; k >= 0; k-- {     // ① 对齐：深度差按二进制拆跳
		if (depth[u]-depth[v])>>k&1 == 1 {
			u = up[k][u]
		}
	}
	if u == v {
		return u
	}
	for k := LOG - 1; k >= 0; k-- {
		if up[k][u] != up[k][v] {       // ② 试跳：祖先不同才跳
			u = up[k][u]
			v = up[k][v]
		}
	}
	return up[0][u]                     // ③ 停在两孩子，父即答案
}`;

const rust = `fn lca(n: usize, fa: &[i32], log: usize, mut u: usize, mut v: usize) -> i32 {
    let mut depth = vec![0i32; n];      // 建表：depth + up[0] = fa
    let mut up = vec![fa.to_vec()];
    for i in 1..n {
        depth[i] = depth[fa[i] as usize] + 1;
    }
    for k in 1..log {                   // 爸爸的爸爸
        let prev = up[k - 1].clone();
        up.push(prev.iter().map(|&p| if p < 0 { -1 } else { prev[p as usize] }).collect());
    }
    if depth[u] < depth[v] {
        std::mem::swap(&mut u, &mut v);
    }
    for k in (0..log).rev() {           // ① 对齐：深度差按二进制拆跳
        if (depth[u] - depth[v]) >> k & 1 == 1 {
            u = up[k][u] as usize;
        }
    }
    if u == v {
        return u as i32;
    }
    for k in (0..log).rev() {
        if up[k][u] != up[k][v] {       // ② 试跳：祖先不同才跳
            u = up[k][u] as usize;
            v = up[k][v] as usize;
        }
    }
    up[0][u]                            // ③ 停在两孩子，父即答案
}`;

export const lcaSources: LangSource<LcaExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 1, build: 6, align: 9, jump: 12, answer: 16, done: 16 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 1, build: 7, align: 11, jump: 16, answer: 19, done: 19 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 1, build: 13, align: 22, jump: 30, answer: 35, done: 35 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 1, build: 9, align: 15, jump: 23, answer: 28, done: 28 },
  },
];
