import type { LangSource, ThreeWayExecPoint } from '@/components/player/types';

const ts = `function quickSort3way(a: number[]): number[] {
  const stack: [number, number][] = [[0, a.length - 1]];
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    const pivot = a[lo];
    let lt = lo, i = lo, gt = hi;
    while (i <= gt) {
      if (a[i] < pivot) {
        [a[lt], a[i]] = [a[i], a[lt]];
        lt++; i++;
      } else if (a[i] > pivot) {
        [a[i], a[gt]] = [a[gt], a[i]];
        gt--;
      } else {
        i++;
      }
    }
    if (gt + 1 < hi) stack.push([gt + 1, hi]);
    if (lt - 1 > lo) stack.push([lo, lt - 1]);
  }
  return a;
}`;

const python = `def quick_sort_3way(a):
    stack = [(0, len(a) - 1)]
    while stack:
        lo, hi = stack.pop()
        pivot = a[lo]
        lt, i, gt = lo, lo, hi
        while i <= gt:
            if a[i] < pivot:
                a[lt], a[i] = a[i], a[lt]
                lt += 1
                i += 1
            elif a[i] > pivot:
                a[i], a[gt] = a[gt], a[i]
                gt -= 1
            else:
                i += 1
        if gt + 1 < hi:
            stack.append((gt + 1, hi))
        if lt - 1 > lo:
            stack.append((lo, lt - 1))
    return a`;

const go = `func quickSort3way(a []int) []int {
\tstack := [][2]int{{0, len(a) - 1}}
\tfor len(stack) > 0 {
\t\ttop := stack[len(stack)-1]
\t\tstack = stack[:len(stack)-1]
\t\tlo, hi := top[0], top[1]
\t\tpivot := a[lo]
\t\tlt, i, gt := lo, lo, hi
\t\tfor i <= gt {
\t\t\tif a[i] < pivot {
\t\t\t\ta[lt], a[i] = a[i], a[lt]
\t\t\t\tlt++
\t\t\t\ti++
\t\t\t} else if a[i] > pivot {
\t\t\t\ta[i], a[gt] = a[gt], a[i]
\t\t\t\tgt--
\t\t\t} else {
\t\t\t\ti++
\t\t\t}
\t\t}
\t\tif gt+1 < hi {
\t\t\tstack = append(stack, [2]int{gt + 1, hi})
\t\t}
\t\tif lt-1 > lo {
\t\t\tstack = append(stack, [2]int{lo, lt - 1})
\t\t}
\t}
\treturn a
}`;

const rust = `fn quick_sort_3way(a: &mut Vec<i32>) {
    let mut stack: Vec<(usize, usize)> = vec![(0, a.len() - 1)];
    while let Some((lo, hi)) = stack.pop() {
        let pivot = a[lo];
        let (mut lt, mut i, mut gt) = (lo, lo, hi);
        while i <= gt {
            if a[i] < pivot {
                a.swap(lt, i);
                lt += 1;
                i += 1;
            } else if a[i] > pivot {
                a.swap(i, gt);
                if gt == 0 { break; }
                gt -= 1;
            } else {
                i += 1;
            }
        }
        if gt + 1 < hi {
            stack.push((gt + 1, hi));
        }
        if lt > lo + 1 {
            stack.push((lo, lt - 1));
        }
    }
}`;

export const threeWayQuickSortSources: LangSource<ThreeWayExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      pop: 4,
      pivotSelect: 5,
      compare: 8,
      less: 9,
      greater: 12,
      equal: 15,
      push: 18,
      done: 21,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      pop: 4,
      pivotSelect: 5,
      compare: 8,
      less: 9,
      greater: 13,
      equal: 16,
      push: 18,
      done: 21,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      pop: 5,
      pivotSelect: 7,
      compare: 10,
      less: 11,
      greater: 15,
      equal: 18,
      push: 22,
      done: 28,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      pop: 3,
      pivotSelect: 4,
      compare: 7,
      less: 8,
      greater: 12,
      equal: 16,
      push: 20,
      done: 25,
    },
  },
];
