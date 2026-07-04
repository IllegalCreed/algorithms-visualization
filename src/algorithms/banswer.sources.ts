import type { BaExecPoint, LangSource } from '@/components/player/types';

// 二分答案：在答案空间 [1, max] 上跑 lower_bound，谓词 = 可行性（单调）。
const ts = `function minEatingSpeed(piles: number[], h: number): number {
  let lo = 1, hi = Math.max(...piles);       // 答案空间 [1, max]
  while (lo < hi) {
    const mid = (lo + hi) >> 1;              // 试一个答案
    if (canFinish(piles, mid, h)) hi = mid;  // 可行：答案还能更小
    else lo = mid + 1;                       // 不可行：只能加速
  }
  return lo;                                 // 最小可行速度
}
// canFinish(k)：Σ ceil(pile / k) <= h —— k 越大越可行（单调谓词）`;

const python = `def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)         # 答案空间 [1, max]
    while lo < hi:
        mid = (lo + hi) // 2       # 试一个答案
        if can_finish(piles, mid, h):
            hi = mid               # 可行：答案还能更小
        else:
            lo = mid + 1           # 不可行：只能加速
    return lo                      # 最小可行速度
# can_finish(k)：sum(ceil(p / k)) <= h —— 单调谓词`;

const go = `func minEatingSpeed(piles []int, h int) int {
\tlo, hi := 1, maxOf(piles) // 答案空间 [1, max]
\tfor lo < hi {
\t\tmid := (lo + hi) / 2 // 试一个答案
\t\tif canFinish(piles, mid, h) {
\t\t\thi = mid // 可行：答案还能更小
\t\t} else {
\t\t\tlo = mid + 1 // 不可行：只能加速
\t\t}
\t}
\treturn lo // 最小可行速度
}
// canFinish(k)：Σ ceil(pile/k) <= h —— 单调谓词`;

const rust = `fn min_eating_speed(piles: &[i64], h: i64) -> i64 {
    let (mut lo, mut hi) = (1, *piles.iter().max().unwrap());
    while lo < hi {
        let mid = (lo + hi) / 2;        // 试一个答案
        if can_finish(piles, mid, h) {
            hi = mid;                   // 可行：答案还能更小
        } else {
            lo = mid + 1;               // 不可行：只能加速
        }
    }
    lo                                  // 最小可行速度
}
// can_finish(k)：Σ ceil(pile/k) <= h —— 单调谓词`;

export const banswerSources: LangSource<BaExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=答案空间 / probe=试探可行性 / settle=相遇返回 / done=谓词注释
    lineMap: { init: 2, probe: 5, settle: 8, done: 10 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, probe: 5, settle: 9, done: 10 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, probe: 5, settle: 11, done: 13 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, probe: 5, settle: 11, done: 13 },
  },
];
