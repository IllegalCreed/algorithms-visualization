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

  it('指针轨道宽度 = array.length × slotWidth（与柱子行同原点，箭头才对齐）', () => {
    const w = mountIt(base); // 3 元素 × 默认 60 = 180
    expect(w.findComponent(ArrowTrack).attributes('style')).toContain('width: 180px');
    const w2 = mountIt({ ...base, slotWidth: 50 }); // 3 × 50 = 150
    expect(w2.findComponent(ArrowTrack).attributes('style')).toContain('width: 150px');
  });

  it('TC-VIZ-BARSVIEW-06 minIndex 指向的 Bar 进入 min 态', () => {
    const w = mountIt({ ...base, emphasis: { minIndex: 1 } });
    expect(w.findAllComponents(Bar)[1].props('state')).toBe('min');
  });

  it('TC-VIZ-BARSVIEW-07 sortedUpTo 左侧的 Bar 进入 sorted 态', () => {
    const w = mountIt({ ...base, emphasis: { sortedUpTo: 2 } });
    const bars = w.findAllComponents(Bar);
    expect(bars[0].props('state')).toBe('sorted');
    expect(bars[1].props('state')).toBe('sorted');
    expect(bars[2].props('state')).toBe('idle'); // 下标 2 不在 [0,2)
  });

  it('TC-VIZ-BARSVIEW-08 比较帧优先级：minIndex 那根取 min、另一根取 comparing', () => {
    const w = mountIt({ ...base, emphasis: { comparing: [1, 2], minIndex: 2 } });
    const bars = w.findAllComponents(Bar);
    expect(bars[2].props('state')).toBe('min'); // minIndex 压过 comparing
    expect(bars[1].props('state')).toBe('comparing'); // 另一根（j）才是 comparing
  });

  it('TC-VIZ-BARSVIEW-09 keyIndex 指向的 Bar 进入 key 态', () => {
    const w = mountIt({ ...base, emphasis: { keyIndex: 1 } });
    expect(w.findAllComponents(Bar)[1].props('state')).toBe('key');
  });

  it('TC-VIZ-BARSVIEW-10 key 优先级压过 sorted：keyIndex 落在已排序区仍取 key 态', () => {
    const w = mountIt({ ...base, emphasis: { sortedUpTo: 3, keyIndex: 1 } });
    const bars = w.findAllComponents(Bar);
    expect(bars[1].props('state')).toBe('key'); // 下标 1 在 [0,3) 已排序区，但 key 压过 sorted
    expect(bars[0].props('state')).toBe('sorted'); // 其他已排序柱仍绿
    expect(bars[2].props('state')).toBe('sorted');
  });

  it('TC-VIZ-BARSVIEW-11 比较帧：keyIndex 那根取 key、comparing 另一根取 comparing', () => {
    const w = mountIt({ ...base, emphasis: { comparing: [0, 1], keyIndex: 1 } });
    const bars = w.findAllComponents(Bar);
    expect(bars[1].props('state')).toBe('key'); // key 压过 comparing
    expect(bars[0].props('state')).toBe('comparing'); // 另一根（j）才是 comparing
  });
});
