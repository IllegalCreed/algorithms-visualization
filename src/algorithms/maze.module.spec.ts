// src/algorithms/maze.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildMazeSteps, mazeModule } from './maze.module';
import { mazeSolve, MAZE_GRID, MAZE_START, MAZE_GOAL } from './maze';
import type { MazeExecPoint, Step } from '@/components/player/types';

const steps = () => buildMazeSteps();
const cnt = (ss: Step<MazeExecPoint>[], p: MazeExecPoint) => ss.filter((s) => s.point === p).length;
const last = (ss: Step<MazeExecPoint>[]) => ss[ss.length - 1];
const adjacent = (a: [number, number], b: [number, number]) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
const isWall = (r: number, c: number) => MAZE_GRID[r][c] === 1;
const inB = (r: number, c: number) =>
  r >= 0 && r < MAZE_GRID.length && c >= 0 && c < MAZE_GRID[0].length;

describe('maze.module', () => {
  it('TC-MAZE-MOD-01 末步 done、solved，path = mazeSolve()', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.maze!.solved).toBe(true);
    expect(l.maze!.path).toEqual(mazeSolve());
  });

  it('TC-MAZE-MOD-02 每步执行点合法且携带迷宫轨（array 空）', () => {
    const ok = new Set<MazeExecPoint>(['start', 'move', 'deadend', 'backtrack', 'goal', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.maze).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-MAZE-MOD-03 解路径有效：首=起点、尾=终点、四连通、不穿墙', () => {
    const path = mazeSolve();
    expect(path[0]).toEqual(MAZE_START);
    expect(path[path.length - 1]).toEqual(MAZE_GOAL);
    for (const [r, c] of path) expect(isWall(r, c)).toBe(false);
    for (let i = 0; i + 1 < path.length; i++) expect(adjacent(path[i], path[i + 1])).toBe(true);
  });

  it('TC-MAZE-MOD-04 首步 start：current=起点、path=[起点]', () => {
    const first = steps()[0];
    expect(first.point).toBe('start');
    expect(first.maze!.current).toEqual(MAZE_START);
    expect(first.maze!.path).toEqual([MAZE_START]);
  });

  it('TC-MAZE-MOD-05 恰一 goal 步，current=终点', () => {
    const ss = steps();
    expect(cnt(ss, 'goal')).toBe(1);
    const g = ss.find((s) => s.point === 'goal')!;
    expect(g.maze!.current).toEqual(MAZE_GOAL);
  });

  it('TC-MAZE-MOD-06 存在死路 + 回溯', () => {
    const ss = steps();
    expect(cnt(ss, 'deadend')).toBeGreaterThanOrEqual(1);
    expect(cnt(ss, 'backtrack')).toBeGreaterThanOrEqual(1);
  });

  it('TC-MAZE-MOD-07 deadend 步 current 四邻皆墙/越界/已访问', () => {
    for (const s of steps().filter((x) => x.point === 'deadend')) {
      const [r, c] = s.maze!.current!;
      const vis = new Set((s.maze!.visited ?? []).map(([a, b]) => a + ',' + b));
      for (const [dr, dc] of [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ]) {
        const nr = r + dr;
        const nc = c + dc;
        const blocked = !inB(nr, nc) || isWall(nr, nc) || vis.has(nr + ',' + nc);
        expect(blocked).toBe(true);
      }
    }
  });

  it('TC-MAZE-MOD-08 每步 path 相邻格四连通', () => {
    for (const s of steps()) {
      const p = s.maze!.path ?? [];
      for (let i = 0; i + 1 < p.length; i++) expect(adjacent(p[i], p[i + 1])).toBe(true);
    }
  });

  it('TC-MAZE-MOD-09 visited 数量单调不减，含起点', () => {
    const ss = steps();
    let prev = 0;
    for (const s of ss) {
      const v = s.maze!.visited ?? [];
      expect(v.length).toBeGreaterThanOrEqual(prev);
      prev = v.length;
    }
    const vLast = new Set((last(ss).maze!.visited ?? []).map(([a, b]) => a + ',' + b));
    expect(vLast.has(MAZE_START[0] + ',' + MAZE_START[1])).toBe(true);
  });

  it('TC-MAZE-MOD-10 每步 current = path 末元素', () => {
    for (const s of steps()) {
      const p = s.maze!.path ?? [];
      expect(s.maze!.current).toEqual(p[p.length - 1]);
    }
  });

  it('TC-MAZE-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = mazeModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of mazeModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-MAZE-MOD-12 module 元信息', () => {
    expect(mazeModule.title).toContain('迷宫');
    expect(mazeModule.initialInput()).toEqual([]);
  });
});
