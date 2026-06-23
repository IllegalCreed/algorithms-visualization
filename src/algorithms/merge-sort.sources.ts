import type { LangSource, MergeExecPoint } from '@/components/player/types';

const ts = `function mergeSort(a: number[]): number[] {
  const n = a.length;
  const temp = new Array(n);
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      let i = lo, j = mid, k = lo;
      while (i < mid && j < hi) {
        if (a[i] <= a[j]) {
          temp[k++] = a[i++];
        } else {
          temp[k++] = a[j++];
        }
      }
      while (i < mid) temp[k++] = a[i++];
      while (j < hi) temp[k++] = a[j++];
      for (let t = lo; t < hi; t++) a[t] = temp[t];
    }
  }
  return a;
}`;

const python = `def merge_sort(a):
    n = len(a)
    temp = [0] * n
    width = 1
    while width < n:
        for lo in range(0, n, 2 * width):
            mid = min(lo + width, n)
            hi = min(lo + 2 * width, n)
            i, j, k = lo, mid, lo
            while i < mid and j < hi:
                if a[i] <= a[j]:
                    temp[k] = a[i]; i += 1
                else:
                    temp[k] = a[j]; j += 1
                k += 1
            while i < mid:
                temp[k] = a[i]; i += 1; k += 1
            while j < hi:
                temp[k] = a[j]; j += 1; k += 1
            for t in range(lo, hi):
                a[t] = temp[t]
        width *= 2
    return a`;

const go = `func mergeSort(a []int) []int {
\tn := len(a)
\ttemp := make([]int, n)
\tfor width := 1; width < n; width *= 2 {
\t\tfor lo := 0; lo < n; lo += 2 * width {
\t\t\tmid := min(lo+width, n)
\t\t\thi := min(lo+2*width, n)
\t\t\ti, j, k := lo, mid, lo
\t\t\tfor i < mid && j < hi {
\t\t\t\tif a[i] <= a[j] {
\t\t\t\t\ttemp[k] = a[i]
\t\t\t\t\ti++
\t\t\t\t} else {
\t\t\t\t\ttemp[k] = a[j]
\t\t\t\t\tj++
\t\t\t\t}
\t\t\t\tk++
\t\t\t}
\t\t\tfor i < mid {
\t\t\t\ttemp[k] = a[i]
\t\t\t\ti++
\t\t\t\tk++
\t\t\t}
\t\t\tfor j < hi {
\t\t\t\ttemp[k] = a[j]
\t\t\t\tj++
\t\t\t\tk++
\t\t\t}
\t\t\tfor t := lo; t < hi; t++ {
\t\t\t\ta[t] = temp[t]
\t\t\t}
\t\t}
\t}
\treturn a
}`;

const rust = `fn merge_sort(a: &mut Vec<i32>) {
    let n = a.len();
    let mut temp = vec![0; n];
    let mut width = 1;
    while width < n {
        let mut lo = 0;
        while lo < n {
            let mid = (lo + width).min(n);
            let hi = (lo + 2 * width).min(n);
            let (mut i, mut j, mut k) = (lo, mid, lo);
            while i < mid && j < hi {
                if a[i] <= a[j] {
                    temp[k] = a[i];
                    i += 1;
                } else {
                    temp[k] = a[j];
                    j += 1;
                }
                k += 1;
            }
            while i < mid {
                temp[k] = a[i];
                i += 1;
                k += 1;
            }
            while j < hi {
                temp[k] = a[j];
                j += 1;
                k += 1;
            }
            for t in lo..hi {
                a[t] = temp[t];
            }
            lo += 2 * width;
        }
        width *= 2;
    }
}`;

export const mergeSortSources: LangSource<MergeExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      widthChange: 4,
      mergeStart: 5,
      compare: 10,
      takeLeft: 11,
      takeRight: 13,
      drainLeft: 16,
      drainRight: 17,
      writeBack: 18,
      done: 21,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      widthChange: 5,
      mergeStart: 6,
      compare: 11,
      takeLeft: 12,
      takeRight: 14,
      drainLeft: 17,
      drainRight: 19,
      writeBack: 21,
      done: 23,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      widthChange: 4,
      mergeStart: 5,
      compare: 10,
      takeLeft: 11,
      takeRight: 14,
      drainLeft: 20,
      drainRight: 25,
      writeBack: 30,
      done: 34,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      widthChange: 5,
      mergeStart: 7,
      compare: 12,
      takeLeft: 13,
      takeRight: 16,
      drainLeft: 22,
      drainRight: 27,
      writeBack: 32,
      done: 38,
    },
  },
];
