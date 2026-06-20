import type { LangSource, SelectionExecPoint } from '@/components/player/types';

const ts = `function selectionSort(a: number[]): number[] {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}`;

const python = `def selection_sort(a):
    n = len(a)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if a[j] < a[min_idx]:
                min_idx = j
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
    return a`;

const go = `func selectionSort(a []int) []int {
\tn := len(a)
\tfor i := 0; i < n-1; i++ {
\t\tminIdx := i
\t\tfor j := i + 1; j < n; j++ {
\t\t\tif a[j] < a[minIdx] {
\t\t\t\tminIdx = j
\t\t\t}
\t\t}
\t\tif minIdx != i {
\t\t\ta[i], a[minIdx] = a[minIdx], a[i]
\t\t}
\t}
\treturn a
}`;

const rust = `fn selection_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for i in 0..n - 1 {
        let mut min_idx = i;
        for j in i + 1..n {
            if a[j] < a[min_idx] {
                min_idx = j;
            }
        }
        if min_idx != i {
            a.swap(i, min_idx);
        }
    }
}`;

export const selectionSortSources: LangSource<SelectionExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 1 fn / 2 n / 3 外层for / 4 minIdx / 5 内层for / 6 if比较 / 7 newMin / 11 swap / 10 if(noSwap) / 14 return
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 11, noSwap: 10, done: 14 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 1 def / 2 n / 3 外层for / 4 min_idx / 5 内层for / 6 if比较 / 7 newMin / 9 swap / 8 if(noSwap) / 10 return
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 9, noSwap: 8, done: 10 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 1 func / 2 n / 3 外层for / 4 minIdx / 5 内层for / 6 if比较 / 7 newMin / 11 swap / 10 if(noSwap) / 14 return
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 11, noSwap: 10, done: 14 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 1 fn / 2 n / 3 外层for / 4 min_idx / 5 内层for / 6 if比较 / 7 newMin / 11 swap / 10 if(noSwap) / (无 return，done 落 14)
    lineMap: { outerLoop: 3, innerLoop: 5, compare: 6, newMin: 7, swap: 11, noSwap: 10, done: 14 },
  },
];
