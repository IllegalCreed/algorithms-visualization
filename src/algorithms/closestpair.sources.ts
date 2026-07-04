import type { ClosestPairExecPoint, LangSource } from '@/components/player/types';

// 分治最近点对：按 x 排序 → 中线分半各自递归得 δ=min(左,右) → 合并只看中线两侧 δ 带，
// 带内按 y 排序、每点只与 y 差 < δ 的近邻比较（δ×2δ 矩形内至多 8 点 → 常数次）。O(n log n)。
const ts = `function closest(pts: Pt[]): number {          // pts 已按 x 排序
  if (pts.length <= 3) return brute(pts);
  const mid = pts.length >> 1;
  const midX = (pts[mid - 1].x + pts[mid].x) / 2;  // 中线
  const dl = closest(pts.slice(0, mid));           // 左半递归
  const dr = closest(pts.slice(mid));              // 右半递归
  let d = Math.min(dl, dr);                        // δ
  const strip = pts.filter(p => Math.abs(p.x - midX) < d)
                   .sort((a, b) => a.y - b.y);     // δ 带内按 y 排序
  for (let i = 0; i < strip.length; i++)
    for (let j = i + 1; j < strip.length &&
         strip[j].y - strip[i].y < d; j++)         // 只比 y 差 < δ 的近邻
      d = Math.min(d, dist(strip[i], strip[j]));   // 跨带可能刷新
  return d;
}`;

const python = `def closest(pts):                 # pts 已按 x 排序
    if len(pts) <= 3: return brute(pts)
    mid = len(pts) // 2
    mid_x = (pts[mid-1][0] + pts[mid][0]) / 2   # 中线
    dl = closest(pts[:mid])                     # 左半递归
    dr = closest(pts[mid:])                     # 右半递归
    d = min(dl, dr)                             # δ
    strip = sorted([p for p in pts if abs(p[0]-mid_x) < d],
                   key=lambda p: p[1])          # δ 带内按 y 排序
    for i in range(len(strip)):
        j = i + 1
        while j < len(strip) and strip[j][1]-strip[i][1] < d:  # 近邻
            d = min(d, dist(strip[i], strip[j]))               # 跨带刷新
            j += 1
    return d`;

const go = `func closest(pts []Pt) float64 {      // pts 已按 x 排序
\tif len(pts) <= 3 { return brute(pts) }
\tmid := len(pts) / 2
\tmidX := (pts[mid-1].x + pts[mid].x) / 2  // 中线
\tdl := closest(pts[:mid])                 // 左半递归
\tdr := closest(pts[mid:])                 // 右半递归
\td := math.Min(dl, dr)                    // δ
\tstrip := stripSortByY(pts, midX, d)      // δ 带内按 y 排序
\tfor i := range strip {
\t\tfor j := i + 1; j < len(strip) &&
\t\t\tstrip[j].y-strip[i].y < d; j++ {     // 只比 y 差 < δ 的近邻
\t\t\td = math.Min(d, dist(strip[i], strip[j])) // 跨带可能刷新
\t\t}
\t}
\treturn d
}`;

const rust = `fn closest(pts: &[Pt]) -> f64 {       // pts 已按 x 排序
    if pts.len() <= 3 { return brute(pts); }
    let mid = pts.len() / 2;
    let mid_x = (pts[mid - 1].x + pts[mid].x) / 2.0; // 中线
    let dl = closest(&pts[..mid]);               // 左半递归
    let dr = closest(&pts[mid..]);               // 右半递归
    let mut d = dl.min(dr);                      // δ
    let strip = strip_sort_by_y(pts, mid_x, d);  // δ 带内按 y 排序
    for i in 0..strip.len() {
        for j in i + 1..strip.len() {
            if strip[j].y - strip[i].y >= d { break; } // 只比近邻
            d = d.min(dist(strip[i], strip[j]));       // 跨带可能刷新
        }
    }
    d
}`;

export const closestPairSources: LangSource<ClosestPairExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=入口 / divide=中线 / half=左右递归 / strip=带收集 / merge=近邻比较 / done=返回
    lineMap: { init: 2, divide: 4, half: 5, strip: 8, merge: 12, done: 15 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 2, divide: 4, half: 5, strip: 8, merge: 12, done: 15 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 2, divide: 4, half: 5, strip: 8, merge: 12, done: 16 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 2, divide: 4, half: 5, strip: 8, merge: 12, done: 16 },
  },
];
