import type { HullExecPoint, LangSource } from '@/components/player/types';

// Andrew 单调链：按 (x,y) 排序，从左到右构下凸壳、从右到左构上凸壳。
// 叉积 cr(o,a,b) = (a-o)×(b-o)：>0 左转（逆时针），≤0 非左转 → 弹栈。下+上凸壳拼成完整凸包。
const ts = `function convexHull(pts: Pt[]): Pt[] {
  pts.sort((a, b) => a.x - b.x || a.y - b.y);          // 按 (x,y) 排序
  const cr = (o: Pt, a: Pt, b: Pt) =>                  // 叉积 (A-O)×(B-O)
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Pt[] = [];
  for (const p of pts) {                               // 下凸壳：左 → 右
    while (lower.length >= 2 && cr(lower.at(-2)!, lower.at(-1)!, p) <= 0) lower.pop(); // 非左转弹栈
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (const p of [...pts].reverse()) {                // 上凸壳：右 → 左
    while (upper.length >= 2 && cr(upper.at(-2)!, upper.at(-1)!, p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]; // 下 + 上凸壳拼接
}`;

const python = `def convex_hull(pts):
    pts.sort()                                    # 按 (x,y) 排序
    def cr(o, a, b):                              # 叉积 (A-O)×(B-O)
        return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    lower = []
    for p in pts:                                 # 下凸壳：左 → 右
        while len(lower) >= 2 and cr(lower[-2], lower[-1], p) <= 0: lower.pop()  # 非左转弹栈
        lower.append(p)
    upper = []
    for p in reversed(pts):                       # 上凸壳：右 → 左
        while len(upper) >= 2 and cr(upper[-2], upper[-1], p) <= 0: upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]                # 下 + 上凸壳拼接`;

const go = `func convexHull(pts []Pt) []Pt {
\tsort.Slice(pts, func(i, j int) bool {           // 按 (x,y) 排序
\t\treturn pts[i].x < pts[j].x || (pts[i].x == pts[j].x && pts[i].y < pts[j].y)
\t})
\tcr := func(o, a, b Pt) int {                    // 叉积 (A-O)×(B-O)
\t\treturn (a.x-o.x)*(b.y-o.y) - (a.y-o.y)*(b.x-o.x)
\t}
\tvar lower []Pt
\tfor _, p := range pts {                         // 下凸壳：左 → 右
\t\tfor len(lower) >= 2 && cr(lower[len(lower)-2], lower[len(lower)-1], p) <= 0 {
\t\t\tlower = lower[:len(lower)-1]                // 非左转弹栈
\t\t}
\t\tlower = append(lower, p)
\t}
\tvar upper []Pt
\tfor i := len(pts) - 1; i >= 0; i-- {            // 上凸壳：右 → 左
\t\tp := pts[i]
\t\tfor len(upper) >= 2 && cr(upper[len(upper)-2], upper[len(upper)-1], p) <= 0 {
\t\t\tupper = upper[:len(upper)-1]
\t\t}
\t\tupper = append(upper, p)
\t}
\treturn append(lower[:len(lower)-1], upper[:len(upper)-1]...) // 拼接
}`;

const rust = `fn convex_hull(mut pts: Vec<Pt>) -> Vec<Pt> {
    pts.sort_by(|a, b| (a.x, a.y).cmp(&(b.x, b.y)));    // 按 (x,y) 排序
    let cr = |o: Pt, a: Pt, b: Pt|                      // 叉积 (A-O)×(B-O)
        (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    let mut lower: Vec<Pt> = Vec::new();
    for &p in &pts {                                    // 下凸壳：左 → 右
        while lower.len() >= 2 && cr(lower[lower.len()-2], lower[lower.len()-1], p) <= 0 {
            lower.pop();                                // 非左转弹栈
        }
        lower.push(p);
    }
    let mut upper: Vec<Pt> = Vec::new();
    for &p in pts.iter().rev() {                        // 上凸壳：右 → 左
        while upper.len() >= 2 && cr(upper[upper.len()-2], upper[upper.len()-1], p) <= 0 {
            upper.pop();
        }
        upper.push(p);
    }
    lower.pop(); upper.pop();
    lower.extend(upper); lower                          // 下 + 上凸壳拼接
}`;

export const convexHullSources: LangSource<HullExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=排序 / lower=下凸壳弹栈 / upper=上凸壳弹栈 / done=拼接返回
    lineMap: { init: 2, lower: 7, upper: 12, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, lower: 7, upper: 11, done: 13 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, lower: 11, upper: 19, done: 23 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, lower: 8, upper: 15, done: 20 },
  },
];
