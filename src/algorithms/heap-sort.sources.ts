import type { HeapExecPoint, LangSource } from '@/components/player/types';

const ts = `function heapSort(a: number[]): number[] {
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    siftDown(a, i, n);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(a, 0, end);
  }
  return a;
}
function siftDown(a: number[], i: number, size: number) {
  while (2 * i + 1 < size) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest === i) break;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}`;

const python = `def heap_sort(a):
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(a, i, n)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift_down(a, 0, end)
    return a

def sift_down(a, i, size):
    while 2 * i + 1 < size:
        largest = i
        l, r = 2 * i + 1, 2 * i + 2
        if a[l] > a[largest]:
            largest = l
        if r < size and a[r] > a[largest]:
            largest = r
        if largest == i:
            break
        a[i], a[largest] = a[largest], a[i]
        i = largest
    return a`;

const go = `func heapSort(a []int) []int {
\tn := len(a)
\tfor i := n/2 - 1; i >= 0; i-- {
\t\tsiftDown(a, i, n)
\t}
\tfor end := n - 1; end > 0; end-- {
\t\ta[0], a[end] = a[end], a[0]
\t\tsiftDown(a, 0, end)
\t}
\treturn a
}

func siftDown(a []int, i, size int) {
\tfor 2*i+1 < size {
\t\tlargest := i
\t\tl, r := 2*i+1, 2*i+2
\t\tif a[l] > a[largest] {
\t\t\tlargest = l
\t\t}
\t\tif r < size && a[r] > a[largest] {
\t\t\tlargest = r
\t\t}
\t\tif largest == i {
\t\t\tbreak
\t\t}
\t\ta[i], a[largest] = a[largest], a[i]
\t\ti = largest
\t}
}`;

const rust = `fn heap_sort(a: &mut Vec<i32>) {
    let n = a.len();
    for i in (0..n / 2).rev() {
        sift_down(a, i, n);
    }
    for end in (1..n).rev() {
        a.swap(0, end);
        sift_down(a, 0, end);
    }
}

fn sift_down(a: &mut Vec<i32>, mut i: usize, size: usize) {
    while 2 * i + 1 < size {
        let mut largest = i;
        let (l, r) = (2 * i + 1, 2 * i + 2);
        if a[l] > a[largest] {
            largest = l;
        }
        if r < size && a[r] > a[largest] {
            largest = r;
        }
        if largest == i {
            break;
        }
        a.swap(i, largest);
        i = largest;
    }
}`;

export const heapSortSources: LangSource<HeapExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { heapify: 3, compare: 15, swap: 18, settle: 17, extract: 6, done: 9 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { heapify: 3, compare: 14, swap: 20, settle: 18, extract: 6, done: 8 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { heapify: 3, compare: 17, swap: 26, settle: 23, extract: 7, done: 10 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { heapify: 3, compare: 16, swap: 25, settle: 22, extract: 7, done: 10 },
  },
];
