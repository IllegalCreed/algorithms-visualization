import type { LangSource, SubsetsExecPoint } from '@/components/player/types';

const ts = `function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  const cur: number[] = [];
  const backtrack = (i: number): void => {
    if (i === nums.length) {
      res.push([...cur]);
      return;
    }
    cur.push(nums[i]);       // 选 nums[i]
    backtrack(i + 1);
    cur.pop();               // 撤销（回溯）
    backtrack(i + 1);        // 不选 nums[i]
  };
  backtrack(0);
  return res;
}`;

const python = `def subsets(nums):
    res = []
    cur = []
    def backtrack(i):
        if i == len(nums):
            res.append(cur[:])
            return
        cur.append(nums[i])      # 选 nums[i]
        backtrack(i + 1)
        cur.pop()                # 撤销（回溯）
        backtrack(i + 1)         # 不选 nums[i]
    backtrack(0)
    return res`;

const go = `func subsets(nums []int) [][]int {
\tres := [][]int{}
\tcur := []int{}
\tvar backtrack func(i int)
\tbacktrack = func(i int) {
\t\tif i == len(nums) {
\t\t\tres = append(res, append([]int{}, cur...))
\t\t\treturn
\t\t}
\t\tcur = append(cur, nums[i]) // 选 nums[i]
\t\tbacktrack(i + 1)
\t\tcur = cur[:len(cur)-1]     // 撤销（回溯）
\t\tbacktrack(i + 1)           // 不选 nums[i]
\t}
\tbacktrack(0)
\treturn res
}`;

const rust = `fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let mut cur = Vec::new();
    fn backtrack(nums: &[i32], i: usize, cur: &mut Vec<i32>, res: &mut Vec<Vec<i32>>) {
        if i == nums.len() {
            res.push(cur.clone());
            return;
        }
        cur.push(nums[i]);                          // 选 nums[i]
        backtrack(nums, i + 1, cur, res);
        cur.pop();                                  // 撤销（回溯）
        backtrack(nums, i + 1, cur, res);           // 不选 nums[i]
    }
    backtrack(nums, 0, &mut cur, &mut res);
    res
}`;

export const subsetsSources: LangSource<SubsetsExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 4, include: 9, exclude: 12, record: 6, backtrack: 11, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 4, include: 8, exclude: 11, record: 6, backtrack: 10, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 5, include: 10, exclude: 13, record: 7, backtrack: 12, done: 16 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 4, include: 9, exclude: 12, record: 6, backtrack: 11, done: 15 },
  },
];
