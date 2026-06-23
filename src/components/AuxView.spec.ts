// src/components/AuxView.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AuxView from './AuxView.vue';
import type { AuxTrack } from '@/components/player/types';

const main: [string, number][] = [
  ['0', 7],
  ['1', 6],
  ['2', 5],
  ['3', 10],
];
const mountIt = (aux: AuxTrack, mainArray = main) =>
  mount(AuxView, { props: { aux, mainArray }, global: { plugins: [createPinia()] } });

describe('AuxView', () => {
  it('TC-VIZ-AUXVIEW-01 渲染与 aux.array 等长的槽', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 0],
        ['t1', 0],
        ['t2', 0],
        ['t3', 0],
      ],
      filled: [],
    };
    expect(mountIt(aux).findAll('.bar-cell')).toHaveLength(4);
  });

  it('TC-VIZ-AUXVIEW-02 filled 的槽为 sorted、其余为 empty', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 5],
        ['t1', 6],
        ['t2', 0],
        ['t3', 0],
      ],
      filled: [0, 1],
    };
    const bars = mountIt(aux).findAll('.bar');
    expect(bars[0].classes()).toContain('sorted');
    expect(bars[1].classes()).toContain('sorted');
    expect(bars[2].classes()).toContain('empty');
    expect(bars[3].classes()).toContain('empty');
  });

  it('TC-VIZ-AUXVIEW-03 pointer 定位 k 箭头到对应槽', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 5],
        ['t1', 0],
      ],
      filled: [0],
      pointer: 1,
    };
    const arrow = mountIt(aux).find('.arrow');
    expect(arrow.exists()).toBe(true);
    expect(arrow.attributes('style')).toContain('translateX(60px)'); // index 1 * slotWidth 60
  });

  it('TC-VIZ-AUXVIEW-04 无 pointer 时不渲染箭头', () => {
    const aux: AuxTrack = {
      array: [
        ['t0', 0],
        ['t1', 0],
      ],
      filled: [],
    };
    expect(mountIt(aux).find('.arrow').exists()).toBe(false);
  });

  it('TC-VIZ-AUXVIEW-05 filled 槽高度用主轨 min/max 同尺度', () => {
    // 主轨值域 5..10；temp 槽值 10（最大）→ percent=1 → height=30+1*130=160px
    const aux: AuxTrack = {
      array: [
        ['t0', 10],
        ['t1', 0],
      ],
      filled: [0],
    };
    const bar0 = mountIt(aux, [
      ['0', 5],
      ['1', 10],
    ]).findAll('.bar')[0];
    expect(bar0.attributes('style')).toContain('height: 160px');
  });
});
