import type { CalipersExecPoint, LangSource } from '@/components/player/types';

// 旋转卡壳：hull 为逆时针凸包。对每条边 (i,i+1)，对踵点 j 用三角形面积单调前移
// （下一顶点离边更远就转），每条边只检查「边两端 ↔ 对踵点」两个候选距离。O(n)。
const ts = `function diameter(hull: Pt[]): number {
  const m = hull.length;
  const area2 = (a: Pt, b: Pt, c: Pt) => Math.abs(cross(a, b, c));
  let j = 1, best = 0;
  for (let i = 0; i < m; i++) {              // 逐条凸包边推进
    const ni = (i + 1) % m;
    while (area2(hull[i], hull[ni], hull[(j + 1) % m]) >
           area2(hull[i], hull[ni], hull[j])) {
      j = (j + 1) % m;                       // 对踵点单调前移（面积更大 → 更远）
    }
    best = Math.max(best, d2(hull[i], hull[j]), d2(hull[ni], hull[j])); // 两候选
  }
  return best;                               // 直径²（一圈转完）
}`;

const python = `def diameter(hull):
    m = len(hull)
    def area2(a, b, c): return abs(cross(a, b, c))
    j, best = 1, 0
    for i in range(m):                    # 逐条凸包边推进
        ni = (i + 1) % m
        while area2(hull[i], hull[ni], hull[(j + 1) % m]) > \\
              area2(hull[i], hull[ni], hull[j]):
            j = (j + 1) % m               # 对踵点单调前移（面积更大 → 更远）
        best = max(best, d2(hull[i], hull[j]), d2(hull[ni], hull[j]))  # 两候选
    return best                           # 直径²（一圈转完）`;

const go = `func diameter(hull []Pt) int {
\tm := len(hull)
\tarea2 := func(a, b, c Pt) int { return abs(cross(a, b, c)) }
\tj, best := 1, 0
\tfor i := 0; i < m; i++ {               // 逐条凸包边推进
\t\tni := (i + 1) % m
\t\tfor area2(hull[i], hull[ni], hull[(j+1)%m]) >
\t\t\tarea2(hull[i], hull[ni], hull[j]) {
\t\t\tj = (j + 1) % m                    // 对踵点单调前移（面积更大 → 更远）
\t\t}
\t\tbest = max(best, d2(hull[i], hull[j]), d2(hull[ni], hull[j])) // 两候选
\t}
\treturn best                            // 直径²（一圈转完）
}`;

const rust = `fn diameter(hull: &[Pt]) -> i64 {
    let m = hull.len();
    let area2 = |a: Pt, b: Pt, c: Pt| cross(a, b, c).abs();
    let (mut j, mut best) = (1usize, 0i64);
    for i in 0..m {                        // 逐条凸包边推进
        let ni = (i + 1) % m;
        while area2(hull[i], hull[ni], hull[(j + 1) % m])
            > area2(hull[i], hull[ni], hull[j]) {
            j = (j + 1) % m;               // 对踵点单调前移（面积更大 → 更远）
        }
        best = best.max(d2(hull[i], hull[j])).max(d2(hull[ni], hull[j])); // 两候选
    }
    best                                   // 直径²（一圈转完）
}`;

export const calipersSources: LangSource<CalipersExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=准备 / spin=对踵前移+候选 / done=返回直径
    lineMap: { init: 4, spin: 9, done: 13 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 4, spin: 9, done: 11 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 4, spin: 9, done: 13 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 4, spin: 9, done: 13 },
  },
];
