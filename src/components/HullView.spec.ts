// src/components/HullView.spec.ts —— 点平面轨（C-081，凸包，计算几何大类首发）
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HullView from './HullView.vue';
import type { HullTrack, Pt } from '@/components/player/types';

const points: Pt[] = [
  { x: 0, y: 3 },
  { x: 2, y: 0 },
  { x: 2, y: 5 },
  { x: 3, y: 3 },
  { x: 4, y: 0 },
  { x: 4, y: 5 },
  { x: 6, y: 3 },
];
const base: HullTrack = {
  points,
  edges: [
    [0, 1],
    [1, 4],
    [4, 6],
  ],
  stack: [0, 1, 4, 6],
  phase: 'lower',
};
const mountIt = (hull: HullTrack) => mount(HullView, { props: { hull } });

describe('HullView', () => {
  it('TC-VIZ-HULLVIEW-01 散点 7 个 + 折线 3 条', () => {
    const w = mountIt(base);
    expect(w.findAll('.hull-point')).toHaveLength(7);
    expect(w.findAll('.hull-edge')).toHaveLength(3);
  });

  it('TC-VIZ-HULLVIEW-02 当前点琥珀 + 弹出点红', () => {
    const w = mountIt({ ...base, current: 3, popped: [2] });
    expect(w.findAll('.hull-current')).toHaveLength(1);
    expect(w.findAll('.hull-popped')).toHaveLength(1);
  });

  it('TC-VIZ-HULLVIEW-03 完整凸包多边形', () => {
    const w = mountIt({
      ...base,
      phase: 'done',
      finalHull: [0, 1, 4, 6, 5, 2],
    });
    expect(w.find('.hull-polygon').exists()).toBe(true);
  });
});
