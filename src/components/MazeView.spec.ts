import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MazeView from './MazeView.vue';
import type { MazeTrack } from '@/components/player/types';

const mkWalls = (cells: [number, number][]) => {
  const w = Array.from({ length: 5 }, () => Array<boolean>(5).fill(false));
  for (const [r, c] of cells) w[r][c] = true;
  return w;
};

const base: MazeTrack = {
  rows: 5,
  cols: 5,
  walls: mkWalls([
    [1, 1],
    [2, 0],
  ]),
  start: [0, 0],
  goal: [4, 4],
};

const mountIt = (t: Partial<MazeTrack> = {}) =>
  mount(MazeView, { props: { maze: { ...base, ...t } } });

describe('MazeView 迷宫轨', () => {
  it('TC-VIZ-MAZEVIEW-01 5×5 → 25 格；2 墙 → 2 .mz-wall', () => {
    const w = mountIt();
    expect(w.findAll('.maze-cell')).toHaveLength(25);
    expect(w.findAll('.mz-wall')).toHaveLength(2);
  });

  it('TC-VIZ-MAZEVIEW-02 起点/终点各 1', () => {
    const w = mountIt();
    expect(w.findAll('.mz-start')).toHaveLength(1);
    expect(w.findAll('.mz-goal')).toHaveLength(1);
  });

  it('TC-VIZ-MAZEVIEW-03 current → 1 .mz-current；path=3 → 3 .mz-path', () => {
    const w = mountIt({
      current: [0, 2],
      path: [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    });
    expect(w.findAll('.mz-current')).toHaveLength(1);
    expect(w.findAll('.mz-path')).toHaveLength(3);
  });

  it('TC-VIZ-MAZEVIEW-04 visited → .mz-visited；solved → path 带 .mz-solution', () => {
    const wV = mountIt({ visited: [[3, 0]] });
    expect(wV.findAll('.mz-visited')).toHaveLength(1);
    const wS = mountIt({
      solved: true,
      path: [
        [0, 0],
        [0, 1],
      ],
    });
    expect(wS.findAll('.mz-solution')).toHaveLength(2);
    expect(wS.findAll('.mz-path')).toHaveLength(0); // solved 时路径转绿，非琥珀
  });
});
