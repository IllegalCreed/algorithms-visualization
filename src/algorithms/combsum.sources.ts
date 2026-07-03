import type { CombSumExecPoint, LangSource } from '@/components/player/types';

const ts = `function combinationSum(cands: number[], target: number): number[][] {
  const res: number[][] = [];
  const cur: number[] = [];
  const backtrack = (start: number, sum: number): void => {
    if (sum === target) {
      res.push([...cur]);
      return;
    }
    for (let i = start; i < cands.length; i++) {
      if (sum + cands[i] > target) continue; // 剪枝：加上去会超目标
      cur.push(cands[i]);
      backtrack(i + 1, sum + cands[i]);
      cur.pop();                             // 撤销（回溯）
    }
  };
  backtrack(0, 0);
  return res;
}`;

const python = `def combination_sum(cands, target):
    res = []
    cur = []
    def backtrack(start, s):
        if s == target:
            res.append(cur[:])
            return
        for i in range(start, len(cands)):
            if s + cands[i] > target:   # 剪枝：加上去会超目标
                continue
            cur.append(cands[i])
            backtrack(i + 1, s + cands[i])
            cur.pop()                   # 撤销（回溯）
    backtrack(0, 0)
    return res`;

const go = `func combinationSum(cands []int, target int) [][]int {
\tres := [][]int{}
\tcur := []int{}
\tvar backtrack func(start, sum int)
\tbacktrack = func(start, sum int) {
\t\tif sum == target {
\t\t\tres = append(res, append([]int{}, cur...))
\t\t\treturn
\t\t}
\t\tfor i := start; i < len(cands); i++ {
\t\t\tif sum+cands[i] > target { // 剪枝：加上去会超目标
\t\t\t\tcontinue
\t\t\t}
\t\t\tcur = append(cur, cands[i])
\t\t\tbacktrack(i+1, sum+cands[i])
\t\t\tcur = cur[:len(cur)-1] // 撤销（回溯）
\t\t}
\t}
\tbacktrack(0, 0)
\treturn res
}`;

const rust = `fn combination_sum(cands: &[i32], target: i32) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let mut cur = Vec::new();
    fn backtrack(cands: &[i32], target: i32, start: usize, sum: i32, cur: &mut Vec<i32>, res: &mut Vec<Vec<i32>>) {
        if sum == target {
            res.push(cur.clone());
            return;
        }
        for i in start..cands.len() {
            if sum + cands[i] > target {   // 剪枝：加上去会超目标
                continue;
            }
            cur.push(cands[i]);
            backtrack(cands, target, i + 1, sum + cands[i], cur, res);
            cur.pop();                     // 撤销（回溯）
        }
    }
    backtrack(cands, target, 0, 0, &mut cur, &mut res);
    res
}`;

export const combsumSources: LangSource<CombSumExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 4, include: 11, prune: 10, record: 6, backtrack: 13, done: 17 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 4, include: 11, prune: 9, record: 6, backtrack: 13, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 5, include: 14, prune: 11, record: 7, backtrack: 16, done: 20 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 4, include: 13, prune: 10, record: 6, backtrack: 15, done: 19 },
  },
];
