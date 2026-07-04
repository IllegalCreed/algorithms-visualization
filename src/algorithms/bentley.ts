// src/algorithms/bentley.ts
// 扫描线求交 Bentley-Ottmann oracle。计算几何第 5 页（C-088，复用 HullView additive）。
// A(1,1)-(9,9)、B(2,8)-(8,2)、C(2.5,6)-(8.5,6) → 交点 (4,6) B×C、(5,5) A×B、(6,6) A×C。

import type { Pt } from '@/components/player/types';

export const BO_POINTS: Pt[] = [
  { x: 1, y: 1 },
  { x: 9, y: 9 }, // A: 0-1
  { x: 2, y: 8 },
  { x: 8, y: 2 }, // B: 2-3
  { x: 2.5, y: 6 },
  { x: 8.5, y: 6 }, // C: 4-5
];

export interface BoSeg {
  name: string;
  a: number; // 左端点下标
  b: number; // 右端点下标
}

export const BO_SEGS: BoSeg[] = [
  { name: 'A', a: 0, b: 1 },
  { name: 'B', a: 2, b: 3 },
  { name: 'C', a: 4, b: 5 },
];

/** 线段 s 在横坐标 x 处的 y（参数插值；固定实例无竖直线段）。 */
export function yAt(s: number, x: number): number {
  const p = BO_POINTS[BO_SEGS[s].a];
  const q = BO_POINTS[BO_SEGS[s].b];
  return p.y + ((x - p.x) * (q.y - p.y)) / (q.x - p.x);
}

/** 两线段的真相交点（严格内部相交才返回；参数式求解）。 */
export function segCrossAt(i: number, j: number): Pt | null {
  const p1 = BO_POINTS[BO_SEGS[i].a];
  const p2 = BO_POINTS[BO_SEGS[i].b];
  const p3 = BO_POINTS[BO_SEGS[j].a];
  const p4 = BO_POINTS[BO_SEGS[j].b];
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (d === 0) return null;
  const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
  if (t <= 0 || t >= 1 || u <= 0 || u >= 1) return null;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
}

/** 暴力全对求交（独立真值），按交点 x 升序。 */
export function bruteCrosses(): { pair: [number, number]; pt: Pt }[] {
  const out: { pair: [number, number]; pt: Pt }[] = [];
  for (let i = 0; i < BO_SEGS.length; i++) {
    for (let j = i + 1; j < BO_SEGS.length; j++) {
      const pt = segCrossAt(i, j);
      if (pt) out.push({ pair: [i, j], pt });
    }
  }
  return out.sort((a, b) => a.pt.x - b.pt.x);
}

export interface BoEvent {
  x: number;
  type: 'start' | 'end' | 'cross';
  seg?: number; // start/end 的主角
  pair?: [number, number]; // cross 的两线段
  pt?: Pt; // cross 的交点
  statusAfter: number[]; // 事件处理后的状态结构（下→上 y 序）
  enqueued: Pt[]; // 本事件新入队的交点事件
}

/** 模拟事件流：端点事件先入队，处理中动态加入交点事件；只在新相邻对上查交。 */
export function boEvents(): BoEvent[] {
  type QE = {
    x: number;
    type: 'start' | 'end' | 'cross';
    seg?: number;
    pair?: [number, number];
    pt?: Pt;
  };
  const queue: QE[] = [];
  BO_SEGS.forEach((s, i) => {
    queue.push({ x: BO_POINTS[s.a].x, type: 'start', seg: i });
    queue.push({ x: BO_POINTS[s.b].x, type: 'end', seg: i });
  });
  const seen = new Set<string>(); // 交点事件去重
  const key = (p: Pt) => `${p.x},${p.y}`;
  const status: number[] = []; // 下→上
  const events: BoEvent[] = [];

  const tryEnqueue = (i: number, j: number, curX: number, out: Pt[]): void => {
    const pt = segCrossAt(i, j);
    if (!pt || pt.x <= curX || seen.has(key(pt))) return;
    seen.add(key(pt));
    const lo = Math.min(i, j);
    const hi = Math.max(i, j);
    queue.push({ x: pt.x, type: 'cross', pair: [lo, hi], pt });
    out.push(pt);
  };

  while (queue.length) {
    queue.sort((a, b) => a.x - b.x);
    const e = queue.shift()!;
    const enq: Pt[] = [];
    if (e.type === 'start') {
      const yv = yAt(e.seg!, e.x + 1e-6);
      let at = status.findIndex((s) => yAt(s, e.x + 1e-6) > yv);
      if (at < 0) at = status.length;
      status.splice(at, 0, e.seg!);
      if (at > 0) tryEnqueue(status[at - 1], e.seg!, e.x, enq);
      if (at < status.length - 1) tryEnqueue(e.seg!, status[at + 1], e.x, enq);
    } else if (e.type === 'end') {
      const at = status.indexOf(e.seg!);
      status.splice(at, 1);
      if (at > 0 && at < status.length) tryEnqueue(status[at - 1], status[at], e.x, enq);
    } else {
      const [i, j] = e.pair!;
      const ai = status.indexOf(i);
      const aj = status.indexOf(j);
      const lo = Math.min(ai, aj);
      const hi = Math.max(ai, aj);
      [status[lo], status[hi]] = [status[hi], status[lo]];
      if (lo > 0) tryEnqueue(status[lo - 1], status[lo], e.x, enq);
      if (hi < status.length - 1) tryEnqueue(status[hi], status[hi + 1], e.x, enq);
    }
    events.push({ ...e, statusAfter: [...status], enqueued: enq });
  }
  return events;
}
