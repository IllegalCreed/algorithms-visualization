import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BoardView from './BoardView.vue';
import type { BoardTrack } from '@/components/player/types';

const base: BoardTrack = {
  n: 4,
  queens: [1, 3, 0, 2],
};

const mountIt = (b: Partial<BoardTrack> = {}) =>
  mount(BoardView, { props: { board: { ...base, ...b } } });

describe('BoardView 棋盘轨', () => {
  it('TC-VIZ-BOARDVIEW-01 n=4 → 16 格；queens=[1,3,0,2] → 4 个皇后', () => {
    const w = mountIt();
    expect(w.findAll('.board-cell')).toHaveLength(16);
    expect(w.findAll('.board-queen')).toHaveLength(4);
  });

  it('TC-VIZ-BOARDVIEW-02 交错着色：深格 8 个（4×4 一半）', () => {
    const w = mountIt();
    expect(w.findAll('.board-cell.dark')).toHaveLength(8);
  });

  it('TC-VIZ-BOARDVIEW-03 tryCell=[2,1] → 对应格带 .bc-try', () => {
    const w = mountIt({ tryCell: [2, 1] });
    expect(w.findAll('.board-cell.bc-try')).toHaveLength(1);
  });

  it('TC-VIZ-BOARDVIEW-04 conflictCells=[[0,0]] → 对应格带 .bc-conflict', () => {
    const w = mountIt({ tryCell: [0, 1], conflictCells: [[0, 0]] });
    expect(w.findAll('.board-cell.bc-conflict')).toHaveLength(1);
  });
});
