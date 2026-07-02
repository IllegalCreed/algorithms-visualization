import type { LangSource, DualPivotExecPoint } from '@/components/player/types';

const ts = `function dualPivotQuickSort(a: number[]): number[] {
  const stack: [number, number][] = [[0, a.length - 1]];
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    if (a[lo] > a[hi]) [a[lo], a[hi]] = [a[hi], a[lo]];
    const p = a[lo], q = a[hi];
    let lt = lo + 1, i = lo + 1, gt = hi - 1;
    while (i <= gt) {
      if (a[i] < p) {
        [a[lt], a[i]] = [a[i], a[lt]];
        lt++; i++;
      } else if (a[i] > q) {
        [a[i], a[gt]] = [a[gt], a[i]];
        gt--;
      } else {
        i++;
      }
    }
    lt--; gt++;
    [a[lo], a[lt]] = [a[lt], a[lo]];
    [a[hi], a[gt]] = [a[gt], a[hi]];
    if (hi > gt + 1) stack.push([gt + 1, hi]);
    if (gt - 1 > lt + 1) stack.push([lt + 1, gt - 1]);
    if (lt - 1 > lo) stack.push([lo, lt - 1]);
  }
  return a;
}`;

const python = `def dual_pivot_quick_sort(a):
    stack = [(0, len(a) - 1)]
    while stack:
        lo, hi = stack.pop()
        if a[lo] > a[hi]:
            a[lo], a[hi] = a[hi], a[lo]
        p, q = a[lo], a[hi]
        lt, i, gt = lo + 1, lo + 1, hi - 1
        while i <= gt:
            if a[i] < p:
                a[lt], a[i] = a[i], a[lt]
                lt += 1
                i += 1
            elif a[i] > q:
                a[i], a[gt] = a[gt], a[i]
                gt -= 1
            else:
                i += 1
        lt -= 1
        gt += 1
        a[lo], a[lt] = a[lt], a[lo]
        a[hi], a[gt] = a[gt], a[hi]
        if hi > gt + 1:
            stack.append((gt + 1, hi))
        if gt - 1 > lt + 1:
            stack.append((lt + 1, gt - 1))
        if lt - 1 > lo:
            stack.append((lo, lt - 1))
    return a`;

const go = `func dualPivotQuickSort(a []int) []int {
\tstack := [][2]int{{0, len(a) - 1}}
\tfor len(stack) > 0 {
\t\ttop := stack[len(stack)-1]
\t\tstack = stack[:len(stack)-1]
\t\tlo, hi := top[0], top[1]
\t\tif a[lo] > a[hi] {
\t\t\ta[lo], a[hi] = a[hi], a[lo]
\t\t}
\t\tp, q := a[lo], a[hi]
\t\tlt, i, gt := lo+1, lo+1, hi-1
\t\tfor i <= gt {
\t\t\tif a[i] < p {
\t\t\t\ta[lt], a[i] = a[i], a[lt]
\t\t\t\tlt++
\t\t\t\ti++
\t\t\t} else if a[i] > q {
\t\t\t\ta[i], a[gt] = a[gt], a[i]
\t\t\t\tgt--
\t\t\t} else {
\t\t\t\ti++
\t\t\t}
\t\t}
\t\tlt--
\t\tgt++
\t\ta[lo], a[lt] = a[lt], a[lo]
\t\ta[hi], a[gt] = a[gt], a[hi]
\t\tif hi > gt+1 {
\t\t\tstack = append(stack, [2]int{gt + 1, hi})
\t\t}
\t\tif gt-1 > lt+1 {
\t\t\tstack = append(stack, [2]int{lt + 1, gt - 1})
\t\t}
\t\tif lt-1 > lo {
\t\t\tstack = append(stack, [2]int{lo, lt - 1})
\t\t}
\t}
\treturn a
}`;

const rust = `fn dual_pivot_quick_sort(a: &mut Vec<i32>) {
    let mut stack: Vec<(usize, usize)> = vec![(0, a.len() - 1)];
    while let Some((lo, hi)) = stack.pop() {
        if a[lo] > a[hi] {
            a.swap(lo, hi);
        }
        let (p, q) = (a[lo], a[hi]);
        let (mut lt, mut i, mut gt) = (lo + 1, lo + 1, hi - 1);
        while i <= gt {
            if a[i] < p {
                a.swap(lt, i);
                lt += 1;
                i += 1;
            } else if a[i] > q {
                a.swap(i, gt);
                gt -= 1;
            } else {
                i += 1;
            }
        }
        lt -= 1;
        gt += 1;
        a.swap(lo, lt);
        a.swap(hi, gt);
        if hi > gt + 1 {
            stack.push((gt + 1, hi));
        }
        if gt > lt + 2 {
            stack.push((lt + 1, gt - 1));
        }
        if lt > lo + 1 {
            stack.push((lo, lt - 1));
        }
    }
}`;

export const dualPivotQuickSortSources: LangSource<DualPivotExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      pop: 4,
      pivotSelect: 6,
      compare: 9,
      less: 10,
      between: 16,
      greater: 13,
      pivotPlace: 20,
      push: 22,
      done: 26,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      pop: 4,
      pivotSelect: 7,
      compare: 10,
      less: 11,
      between: 18,
      greater: 15,
      pivotPlace: 21,
      push: 24,
      done: 29,
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
      less: 14,
      between: 21,
      greater: 18,
      pivotPlace: 26,
      push: 29,
      done: 38,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      pop: 3,
      pivotSelect: 7,
      compare: 10,
      less: 11,
      between: 18,
      greater: 15,
      pivotPlace: 23,
      push: 26,
      done: 34,
    },
  },
];
