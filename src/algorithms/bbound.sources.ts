import type { BbExecPoint, LangSource } from '@/components/player/types';

// 半开区间边界模板：while lo<hi 两分支，相遇点即答案；upperBound 只把 < 换成 <=。
const ts = `function lowerBound(a: number[], t: number): number {
  let lo = 0, hi = a.length;      // 半开区间 [lo, hi)，hi=n 哨兵
  while (lo < hi) {
    const mid = (lo + hi) >> 1;   // 探针
    if (a[mid] < t) lo = mid + 1; // 太小：答案在右
    else hi = mid;                // ≥ t：mid 可能就是答案
  }
  return lo;                      // 相遇点 = 第一个 ≥ t
}
// upperBound：把 < 换成 <=（等于也右走）→ 第一个 > t
// 个数 = upperBound − lowerBound`;

const python = `def lower_bound(a, t):
    lo, hi = 0, len(a)          # 半开区间 [lo, hi)，hi=n 哨兵
    while lo < hi:
        mid = (lo + hi) // 2    # 探针
        if a[mid] < t:
            lo = mid + 1        # 太小：答案在右
        else:
            hi = mid            # ≥ t：mid 可能就是答案
    return lo                   # 相遇点 = 第一个 ≥ t
# upper_bound：把 < 换成 <=（等于也右走）→ 第一个 > t
# 个数 = upper_bound − lower_bound`;

const go = `func lowerBound(a []int, t int) int {
\tlo, hi := 0, len(a) // 半开区间 [lo, hi)，hi=n 哨兵
\tfor lo < hi {
\t\tmid := (lo + hi) / 2 // 探针
\t\tif a[mid] < t {
\t\t\tlo = mid + 1 // 太小：答案在右
\t\t} else {
\t\t\thi = mid // ≥ t：mid 可能就是答案
\t\t}
\t}
\treturn lo // 相遇点 = 第一个 ≥ t
}
// upperBound：把 < 换成 <=（等于也右走）→ 第一个 > t`;

const rust = `fn lower_bound(a: &[i64], t: i64) -> usize {
    let (mut lo, mut hi) = (0, a.len()); // 半开区间 [lo, hi)
    while lo < hi {
        let mid = (lo + hi) / 2;         // 探针
        if a[mid] < t {
            lo = mid + 1;                // 太小：答案在右
        } else {
            hi = mid;                    // ≥ t：mid 可能就是答案
        }
    }
    lo                                   // 相遇点 = 第一个 ≥ t
}
// upper_bound：把 < 换成 <=（等于也右走）→ 第一个 > t`;

export const bboundSources: LangSource<BbExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=半开区间就位 / probe=探针收缩 / settle=相遇返回 / range、done=两界合拢注释
    lineMap: { init: 2, probe: 4, settle: 8, range: 11, done: 11 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, probe: 4, settle: 9, range: 10, done: 11 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, probe: 4, settle: 11, range: 13, done: 13 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, probe: 4, settle: 11, range: 13, done: 13 },
  },
];
