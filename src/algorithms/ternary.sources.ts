import type { LangSource, TerExecPoint } from '@/components/player/types';

// 三分查找：双探针 m1/m2 对决，谁小峰不在谁外侧、丢那 1/3；每轮区间 ×2/3。
const ts = `function ternaryPeak(a: number[]): number {
  let lo = 0, hi = a.length - 1;        // 单峰数组
  while (lo < hi) {
    const third = ((hi - lo) / 3) | 0;
    const m1 = lo + third, m2 = hi - third; // 两个三分探针
    if (a[m1] < a[m2]) lo = m1 + 1;     // 峰不在 m1 左侧：丢左 1/3
    else hi = m2 - 1;                   // 峰不在 m2 右侧：丢右 1/3
  }
  return lo;                            // 峰顶
}
// 坡度二分变体：比较 a[mid] 与 a[mid+1]，上坡去右、下坡去左`;

const python = `def ternary_peak(a):
    lo, hi = 0, len(a) - 1           # 单峰数组
    while lo < hi:
        third = (hi - lo) // 3
        m1, m2 = lo + third, hi - third  # 两个三分探针
        if a[m1] < a[m2]:
            lo = m1 + 1              # 峰不在 m1 左侧：丢左 1/3
        else:
            hi = m2 - 1              # 峰不在 m2 右侧：丢右 1/3
    return lo                        # 峰顶
# 坡度二分变体：比较 a[mid] 与 a[mid+1]`;

const go = `func ternaryPeak(a []int) int {
\tlo, hi := 0, len(a)-1 // 单峰数组
\tfor lo < hi {
\t\tthird := (hi - lo) / 3
\t\tm1, m2 := lo+third, hi-third // 两个三分探针
\t\tif a[m1] < a[m2] {
\t\t\tlo = m1 + 1 // 峰不在 m1 左侧：丢左 1/3
\t\t} else {
\t\t\thi = m2 - 1 // 峰不在 m2 右侧：丢右 1/3
\t\t}
\t}
\treturn lo // 峰顶
}
// 坡度二分变体：比较 a[mid] 与 a[mid+1]`;

const rust = `fn ternary_peak(a: &[i64]) -> usize {
    let (mut lo, mut hi) = (0, a.len() - 1); // 单峰数组
    while lo < hi {
        let third = (hi - lo) / 3;
        let (m1, m2) = (lo + third, hi - third); // 两个三分探针
        if a[m1] < a[m2] {
            lo = m1 + 1; // 峰不在 m1 左侧：丢左 1/3
        } else {
            hi = m2 - 1; // 峰不在 m2 右侧：丢右 1/3
        }
    }
    lo // 峰顶
}
// 坡度二分变体：比较 a[mid] 与 a[mid+1]`;

export const ternarySources: LangSource<TerExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=建区间 / probe=双探针对决 / peak=相遇返回 / done=变体注释
    lineMap: { init: 2, probe: 6, peak: 9, done: 11 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, probe: 6, peak: 10, done: 11 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, probe: 6, peak: 12, done: 14 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, probe: 6, peak: 12, done: 14 },
  },
];
