import type { LangSource, ZExecPoint } from '@/components/player/types';

// Z 函数：Z-box [l,r) 内抄镜像 z[i-l]（截断 r−i），达界才右扩；r 只增不减 → O(n)。
const ts = `function zFunction(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);
  z[0] = n;                                    // 整串比自己
  let l = 0, r = 0;                            // Z-box [l, r)
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);   // box 内：抄镜像（截断到余量）
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
      z[i]++;                                  // 右扩：box 外或达界才会走到
    }
    if (i + z[i] > r) { l = i; r = i + z[i]; } // 推进最右 box
  }
  return z;                                    // O(n)：r 只增不减
}`;

const python = `def z_function(s):
    n = len(s)
    z = [0] * n
    z[0] = n                       # 整串比自己
    l = r = 0                      # Z-box [l, r)
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])   # box 内：抄镜像（截断到余量）
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1              # 右扩：box 外或达界才会走到
        if i + z[i] > r:
            l, r = i, i + z[i]     # 推进最右 box
    return z                       # O(n)：r 只增不减`;

const go = `func zFunction(s string) []int {
	n := len(s)
	z := make([]int, n)
	z[0] = n                        // 整串比自己
	l, r := 0, 0                    // Z-box [l, r)
	for i := 1; i < n; i++ {
		if i < r {
			z[i] = min(r-i, z[i-l]) // box 内：抄镜像（截断到余量）
		}
		for i+z[i] < n && s[z[i]] == s[i+z[i]] {
			z[i]++                  // 右扩：box 外或达界才会走到
		}
		if i+z[i] > r {
			l, r = i, i+z[i]        // 推进最右 box
		}
	}
	return z                        // O(n)：r 只增不减
}`;

const rust = `fn z_function(s: &str) -> Vec<usize> {
    let b = s.as_bytes();
    let n = b.len();
    let mut z = vec![0usize; n];
    z[0] = n;                       // 整串比自己
    let (mut l, mut r) = (0usize, 0usize);  // Z-box [l, r)
    for i in 1..n {
        if i < r {
            z[i] = (r - i).min(z[i - l]);   // box 内：抄镜像（截断到余量）
        }
        while i + z[i] < n && b[z[i]] == b[i + z[i]] {
            z[i] += 1;              // 右扩：box 外或达界才会走到
        }
        if i + z[i] > r {
            l = i;                  // 推进最右 box
            r = i + z[i];
        }
    }
    z                               // O(n)：r 只增不减
}`;

export const zSources: LangSource<ZExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    lineMap: { init: 4, mirror: 7, brute: 9, extend: 9, done: 13 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 4, mirror: 8, brute: 10, extend: 10, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 4, mirror: 8, brute: 11, extend: 11, done: 17 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 5, mirror: 9, brute: 12, extend: 12, done: 19 },
  },
];
