import type { BsExecPoint, LangSource } from '@/components/player/types';

// 闭区间二分：while lo<=hi 取中点三分支；区间清空即不存在。
const ts = `function binarySearch(a: number[], t: number): number {
  let lo = 0, hi = a.length - 1;   // 候选区间 [lo, hi]
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;    // 探针：取中点
    if (a[mid] === t) return mid;  // 命中
    if (a[mid] < t) lo = mid + 1;  // 目标在右半：扔掉左半
    else hi = mid - 1;             // 目标在左半：扔掉右半
  }
  return -1;                       // 区间清空：不存在
}`;

const python = `def binary_search(a, t):
    lo, hi = 0, len(a) - 1       # 候选区间 [lo, hi]
    while lo <= hi:
        mid = (lo + hi) // 2     # 探针：取中点
        if a[mid] == t:
            return mid           # 命中
        if a[mid] < t:
            lo = mid + 1         # 目标在右半：扔掉左半
        else:
            hi = mid - 1         # 目标在左半：扔掉右半
    return -1                    # 区间清空：不存在`;

const go = `func binarySearch(a []int, t int) int {
\tlo, hi := 0, len(a)-1 // 候选区间 [lo, hi]
\tfor lo <= hi {
\t\tmid := (lo + hi) / 2 // 探针：取中点
\t\tif a[mid] == t {
\t\t\treturn mid // 命中
\t\t}
\t\tif a[mid] < t {
\t\t\tlo = mid + 1 // 目标在右半：扔掉左半
\t\t} else {
\t\t\thi = mid - 1 // 目标在左半：扔掉右半
\t\t}
\t}
\treturn -1 // 区间清空：不存在
}`;

const rust = `fn binary_search(a: &[i64], t: i64) -> i64 {
    let (mut lo, mut hi) = (0i64, a.len() as i64 - 1); // [lo, hi]
    while lo <= hi {
        let mid = (lo + hi) / 2;         // 探针：取中点
        if a[mid as usize] == t {
            return mid;                  // 命中
        }
        if a[mid as usize] < t {
            lo = mid + 1;                // 目标在右半：扔掉左半
        } else {
            hi = mid - 1;                // 目标在左半：扔掉右半
        }
    }
    -1                                   // 区间清空：不存在
}`;

export const bsearchSources: LangSource<BsExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建区间 / mid=探针 / found=命中 / cut=扔一半 / empty、done=返回 −1 或收尾
    lineMap: { init: 2, mid: 4, found: 5, cut: 6, empty: 9, done: 9 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, mid: 4, found: 6, cut: 8, empty: 11, done: 11 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, mid: 4, found: 6, cut: 9, empty: 14, done: 14 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, mid: 4, found: 6, cut: 9, empty: 14, done: 14 },
  },
];
