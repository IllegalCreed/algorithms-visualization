// src/components/BarsView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BarsView from './BarsView.vue';
import Bar from './Bar.vue';
import ArrowTrack from './ArrowTrack.vue';
import type { Pointer, StepEmphasis } from '@/components/player/types';

type BarsViewProps = {
  array: [string, number][];
  pointers: Pointer[];
  emphasis: StepEmphasis;
  slotWidth?: number;
};
const mountIt = (props: BarsViewProps) =>
  mount(BarsView, { props, global: { plugins: [createPinia()] } });

describe('BarsView', () => {
  const base = {
    array: [
      ['0', 5],
      ['1', 9],
      ['2', 1],
    ] as [string, number][],
    pointers: [{ id: '0', index: 0 }],
    emphasis: {},
  };

  it('渲染与数据等量的 Bar', () => {
    const w = mountIt(base);
    expect(w.findAllComponents(Bar)).toHaveLength(3);
  });

  it('最大值柱最高、最小值柱最低', () => {
    const w = mountIt(base);
    const bars = w.findAllComponents(Bar);
    expect(bars[1].props('percent')).toBeGreaterThan(bars[0].props('percent')); // 9 > 5
    expect(bars[2].props('percent')).toBeLessThan(bars[0].props('percent')); // 1 < 5
  });

  it('comparing 下标的 Bar 进入 comparing 态', () => {
    const w = mountIt({ ...base, emphasis: { comparing: [0, 1] } });
    expect(w.findAllComponents(Bar)[0].props('state')).toBe('comparing');
  });

  it('sortedFrom 之后的 Bar 进入 sorted 态', () => {
    const w = mountIt({ ...base, emphasis: { sortedFrom: 2 } });
    expect(w.findAllComponents(Bar)[2].props('state')).toBe('sorted');
  });

  it('comparing+swapped 时对应 Bar 进入 swapped 态', () => {
    const w = mountIt({ ...base, emphasis: { comparing: [0, 1], swapped: true } });
    expect(w.findAllComponents(Bar)[0].props('state')).toBe('swapped');
  });

  it('把 slotWidth 透传给 ArrowTrack', () => {
    const w = mountIt({ ...base, slotWidth: 50 });
    expect(w.findComponent(ArrowTrack).props('slotWidth')).toBe(50);
  });
});
