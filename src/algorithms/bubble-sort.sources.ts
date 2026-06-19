// src/algorithms/bubble-sort.sources.ts
import type { LangSource } from '@/components/player/types';

const ts = `function bubbleSort(a: number[]): number[] {
  const n = a.length;
  for (let end = n - 1; end > 0; end--) {
    for (let j = 0; j < end; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}`;

const python = `def bubble_sort(a):
    n = len(a)
    for end in range(n - 1, 0, -1):
        for j in range(end):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a`;

const go = `func bubbleSort(a []int) []int {
\tn := len(a)
\tfor end := n - 1; end > 0; end-- {
\t\tfor j := 0; j < end; j++ {
\t\t\tif a[j] > a[j+1] {
\t\t\t\ta[j], a[j+1] = a[j+1], a[j]
\t\t\t}
\t\t}
\t}
\treturn a
}`;

const rust = `fn bubble_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for end in (1..n).rev() {
        for j in 0..end {
            if a[j] > a[j + 1] {
                a.swap(j, j + 1);
            }
        }
    }
}`;

export const bubbleSortSources: LangSource[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 行: 1 fn / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / 10 return / 11 }
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 10 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 行: 1 def / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / 7 return
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 7 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 行: 1 func / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / 10 return
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 10 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 行: 1 fn / 2 n / 3 外层for / 4 内层for / 5 if / 6 swap / (无 return，done 落 fn 末行 10)
    lineMap: { outerLoop: 3, innerLoop: 4, compare: 5, swap: 6, noSwap: 5, done: 10 },
  },
];
