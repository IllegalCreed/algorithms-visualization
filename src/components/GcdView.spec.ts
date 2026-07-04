// src/components/GcdView.spec.ts —— 矩形铺砖轨（C-079，欧几里得 GCD，数学与数论第 3 页）
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GcdView from './GcdView.vue';
import type { GcdTrack } from '@/components/player/types';

// gcd(30,18) 铺砖：18,12,6,6 四方块
const squares = [
  { x: 0, y: 0, size: 18, step: 0 },
  { x: 18, y: 0, size: 12, step: 1 },
  { x: 18, y: 12, size: 6, step: 2 },
  { x: 24, y: 12, size: 6, step: 2 },
];
const base: GcdTrack = { a: 30, b: 18, squares, remaining: null };
const mountIt = (gcd: GcdTrack) => mount(GcdView, { props: { gcd } });

describe('GcdView', () => {
  it('TC-VIZ-GCDVIEW-01 矩形 + 4 方块 + 标注边长', () => {
    const w = mountIt(base);
    expect(w.findAll('.gcd-square')).toHaveLength(4);
    const txt = w.text();
    expect(txt).toContain('18');
    expect(txt).toContain('12');
    expect(txt).toContain('6');
  });

  it('TC-VIZ-GCDVIEW-02 当前方块琥珀 + 剩余虚线框', () => {
    const w = mountIt({
      ...base,
      squares: [squares[0]],
      current: [0],
      remaining: { x: 18, y: 0, w: 12, h: 18 },
    });
    expect(w.findAll('.gcd-current')).toHaveLength(1);
    expect(w.find('.gcd-remaining').exists()).toBe(true);
  });

  it('TC-VIZ-GCDVIEW-03 remaining=null 时无剩余框（铺满）', () => {
    const w = mountIt(base);
    expect(w.find('.gcd-remaining').exists()).toBe(false);
  });
});
