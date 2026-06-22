import type { InsertionExecPoint, LangSource } from '@/components/player/types';

const ts = `function insertionSort(a: number[]): number[] {
  const n = a.length;
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}`;

const python = `def insertion_sort(a):
    n = len(a)
    for i in range(1, n):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a`;

const go = `func insertionSort(a []int) []int {
\tn := len(a)
\tfor i := 1; i < n; i++ {
\t\tkey := a[i]
\t\tj := i - 1
\t\tfor j >= 0 && a[j] > key {
\t\t\ta[j+1] = a[j]
\t\t\tj--
\t\t}
\t\ta[j+1] = key
\t}
\treturn a
}`;

const rust = `fn insertion_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for i in 1..n {
        let key = a[i];
        let mut j = i as i32 - 1;
        while j >= 0 && a[j as usize] > key {
            a[(j + 1) as usize] = a[j as usize];
            j -= 1;
        }
        a[(j + 1) as usize] = key;
    }
}`;

export const insertionSortSources: LangSource<InsertionExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 1 fn / 2 n / 3 外层for / 4 key / 5 j / 6 while比较 / 7 右移 / 8 j-- / 10 insert / 12 return
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 10, done: 12 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 1 def / 2 n / 3 外层for / 4 key / 5 j / 6 while比较 / 7 右移 / 8 j-=1 / 9 insert / 10 return
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 9, done: 10 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 1 func / 2 n / 3 外层for / 4 key / 5 j / 6 for比较 / 7 右移 / 8 j-- / 10 insert / 12 return
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 10, done: 12 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 1 fn / 2 n / 3 外层for / 4 key / 5 j(i32) / 6 while比较 / 7 右移 / 8 j-=1 / 10 insert / 12 末尾}（无 return）
    lineMap: { outerLoop: 3, compare: 6, shift: 7, insert: 10, done: 12 },
  },
];
