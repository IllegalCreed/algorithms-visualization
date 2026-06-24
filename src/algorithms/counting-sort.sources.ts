import type { CountingExecPoint, LangSource } from '@/components/player/types';

const ts = `function countingSort(a: number[]): number[] {
  const min = Math.min(...a), max = Math.max(...a);
  const count = new Array(max - min + 1).fill(0);
  for (let i = 0; i < a.length; i++) count[a[i] - min]++;
  let w = 0;
  for (let v = 0; v < count.length; v++) {
    while (count[v] > 0) {
      a[w++] = v + min;
      count[v]--;
    }
  }
  return a;
}`;

const python = `def counting_sort(a):
    lo = min(a)
    hi = max(a)
    count = [0] * (hi - lo + 1)
    for x in a:
        count[x - lo] += 1
    w = 0
    for v in range(len(count)):
        while count[v] > 0:
            a[w] = v + lo
            w += 1
            count[v] -= 1
    return a`;

const go = `func countingSort(a []int) []int {
\tlo, hi := a[0], a[0]
\tfor _, x := range a {
\t\tif x < lo {
\t\t\tlo = x
\t\t}
\t\tif x > hi {
\t\t\thi = x
\t\t}
\t}
\tcount := make([]int, hi-lo+1)
\tfor _, x := range a {
\t\tcount[x-lo]++
\t}
\tw := 0
\tfor v := 0; v < len(count); v++ {
\t\tfor count[v] > 0 {
\t\t\ta[w] = v + lo
\t\t\tw++
\t\t\tcount[v]--
\t\t}
\t}
\treturn a
}`;

const rust = `fn counting_sort(mut a: Vec<i32>) -> Vec<i32> {
    let lo = *a.iter().min().unwrap();
    let hi = *a.iter().max().unwrap();
    let mut count = vec![0; (hi - lo + 1) as usize];
    for &x in a.iter() {
        count[(x - lo) as usize] += 1;
    }
    let mut w = 0;
    for v in 0..count.len() {
        while count[v] > 0 {
            a[w] = v as i32 + lo;
            w += 1;
            count[v] -= 1;
        }
    }
    a
}`;

export const countingSortSources: LangSource<CountingExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { count: 4, bucketStart: 6, writeBack: 8, done: 12 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { count: 6, bucketStart: 8, writeBack: 10, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { count: 13, bucketStart: 16, writeBack: 18, done: 23 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { count: 6, bucketStart: 9, writeBack: 11, done: 16 },
  },
];
