import type { LangSource, NetworkExecPoint } from '@/components/player/types';

// 双调排序（迭代位运算版）：k=子序列长（2,4..n），j=比较距离（k/2..1），每个 (k,j) 是一「列」，
// 同列所有比较器互不相干、可并行执行。(i&k)==0 决定该组方向（升/降），拼出双调再合并。
const ts = `function bitonicSort(a: number[]): void {
  const n = a.length;                        // n 为 2 的幂
  for (let k = 2; k <= n; k *= 2) {          // 阶段：构造长度 k 的双调段
    for (let j = k >> 1; j >= 1; j >>= 1) {  // 一列：比较距离 j（同列可并行）
      for (let i = 0; i < n; i++) {
        const l = i ^ j;                     // 与 i 距离 j 的伙伴
        if (l > i) {
          const asc = (i & k) === 0;         // 该段方向：升 or 降
          if (asc ? a[i] > a[l] : a[i] < a[l])
            [a[i], a[l]] = [a[l], a[i]];     // 比较交换（比较器）
        }
      }
    }
  }
}`;

const python = `def bitonic_sort(a):
    n = len(a)                        # n 为 2 的幂
    k = 2
    while k <= n:                     # 阶段：构造长度 k 的双调段
        j = k // 2
        while j >= 1:                 # 一列：比较距离 j（同列可并行）
            for i in range(n):
                l = i ^ j             # 与 i 距离 j 的伙伴
                if l > i:
                    asc = (i & k) == 0
                    if (asc and a[i] > a[l]) or (not asc and a[i] < a[l]):
                        a[i], a[l] = a[l], a[i]   # 比较交换
            j //= 2
        k *= 2`;

const go = `func bitonicSort(a []int) {
\tn := len(a)                        // n 为 2 的幂
\tfor k := 2; k <= n; k *= 2 {       // 阶段：构造长度 k 的双调段
\t\tfor j := k / 2; j >= 1; j /= 2 { // 一列：比较距离 j（同列可并行）
\t\t\tfor i := 0; i < n; i++ {
\t\t\t\tl := i ^ j                   // 与 i 距离 j 的伙伴
\t\t\t\tif l > i {
\t\t\t\t\tasc := i&k == 0
\t\t\t\t\tif (asc && a[i] > a[l]) || (!asc && a[i] < a[l]) {
\t\t\t\t\t\ta[i], a[l] = a[l], a[i]  // 比较交换
\t\t\t\t\t}
\t\t\t\t}
\t\t\t}
\t\t}
\t}
}`;

const rust = `fn bitonic_sort(a: &mut [u32]) {
    let n = a.len();                    // n 为 2 的幂
    let mut k = 2;
    while k <= n {                      // 阶段：构造长度 k 的双调段
        let mut j = k / 2;
        while j >= 1 {                  // 一列：比较距离 j（同列可并行）
            for i in 0..n {
                let l = i ^ j;          // 与 i 距离 j 的伙伴
                if l > i {
                    let asc = i & k == 0;
                    if (asc && a[i] > a[l]) || (!asc && a[i] < a[l]) {
                        a.swap(i, l);   // 比较交换
                    }
                }
            }
            j /= 2;
        }
        k *= 2;
    }
}`;

export const bitonicSources: LangSource<NetworkExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=入口 / column=一列（j 循环体）/ done=结束
    lineMap: { init: 2, column: 4, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, column: 6, done: 14 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, column: 4, done: 15 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, column: 6, done: 19 },
  },
];
