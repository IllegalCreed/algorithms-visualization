import type { LangSource, BinaryInsertionExecPoint } from '@/components/player/types';

const ts = `function binaryInsertionSort(a: number[]): number[] {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let lo = 0, hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (key < a[mid]) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    const pos = lo;
    for (let k = i; k > pos; k--) {
      a[k] = a[k - 1];
    }
    a[pos] = key;
  }
  return a;
}`;

const python = `def binary_insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        lo, hi = 0, i
        while lo < hi:
            mid = (lo + hi) // 2
            if key < a[mid]:
                hi = mid
            else:
                lo = mid + 1
        pos = lo
        for k in range(i, pos, -1):
            a[k] = a[k - 1]
        a[pos] = key
    return a`;

const go = `func binaryInsertionSort(a []int) []int {
\tfor i := 1; i < len(a); i++ {
\t\tkey := a[i]
\t\tlo, hi := 0, i
\t\tfor lo < hi {
\t\t\tmid := (lo + hi) / 2
\t\t\tif key < a[mid] {
\t\t\t\thi = mid
\t\t\t} else {
\t\t\t\tlo = mid + 1
\t\t\t}
\t\t}
\t\tpos := lo
\t\tfor k := i; k > pos; k-- {
\t\t\ta[k] = a[k-1]
\t\t}
\t\ta[pos] = key
\t}
\treturn a
}`;

const rust = `fn binary_insertion_sort(a: &mut Vec<i32>) {
    for i in 1..a.len() {
        let key = a[i];
        let (mut lo, mut hi) = (0, i);
        while lo < hi {
            let mid = (lo + hi) / 2;
            if key < a[mid] {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        let pos = lo;
        let mut k = i;
        while k > pos {
            a[k] = a[k - 1];
            k -= 1;
        }
        a[pos] = key;
    }
}`;

export const binaryInsertionSortSources: LangSource<BinaryInsertionExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      outerLoop: 3,
      probe: 6,
      goLeft: 8,
      goRight: 10,
      found: 13,
      shift: 15,
      insert: 17,
      done: 19,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      outerLoop: 3,
      probe: 6,
      goLeft: 8,
      goRight: 10,
      found: 11,
      shift: 13,
      insert: 14,
      done: 15,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      outerLoop: 3,
      probe: 6,
      goLeft: 8,
      goRight: 10,
      found: 13,
      shift: 15,
      insert: 17,
      done: 19,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      outerLoop: 3,
      probe: 6,
      goLeft: 8,
      goRight: 10,
      found: 13,
      shift: 16,
      insert: 19,
      done: 21,
    },
  },
];
