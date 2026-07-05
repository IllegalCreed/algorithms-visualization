import type { HungarianExecPoint, LangSource } from '@/components/player/types';

// 匈牙利算法：逐个左点 DFS 找增广路——空闲定下；被占则递归问占用者让路，让开整条翻转。
const ts = `function hungarian(adj: number[][], nL: number, nR: number): number {
  const matchR = new Array(nR).fill(-1);  // 右点的对象
  const dfs = (u: number, seen: Set<number>): boolean => {
    for (const v of adj[u]) {             // 试探每个候选岗位
      if (seen.has(v)) continue;
      seen.add(v);
      if (matchR[v] < 0 || dfs(matchR[v], seen)) { // 空闲，或占用者能让路
        matchR[v] = u;                    // 定亲 / 翻转
        return true;
      }
    }
    return false;                         // 无路可走：死路
  };
  let cnt = 0;
  for (let u = 0; u < nL; u++)            // 逐个左点找增广路
    if (dfs(u, new Set())) cnt++;
  return cnt;                             // 最大匹配数
}`;

const python = `def hungarian(adj, n_l, n_r):
    match_r = [-1] * n_r          # 右点的对象
    def dfs(u, seen):
        for v in adj[u]:          # 试探每个候选岗位
            if v in seen:
                continue
            seen.add(v)
            if match_r[v] < 0 or dfs(match_r[v], seen):
                match_r[v] = u    # 空闲或让路成功：定亲/翻转
                return True
        return False              # 无路可走：死路
    cnt = 0
    for u in range(n_l):          # 逐个左点找增广路
        if dfs(u, set()):
            cnt += 1
    return cnt                    # 最大匹配数`;

const go = `func hungarian(adj [][]int, nL, nR int) int {
\tmatchR := make([]int, nR) // 右点的对象
\tfor i := range matchR {
\t\tmatchR[i] = -1
\t}
\tvar dfs func(u int, seen map[int]bool) bool
\tdfs = func(u int, seen map[int]bool) bool {
\t\tfor _, v := range adj[u] { // 试探每个候选岗位
\t\t\tif seen[v] {
\t\t\t\tcontinue
\t\t\t}
\t\t\tseen[v] = true
\t\t\tif matchR[v] < 0 || dfs(matchR[v], seen) {
\t\t\t\tmatchR[v] = u // 空闲或让路成功：定亲/翻转
\t\t\t\treturn true
\t\t\t}
\t\t}
\t\treturn false // 无路可走：死路
\t}
\tcnt := 0
\tfor u := 0; u < nL; u++ { // 逐个左点找增广路
\t\tif dfs(u, map[int]bool{}) {
\t\t\tcnt++
\t\t}
\t}
\treturn cnt // 最大匹配数
}`;

const rust = `fn hungarian(adj: &[Vec<usize>], n_l: usize, n_r: usize) -> usize {
    let mut match_r = vec![usize::MAX; n_r]; // 右点的对象
    fn dfs(u: usize, adj: &[Vec<usize>], seen: &mut Vec<bool>, m: &mut Vec<usize>) -> bool {
        for &v in &adj[u] {                  // 试探每个候选岗位
            if seen[v] {
                continue;
            }
            seen[v] = true;
            if m[v] == usize::MAX || dfs(m[v], adj, seen, m) {
                m[v] = u;                    // 空闲或让路成功：定亲/翻转
                return true;
            }
        }
        false                                // 无路可走：死路
    }
    let mut cnt = 0;
    for u in 0..n_l {                        // 逐个左点找增广路
        if dfs(u, adj, &mut vec![false; n_r], &mut match_r) {
            cnt += 1;
        }
    }
    cnt                                      // 最大匹配数
}`;

export const hungarianSources: LangSource<HungarianExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建 matchR / try=试探候选 / match=定亲翻转 / fail=死路 / done=返回计数
    lineMap: { init: 2, try: 4, match: 8, fail: 12, done: 17 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, try: 4, match: 9, fail: 11, done: 16 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, try: 8, match: 14, fail: 18, done: 26 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, try: 4, match: 10, fail: 14, done: 22 },
  },
];
