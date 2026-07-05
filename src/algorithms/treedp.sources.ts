import type { LangSource, TreeDpExecPoint } from '@/components/player/types';

// 树形 DP：后序递归，每节点返回两态 [选, 不选]；根取 max。
const ts = `function rob(root: Node | null): number {
  const dfs = (nd: Node | null): [number, number] => {
    if (!nd) return [0, 0];               // 空子树两态皆 0
    const [ls, ln] = dfs(nd.left);        // 后序：先算孩子
    const [rs, rn] = dfs(nd.right);
    const sel = nd.val + ln + rn;         // 选它：孩子都不能选
    const not = Math.max(ls, ln) + Math.max(rs, rn); // 不选：孩子自由
    return [sel, not];
  };
  return Math.max(...dfs(root));          // 根取两态最大
}`;

const python = `def rob(root):
    def dfs(nd):
        if not nd:
            return 0, 0            # 空子树两态皆 0
        ls, ln = dfs(nd.left)      # 后序：先算孩子
        rs, rn = dfs(nd.right)
        sel = nd.val + ln + rn     # 选它：孩子都不能选
        not_ = max(ls, ln) + max(rs, rn)  # 不选：孩子自由
        return sel, not_
    return max(dfs(root))          # 根取两态最大`;

const go = `func rob(root *Node) int {
\tvar dfs func(nd *Node) (int, int)
\tdfs = func(nd *Node) (int, int) {
\t\tif nd == nil {
\t\t\treturn 0, 0 // 空子树两态皆 0
\t\t}
\t\tls, ln := dfs(nd.Left) // 后序：先算孩子
\t\trs, rn := dfs(nd.Right)
\t\tsel := nd.Val + ln + rn                // 选它：孩子都不能选
\t\tnot := max(ls, ln) + max(rs, rn)       // 不选：孩子自由
\t\treturn sel, not
\t}
\tsel, not := dfs(root)
\treturn max(sel, not) // 根取两态最大
}`;

const rust = `fn rob(root: &Option<Box<Node>>) -> i64 {
    fn dfs(nd: &Option<Box<Node>>) -> (i64, i64) {
        match nd {
            None => (0, 0),                       // 空子树两态皆 0
            Some(b) => {
                let (ls, ln) = dfs(&b.left);      // 后序：先算孩子
                let (rs, rn) = dfs(&b.right);
                let sel = b.val + ln + rn;        // 选它：孩子都不能选
                let not = ls.max(ln) + rs.max(rn); // 不选：孩子自由
                (sel, not)
            }
        }
    }
    let (sel, not) = dfs(root);
    sel.max(not)                                  // 根取两态最大
}`;

export const treeDpSources: LangSource<TreeDpExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=入口 / leaf=空子树基例 / sel=选公式 / not=不选公式 / best、done=根取 max
    lineMap: { init: 2, leaf: 3, sel: 6, not: 7, best: 10, done: 10 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, leaf: 4, sel: 7, not: 8, best: 10, done: 10 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 3, leaf: 5, sel: 9, not: 10, best: 14, done: 14 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, leaf: 4, sel: 8, not: 9, best: 15, done: 15 },
  },
];
