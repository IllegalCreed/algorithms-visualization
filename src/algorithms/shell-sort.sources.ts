import type { LangSource, ShellExecPoint } from '@/components/player/types';

const ts = `function shellSort(a: number[]): number[] {
  const n = a.length;
  for (let gap = n >> 1; gap > 0; gap >>= 1) {
    for (let start = 0; start < gap; start++) {
      for (let i = start + gap; i < n; i += gap) {
        const key = a[i];
        let j = i;
        while (j >= gap && a[j - gap] > key) {
          a[j] = a[j - gap];
          j -= gap;
        }
        a[j] = key;
      }
    }
  }
  return a;
}`;

const python = `def shell_sort(a):
    n = len(a)
    gap = n // 2
    while gap > 0:
        for start in range(gap):
            for i in range(start + gap, n, gap):
                key = a[i]
                j = i
                while j >= gap and a[j - gap] > key:
                    a[j] = a[j - gap]
                    j -= gap
                a[j] = key
        gap //= 2
    return a`;

const go = `func shellSort(a []int) []int {
\tn := len(a)
\tfor gap := n / 2; gap > 0; gap /= 2 {
\t\tfor start := 0; start < gap; start++ {
\t\t\tfor i := start + gap; i < n; i += gap {
\t\t\t\tkey := a[i]
\t\t\t\tj := i
\t\t\t\tfor j >= gap && a[j-gap] > key {
\t\t\t\t\ta[j] = a[j-gap]
\t\t\t\t\tj -= gap
\t\t\t\t}
\t\t\t\ta[j] = key
\t\t\t}
\t\t}
\t}
\treturn a
}`;

const rust = `fn shell_sort(a: &mut Vec<i32>) {
    let n = a.len();
    let mut gap = n / 2;
    while gap > 0 {
        for start in 0..gap {
            let mut i = start + gap;
            while i < n {
                let key = a[i];
                let mut j = i;
                while j >= gap && a[j - gap] > key {
                    a[j] = a[j - gap];
                    j -= gap;
                }
                a[j] = key;
                i += gap;
            }
        }
        gap /= 2;
    }
}`;

export const shellSortSources: LangSource<ShellExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // 3 gap循环 / 4 start循环 / 5 i循环 / 6 key / 7 j / 8 while比较 / 9 右移 / 10 j-=gap / 12 insert / 16 return
    lineMap: {
      gapChange: 3,
      groupStart: 4,
      outerLoop: 5,
      compare: 8,
      shift: 9,
      insert: 12,
      done: 16,
    },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    // 3 gap=n//2 / 4 while gap>0 / 5 start循环 / 6 i循环 / 7 key / 8 j / 9 while比较 / 10 右移 / 11 j-=gap / 12 insert / 13 gap//=2 / 14 return
    lineMap: {
      gapChange: 4,
      groupStart: 5,
      outerLoop: 6,
      compare: 9,
      shift: 10,
      insert: 12,
      done: 14,
    },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    // 3 gap循环 / 4 start循环 / 5 i循环 / 6 key / 7 j / 8 for比较 / 9 右移 / 10 j-=gap / 12 insert / 16 return
    lineMap: {
      gapChange: 3,
      groupStart: 4,
      outerLoop: 5,
      compare: 8,
      shift: 9,
      insert: 12,
      done: 16,
    },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    // 4 while gap>0 / 5 start循环 / 7 while i<n / 8 key / 9 j / 10 while比较 / 11 右移 / 12 j-=gap / 14 insert / 20 末尾}（无 return）
    lineMap: {
      gapChange: 4,
      groupStart: 5,
      outerLoop: 7,
      compare: 10,
      shift: 11,
      insert: 14,
      done: 20,
    },
  },
];
