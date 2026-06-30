import type { LangSource, BucketExecPoint } from '@/components/player/types';

const ts = `function bucketSort(a: number[]): number[] {
  const buckets: number[][] = Array.from({ length: 5 }, () => []);
  for (const x of a) buckets[Math.min((x / 10) | 0, 4)].push(x);
  for (const b of buckets) b.sort((x, y) => x - y);
  let w = 0;
  for (const b of buckets)
    for (const x of b) a[w++] = x;
  return a;
}`;

const python = `def bucket_sort(a):
    buckets = [[] for _ in range(5)]
    for x in a:
        buckets[min(x // 10, 4)].append(x)
    for b in buckets:
        b.sort()
    w = 0
    for b in buckets:
        for x in b:
            a[w] = x
            w += 1
    return a`;

const go = `func bucketSort(a []int) []int {
\tbuckets := make([][]int, 5)
\tfor _, x := range a {
\t\tb := x / 10
\t\tif b > 4 {
\t\t\tb = 4
\t\t}
\t\tbuckets[b] = append(buckets[b], x)
\t}
\tfor i := range buckets {
\t\tsort.Ints(buckets[i])
\t}
\tw := 0
\tfor _, bucket := range buckets {
\t\tfor _, x := range bucket {
\t\t\ta[w] = x
\t\t\tw++
\t\t}
\t}
\treturn a
}`;

const rust = `fn bucket_sort(mut a: Vec<i32>) -> Vec<i32> {
    let mut buckets: Vec<Vec<i32>> = vec![vec![]; 5];
    for &x in a.iter() {
        let b = ((x / 10) as usize).min(4);
        buckets[b].push(x);
    }
    for bucket in buckets.iter_mut() {
        bucket.sort();
    }
    let mut w = 0;
    for bucket in buckets {
        for x in bucket {
            a[w] = x;
            w += 1;
        }
    }
    a
}`;

export const bucketSortSources: LangSource<BucketExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { distribute: 3, sortBucket: 4, concat: 7, done: 8 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { distribute: 4, sortBucket: 6, concat: 10, done: 12 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { distribute: 8, sortBucket: 11, concat: 16, done: 20 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { distribute: 5, sortBucket: 8, concat: 13, done: 17 },
  },
];
