import type { LangSource, TopDownMergeExecPoint } from '@/components/player/types';

const ts = `function mergeSort(a: number[], lo = 0, hi = a.length - 1): number[] {
  if (lo >= hi) return a;
  const mid = (lo + hi) >> 1;
  mergeSort(a, lo, mid);
  mergeSort(a, mid + 1, hi);
  const temp: number[] = [];
  let i = lo, j = mid + 1;
  while (i <= mid && j <= hi) {
    if (a[i] <= a[j]) {
      temp.push(a[i++]);
    } else {
      temp.push(a[j++]);
    }
  }
  while (i <= mid) temp.push(a[i++]);
  while (j <= hi) temp.push(a[j++]);
  for (let k = 0; k < temp.length; k++) a[lo + k] = temp[k];
  return a;
}`;

const python = `def merge_sort(a, lo=0, hi=None):
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return a
    mid = (lo + hi) // 2
    merge_sort(a, lo, mid)
    merge_sort(a, mid + 1, hi)
    temp = []
    i, j = lo, mid + 1
    while i <= mid and j <= hi:
        if a[i] <= a[j]:
            temp.append(a[i])
            i += 1
        else:
            temp.append(a[j])
            j += 1
    while i <= mid:
        temp.append(a[i])
        i += 1
    while j <= hi:
        temp.append(a[j])
        j += 1
    for k, v in enumerate(temp):
        a[lo + k] = v
    return a`;

const go = `func mergeSort(a []int, lo, hi int) []int {
\tif lo >= hi {
\t\treturn a
\t}
\tmid := (lo + hi) / 2
\tmergeSort(a, lo, mid)
\tmergeSort(a, mid+1, hi)
\ttemp := []int{}
\ti, j := lo, mid+1
\tfor i <= mid && j <= hi {
\t\tif a[i] <= a[j] {
\t\t\ttemp = append(temp, a[i])
\t\t\ti++
\t\t} else {
\t\t\ttemp = append(temp, a[j])
\t\t\tj++
\t\t}
\t}
\tfor i <= mid {
\t\ttemp = append(temp, a[i])
\t\ti++
\t}
\tfor j <= hi {
\t\ttemp = append(temp, a[j])
\t\tj++
\t}
\tfor k, v := range temp {
\t\ta[lo+k] = v
\t}
\treturn a
}`;

const rust = `fn merge_sort(a: &mut Vec<i32>, lo: usize, hi: usize) {
    if lo >= hi {
        return;
    }
    let mid = (lo + hi) / 2;
    merge_sort(a, lo, mid);
    merge_sort(a, mid + 1, hi);
    let mut temp: Vec<i32> = vec![];
    let (mut i, mut j) = (lo, mid + 1);
    while i <= mid && j <= hi {
        if a[i] <= a[j] {
            temp.push(a[i]);
            i += 1;
        } else {
            temp.push(a[j]);
            j += 1;
        }
    }
    while i <= mid {
        temp.push(a[i]);
        i += 1;
    }
    while j <= hi {
        temp.push(a[j]);
        j += 1;
    }
    for (k, v) in temp.iter().enumerate() {
        a[lo + k] = *v;
    }
}`;

export const topDownMergeSortSources: LangSource<TopDownMergeExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      split: 3,
      mergeStart: 6,
      compare: 9,
      takeLeft: 10,
      takeRight: 12,
      drainLeft: 15,
      drainRight: 16,
      writeBack: 17,
      done: 18,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      split: 6,
      mergeStart: 9,
      compare: 12,
      takeLeft: 13,
      takeRight: 16,
      drainLeft: 19,
      drainRight: 22,
      writeBack: 25,
      done: 26,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      split: 5,
      mergeStart: 8,
      compare: 11,
      takeLeft: 12,
      takeRight: 15,
      drainLeft: 20,
      drainRight: 24,
      writeBack: 28,
      done: 30,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      split: 5,
      mergeStart: 8,
      compare: 11,
      takeLeft: 12,
      takeRight: 15,
      drainLeft: 20,
      drainRight: 24,
      writeBack: 28,
      done: 30,
    },
  },
];
