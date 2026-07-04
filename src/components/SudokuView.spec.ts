import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SudokuView from './SudokuView.vue';
import type { SudokuTrack } from '@/components/player/types';

const T = true;
const F = false;
const base: SudokuTrack = {
  n: 4,
  box: 2,
  given: [
    [F, T, T, T],
    [T, T, T, T],
    [T, F, F, F],
    [T, F, T, T],
  ],
  grid: [
    [null, 2, 3, 4],
    [3, 4, 1, 2],
    [2, null, null, null],
    [4, null, 2, 3],
  ],
};

const mountIt = (t: Partial<SudokuTrack> = {}) =>
  mount(SudokuView, { props: { sudoku: { ...base, ...t } } });

describe('SudokuView 数独轨', () => {
  it('TC-VIZ-SUDOKUVIEW-01 4×4 → 16 格；给定格数 = given true 数', () => {
    const w = mountIt();
    expect(w.findAll('.sudoku-cell')).toHaveLength(16);
    const givenCount = base.given.flat().filter(Boolean).length;
    expect(w.findAll('.sk-given')).toHaveLength(givenCount);
  });

  it('TC-VIZ-SUDOKUVIEW-02 current + tryNum → 1 .sk-current 显示试填数', () => {
    const w = mountIt({ current: [2, 1], tryNum: 3 });
    const cur = w.findAll('.sk-current');
    expect(cur).toHaveLength(1);
    expect(cur[0].text()).toContain('3'); // 当前空格显示试填数字
  });

  it('TC-VIZ-SUDOKUVIEW-03 reject → .sk-reject；place → .sk-place', () => {
    const wR = mountIt({ current: [2, 1], tryNum: 1, status: 'reject' });
    expect(wR.findAll('.sk-reject')).toHaveLength(1);
    const wP = mountIt({ current: [2, 1], tryNum: 3, status: 'place' });
    expect(wP.findAll('.sk-place')).toHaveLength(1);
  });
});
