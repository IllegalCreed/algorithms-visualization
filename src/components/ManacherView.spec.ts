import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ManacherView from './ManacherView.vue';
import type { ManacherTrack } from '@/components/player/types';

const base: ManacherTrack = {
  s: '#b#a#b#a#d#', // 11
  p: [0, 1, 0, 3, null, null, null, null, null, null, null],
};

const mountIt = (t: Partial<ManacherTrack> = {}) =>
  mount(ManacherView, { props: { manacher: { ...base, ...t } } });

describe('ManacherView 回文轨', () => {
  it('TC-VIZ-MANACHERVIEW-01 两行：11 s 格 + 11 p 格；null 显示空', () => {
    const w = mountIt();
    expect(w.findAll('.mn-s-cell')).toHaveLength(11);
    expect(w.findAll('.mn-p-cell')).toHaveLength(11);
    // 第 5 个 p（index 4）为 null → 文本为空
    expect(w.findAll('.mn-p-cell')[4].text()).toBe('');
    expect(w.findAll('.mn-p-cell')[3].text()).toBe('3');
  });

  it('TC-VIZ-MANACHERVIEW-02 center → 1 .mn-center；mirror → 1 .mn-mirror', () => {
    const w = mountIt({ center: 3, mirror: 1 });
    expect(w.findAll('.mn-center')).toHaveLength(1);
    expect(w.findAll('.mn-mirror')).toHaveLength(1);
  });

  it('TC-VIZ-MANACHERVIEW-03 boxL=0,boxR=6 → 7 格 .mn-box', () => {
    const w = mountIt({ boxL: 0, boxR: 6 });
    expect(w.findAll('.mn-box')).toHaveLength(7);
  });

  it('TC-VIZ-MANACHERVIEW-04 best=[0,6] → 7 格 .mn-best', () => {
    const w = mountIt({ best: [0, 6] });
    expect(w.findAll('.mn-best')).toHaveLength(7);
  });
});
