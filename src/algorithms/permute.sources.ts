import type { LangSource, PermuteExecPoint } from '@/components/player/types';

const ts = `function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  const cur: number[] = [];
  const used = new Array(nums.length).fill(false);
  const backtrack = (): void => {
    if (cur.length === nums.length) {
      res.push([...cur]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;   // 跳过已用（剪枝）
      used[i] = true;
      cur.push(nums[i]);       // 选 nums[i]
      backtrack();
      cur.pop();               // 撤销（回溯）
      used[i] = false;
    }
  };
  backtrack();
  return res;
}`;

const python = `def permute(nums):
    res = []
    cur = []
    used = [False] * len(nums)
    def backtrack():
        if len(cur) == len(nums):
            res.append(cur[:])
            return
        for i in range(len(nums)):
            if used[i]:          # 跳过已用（剪枝）
                continue
            used[i] = True
            cur.append(nums[i])  # 选 nums[i]
            backtrack()
            cur.pop()            # 撤销（回溯）
            used[i] = False
    backtrack()
    return res`;

const go = `func permute(nums []int) [][]int {
\tres := [][]int{}
\tcur := []int{}
\tused := make([]bool, len(nums))
\tvar backtrack func()
\tbacktrack = func() {
\t\tif len(cur) == len(nums) {
\t\t\tres = append(res, append([]int{}, cur...))
\t\t\treturn
\t\t}
\t\tfor i := 0; i < len(nums); i++ {
\t\t\tif used[i] {
\t\t\t\tcontinue
\t\t\t}
\t\t\tused[i] = true
\t\t\tcur = append(cur, nums[i]) // 选 nums[i]
\t\t\tbacktrack()
\t\t\tcur = cur[:len(cur)-1]     // 撤销（回溯）
\t\t\tused[i] = false
\t\t}
\t}
\tbacktrack()
\treturn res
}`;

const rust = `fn permute(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut res = Vec::new();
    let mut cur = Vec::new();
    let mut used = vec![false; nums.len()];
    fn backtrack(nums: &[i32], cur: &mut Vec<i32>, used: &mut Vec<bool>, res: &mut Vec<Vec<i32>>) {
        if cur.len() == nums.len() {
            res.push(cur.clone());
            return;
        }
        for i in 0..nums.len() {
            if used[i] {
                continue;
            }
            used[i] = true;
            cur.push(nums[i]);                       // 选 nums[i]
            backtrack(nums, cur, used, res);
            cur.pop();                               // 撤销（回溯）
            used[i] = false;
        }
    }
    backtrack(nums, &mut cur, &mut used, &mut res);
    res
}`;

export const permuteSources: LangSource<PermuteExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { start: 5, choose: 13, record: 7, backtrack: 15, done: 20 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { start: 5, choose: 13, record: 7, backtrack: 15, done: 18 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { start: 6, choose: 16, record: 8, backtrack: 18, done: 23 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { start: 5, choose: 15, record: 7, backtrack: 17, done: 22 },
  },
];
