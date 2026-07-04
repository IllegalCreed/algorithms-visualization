import type { LangSource, RsExecPoint } from '@/components/player/types';

// 判半二分：mid 切开的两半至少一半有序（a[lo]<=a[mid] ⟹ 左半有序）；
// 看目标在不在有序半的范围里决定去留，每步仍扔一半。
const ts = `function searchRotated(a: number[], t: number): number {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === t) return mid;               // 命中
    if (a[lo] <= a[mid]) {                      // 左半有序
      if (a[lo] <= t && t < a[mid]) hi = mid - 1; // 在有序左半
      else lo = mid + 1;                        // 否则去右半
    } else {                                    // 右半有序
      if (a[mid] < t && t <= a[hi]) lo = mid + 1; // 在有序右半
      else hi = mid - 1;                        // 否则去左半
    }
  }
  return -1;
}`;

const python = `def search_rotated(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == t:
            return mid                 # 命中
        if a[lo] <= a[mid]:            # 左半有序
            if a[lo] <= t < a[mid]:
                hi = mid - 1           # 在有序左半
            else:
                lo = mid + 1           # 否则去右半
        else:                          # 右半有序
            if a[mid] < t <= a[hi]:
                lo = mid + 1           # 在有序右半
            else:
                hi = mid - 1           # 否则去左半
    return -1`;

const go = `func searchRotated(a []int, t int) int {
\tlo, hi := 0, len(a)-1
\tfor lo <= hi {
\t\tmid := (lo + hi) / 2
\t\tif a[mid] == t {
\t\t\treturn mid // 命中
\t\t}
\t\tif a[lo] <= a[mid] { // 左半有序
\t\t\tif a[lo] <= t && t < a[mid] {
\t\t\t\thi = mid - 1 // 在有序左半
\t\t\t} else {
\t\t\t\tlo = mid + 1 // 否则去右半
\t\t\t}
\t\t} else { // 右半有序
\t\t\tif a[mid] < t && t <= a[hi] {
\t\t\t\tlo = mid + 1 // 在有序右半
\t\t\t} else {
\t\t\t\thi = mid - 1 // 否则去左半
\t\t\t}
\t\t}
\t}
\treturn -1
}`;

const rust = `fn search_rotated(a: &[i64], t: i64) -> i64 {
    let (mut lo, mut hi) = (0i64, a.len() as i64 - 1);
    while lo <= hi {
        let mid = (lo + hi) / 2;
        let (l, m, h) = (a[lo as usize], a[mid as usize], a[hi as usize]);
        if m == t {
            return mid; // 命中
        }
        if l <= m {
            // 左半有序
            if l <= t && t < m { hi = mid - 1 } else { lo = mid + 1 }
        } else {
            // 右半有序
            if m < t && t <= h { lo = mid + 1 } else { hi = mid - 1 }
        }
    }
    -1
}`;

export const rotSearchSources: LangSource<RsExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建区间 / probe=判半去留 / found=命中 / done=返回
    lineMap: { init: 2, probe: 6, found: 5, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, probe: 7, found: 6, done: 17 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, probe: 8, found: 6, done: 22 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, probe: 9, found: 7, done: 17 },
  },
];
