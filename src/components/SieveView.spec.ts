// src/components/SieveView.spec.ts —— 数字网格轨（C-077，埃氏筛，数学与数论大类首发）
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SieveView from './SieveView.vue';
import type { SieveCellState, SieveTrack } from '@/components/player/types';

// 造 n=30 的 states：1 special，2/3/5 prime，4 composite，其余 unknown
const makeStates = (): SieveCellState[] => {
  const st: SieveCellState[] = new Array<SieveCellState>(31).fill('unknown');
  st[0] = 'unknown';
  st[1] = 'special';
  for (const p of [2, 3, 5]) st[p] = 'prime';
  st[4] = 'composite';
  return st;
};
const base: SieveTrack = { n: 30, cols: 6, states: makeStates() };
const mountIt = (sieve: SieveTrack) => mount(SieveView, { props: { sieve } });

describe('SieveView', () => {
  it('TC-VIZ-SIEVEVIEW-01 网格 30 格 + 素数/合数着色', () => {
    const w = mountIt(base);
    expect(w.findAll('.sieve-cell')).toHaveLength(30);
    expect(w.findAll('.sieve-prime').length).toBe(3); // 2,3,5
    expect(w.findAll('.sieve-composite').length).toBe(1); // 4
  });

  it('TC-VIZ-SIEVEVIEW-02 当前素数环 + 划中倍数红', () => {
    const w = mountIt({ ...base, current: 5, marking: [25] });
    expect(w.findAll('.sieve-current')).toHaveLength(1);
    expect(w.findAll('.sieve-marking')).toHaveLength(1);
    // 25 号格被标 marking
    const c25 = w.findAll('.sieve-cell')[24];
    expect(c25.classes()).toContain('sieve-marking');
    expect(c25.text()).toBe('25');
  });

  it('TC-VIZ-SIEVEVIEW-03 1 号格特殊（非素非合）', () => {
    const w = mountIt(base);
    const c1 = w.findAll('.sieve-cell')[0];
    expect(c1.text()).toBe('1');
    expect(c1.classes()).toContain('sieve-special');
  });
});
