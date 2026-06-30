import type { LangSource, RadixExecPoint } from '@/components/player/types';

const ts = `function radixSort(a: number[]): number[] {
  const maxVal = Math.max(...a);
  const passes = String(maxVal).length;
  for (let d = 0; d < passes; d++) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    const div = 10 ** d;
    for (const x of a) buckets[Math.floor(x / div) % 10].push(x);
    let w = 0;
    for (const bucket of buckets)
      for (const x of bucket) a[w++] = x;
  }
  return a;
}`;

const python = `def radix_sort(a):
    passes = len(str(max(a)))
    for d in range(passes):
        buckets = [[] for _ in range(10)]
        div = 10 ** d
        for x in a:
            buckets[(x // div) % 10].append(x)
        w = 0
        for bucket in buckets:
            for x in bucket:
                a[w] = x
                w += 1
    return a`;

const go = `func radixSort(a []int) []int {
\tmaxVal := a[0]
\tfor _, x := range a {
\t\tif x > maxVal {
\t\t\tmaxVal = x
\t\t}
\t}
\tfor div := 1; div <= maxVal; div *= 10 {
\t\tbuckets := make([][]int, 10)
\t\tfor _, x := range a {
\t\t\td := (x / div) % 10
\t\t\tbuckets[d] = append(buckets[d], x)
\t\t}
\t\tw := 0
\t\tfor _, bucket := range buckets {
\t\t\tfor _, x := range bucket {
\t\t\t\ta[w] = x
\t\t\t\tw++
\t\t\t}
\t\t}
\t}
\treturn a
}`;

const rust = `fn radix_sort(mut a: Vec<i32>) -> Vec<i32> {
    let max_val = *a.iter().max().unwrap();
    let mut div = 1;
    while div <= max_val {
        let mut buckets: Vec<Vec<i32>> = vec![vec![]; 10];
        for &x in a.iter() {
            buckets[((x / div) % 10) as usize].push(x);
        }
        let mut w = 0;
        for bucket in buckets {
            for x in bucket {
                a[w] = x;
                w += 1;
            }
        }
        div *= 10;
    }
    a
}`;

export const radixSortSources: LangSource<RadixExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { passStart: 4, distribute: 7, collect: 10, done: 12 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { passStart: 3, distribute: 7, collect: 11, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { passStart: 8, distribute: 12, collect: 17, done: 22 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { passStart: 4, distribute: 7, collect: 12, done: 18 },
  },
];
