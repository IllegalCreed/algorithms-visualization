import type { LangSource, QuickExecPoint } from '@/components/player/types';

const ts = `function quickSort(a: number[]): number[] {
  const n = a.length;
  const stack: [number, number][] = [[0, n - 1]];
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    if (lo >= hi) continue;
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    stack.push([i + 1, hi]);
    stack.push([lo, i - 1]);
  }
  return a;
}`;

const python = `def quick_sort(a):
    n = len(a)
    stack = [(0, n - 1)]
    while stack:
        lo, hi = stack.pop()
        if lo >= hi:
            continue
        pivot = a[hi]
        i = lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        stack.append((i + 1, hi))
        stack.append((lo, i - 1))
    return a`;

const go = `func quickSort(a []int) []int {
\tstack := [][2]int{{0, len(a) - 1}}
\tfor len(stack) > 0 {
\t\ttop := stack[len(stack)-1]
\t\tstack = stack[:len(stack)-1]
\t\tlo, hi := top[0], top[1]
\t\tif lo >= hi {
\t\t\tcontinue
\t\t}
\t\tpivot := a[hi]
\t\ti := lo
\t\tfor j := lo; j < hi; j++ {
\t\t\tif a[j] < pivot {
\t\t\t\ta[i], a[j] = a[j], a[i]
\t\t\t\ti++
\t\t\t}
\t\t}
\t\ta[i], a[hi] = a[hi], a[i]
\t\tstack = append(stack, [2]int{i + 1, hi})
\t\tstack = append(stack, [2]int{lo, i - 1})
\t}
\treturn a
}`;

const rust = `fn quick_sort(a: &mut Vec<i32>) {
    let mut stack: Vec<(usize, usize)> = vec![];
    if a.len() >= 2 {
        stack.push((0, a.len() - 1));
    }
    while let Some((lo, hi)) = stack.pop() {
        let pivot = a[hi];
        let mut i = lo;
        for j in lo..hi {
            if a[j] < pivot {
                a.swap(i, j);
                i += 1;
            }
        }
        a.swap(i, hi);
        if i + 1 < hi {
            stack.push((i + 1, hi));
        }
        if lo + 1 < i {
            stack.push((lo, i - 1));
        }
    }
}`;

export const quickSortSources: LangSource<QuickExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      pop: 5,
      pivotSelect: 7,
      compare: 10,
      swap: 11,
      noSwap: 9,
      pivotPlace: 15,
      push: 16,
      done: 19,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      pop: 5,
      pivotSelect: 8,
      compare: 11,
      swap: 12,
      noSwap: 10,
      pivotPlace: 14,
      push: 15,
      done: 17,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      pop: 5,
      pivotSelect: 10,
      compare: 13,
      swap: 14,
      noSwap: 12,
      pivotPlace: 18,
      push: 19,
      done: 22,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      pop: 6,
      pivotSelect: 7,
      compare: 10,
      swap: 11,
      noSwap: 9,
      pivotPlace: 15,
      push: 17,
      done: 22,
    },
  },
];
