import type { LangSource, SegIntExecPoint } from '@/components/player/types';

// 跨立试验：AB 与 CD 相交 ⟺ A、B 分居直线 CD 两侧 且 C、D 分居直线 AB 两侧。
// 四叉积 d1..d4 两两异号 → 规范相交；某 d=0（共线）补包围框检查 → 端点相触。全程无除法。
const ts = `function segIntersect(a: Pt, b: Pt, c: Pt, d: Pt): boolean {
  const d1 = cross(c, d, a);       // A 在直线 CD 的哪一侧
  const d2 = cross(c, d, b);       // B 在直线 CD 的哪一侧
  const d3 = cross(a, b, c);       // C 在直线 AB 的哪一侧
  const d4 = cross(a, b, d);       // D 在直线 AB 的哪一侧
  if (d1 * d2 < 0 && d3 * d4 < 0)  // 两两异号：互相跨立
    return true;                   // 规范相交
  if (d1 === 0 && onSeg(c, d, a)) return true; // 共线端点相触
  if (d2 === 0 && onSeg(c, d, b)) return true;
  if (d3 === 0 && onSeg(a, b, c)) return true;
  if (d4 === 0 && onSeg(a, b, d)) return true;
  return false;                    // 同侧/共线不搭 → 不相交
}`;

const python = `def seg_intersect(a, b, c, d):
    d1 = cross(c, d, a)          # A 在直线 CD 的哪一侧
    d2 = cross(c, d, b)          # B 在直线 CD 的哪一侧
    d3 = cross(a, b, c)          # C 在直线 AB 的哪一侧
    d4 = cross(a, b, d)          # D 在直线 AB 的哪一侧
    if d1 * d2 < 0 and d3 * d4 < 0:   # 两两异号：互相跨立
        return True                    # 规范相交
    if d1 == 0 and on_seg(c, d, a): return True  # 共线端点相触
    if d2 == 0 and on_seg(c, d, b): return True
    if d3 == 0 and on_seg(a, b, c): return True
    if d4 == 0 and on_seg(a, b, d): return True
    return False                  # 同侧 → 不相交`;

const go = `func segIntersect(a, b, c, d Pt) bool {
\td1 := cross(c, d, a)          // A 在直线 CD 的哪一侧
\td2 := cross(c, d, b)          // B 在直线 CD 的哪一侧
\td3 := cross(a, b, c)          // C 在直线 AB 的哪一侧
\td4 := cross(a, b, d)          // D 在直线 AB 的哪一侧
\tif d1*d2 < 0 && d3*d4 < 0 {   // 两两异号：互相跨立
\t\treturn true                 // 规范相交
\t}
\tif d1 == 0 && onSeg(c, d, a) { return true } // 共线端点相触
\tif d2 == 0 && onSeg(c, d, b) { return true }
\tif d3 == 0 && onSeg(a, b, c) { return true }
\tif d4 == 0 && onSeg(a, b, d) { return true }
\treturn false                  // 同侧 → 不相交
}`;

const rust = `fn seg_intersect(a: Pt, b: Pt, c: Pt, d: Pt) -> bool {
    let d1 = cross(c, d, a);      // A 在直线 CD 的哪一侧
    let d2 = cross(c, d, b);      // B 在直线 CD 的哪一侧
    let d3 = cross(a, b, c);      // C 在直线 AB 的哪一侧
    let d4 = cross(a, b, d);      // D 在直线 AB 的哪一侧
    if d1 * d2 < 0.0 && d3 * d4 < 0.0 {  // 两两异号：互相跨立
        return true;              // 规范相交
    }
    if d1 == 0.0 && on_seg(c, d, a) { return true; } // 共线端点相触
    if d2 == 0.0 && on_seg(c, d, b) { return true; }
    if d3 == 0.0 && on_seg(a, b, c) { return true; }
    if d4 == 0.0 && on_seg(a, b, d) { return true; }
    false                         // 同侧 → 不相交
}`;

export const segIntSources: LangSource<SegIntExecPoint>[] = [
  {
    lang: 'ts',
    label: 'TypeScript',
    code: ts,
    // init=入口 / test=算四叉积 / verdict=跨立判定 / done=返回
    lineMap: { init: 1, test: 2, verdict: 6, done: 12 },
  },
  {
    lang: 'python',
    label: 'Python',
    code: python,
    lineMap: { init: 1, test: 2, verdict: 6, done: 12 },
  },
  {
    lang: 'go',
    label: 'Go',
    code: go,
    lineMap: { init: 1, test: 2, verdict: 6, done: 13 },
  },
  {
    lang: 'rust',
    label: 'Rust',
    code: rust,
    lineMap: { init: 1, test: 2, verdict: 6, done: 14 },
  },
];
