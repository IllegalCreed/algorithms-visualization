import type { LangSource, CocktailExecPoint } from '@/components/player/types';

const ts = `function cocktailSort(a: number[]): number[] {
  let left = 0, right = a.length - 1;
  while (left < right) {
    let swapped = false;
    for (let j = left; j < right; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    right--;
    if (!swapped) break;
    swapped = false;
    for (let j = right; j > left; j--) {
      if (a[j - 1] > a[j]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        swapped = true;
      }
    }
    left++;
    if (!swapped) break;
  }
  return a;
}`;

const python = `def cocktail_sort(a):
    left, right = 0, len(a) - 1
    while left < right:
        swapped = False
        for j in range(left, right):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        right -= 1
        if not swapped:
            break
        swapped = False
        for j in range(right, left, -1):
            if a[j - 1] > a[j]:
                a[j - 1], a[j] = a[j], a[j - 1]
                swapped = True
        left += 1
        if not swapped:
            break
    return a`;

const go = `func cocktailSort(a []int) []int {
\tleft, right := 0, len(a)-1
\tfor left < right {
\t\tswapped := false
\t\tfor j := left; j < right; j++ {
\t\t\tif a[j] > a[j+1] {
\t\t\t\ta[j], a[j+1] = a[j+1], a[j]
\t\t\t\tswapped = true
\t\t\t}
\t\t}
\t\tright--
\t\tif !swapped {
\t\t\tbreak
\t\t}
\t\tswapped = false
\t\tfor j := right; j > left; j-- {
\t\t\tif a[j-1] > a[j] {
\t\t\t\ta[j-1], a[j] = a[j], a[j-1]
\t\t\t\tswapped = true
\t\t\t}
\t\t}
\t\tleft++
\t\tif !swapped {
\t\t\tbreak
\t\t}
\t}
\treturn a
}`;

const rust = `fn cocktail_sort(a: &mut Vec<i32>) {
    let (mut left, mut right) = (0, a.len() - 1);
    while left < right {
        let mut swapped = false;
        for j in left..right {
            if a[j] > a[j + 1] {
                a.swap(j, j + 1);
                swapped = true;
            }
        }
        right -= 1;
        if !swapped {
            break;
        }
        swapped = false;
        let mut j = right;
        while j > left {
            if a[j - 1] > a[j] {
                a.swap(j - 1, j);
                swapped = true;
            }
            j -= 1;
        }
        left += 1;
        if !swapped {
            break;
        }
    }
}`;

export const cocktailSortSources: LangSource<CocktailExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: {
      forwardPass: 4,
      fCompare: 6,
      fSwap: 7,
      fNoSwap: 5,
      backwardPass: 13,
      bCompare: 15,
      bSwap: 16,
      bNoSwap: 14,
      done: 23,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: {
      forwardPass: 4,
      fCompare: 6,
      fSwap: 7,
      fNoSwap: 5,
      backwardPass: 12,
      bCompare: 14,
      bSwap: 15,
      bNoSwap: 13,
      done: 20,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: {
      forwardPass: 4,
      fCompare: 6,
      fSwap: 7,
      fNoSwap: 5,
      backwardPass: 15,
      bCompare: 17,
      bSwap: 18,
      bNoSwap: 16,
      done: 27,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: {
      forwardPass: 4,
      fCompare: 6,
      fSwap: 7,
      fNoSwap: 5,
      backwardPass: 15,
      bCompare: 18,
      bSwap: 19,
      bNoSwap: 17,
      done: 28,
    },
  },
];
