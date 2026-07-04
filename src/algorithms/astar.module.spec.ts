// src/algorithms/astar.module.spec.ts —— A* 寻路 module 对拍 oracle（C-096）
import { describe, it, expect } from 'vitest';
import { buildAstarSteps, astarModule } from './astar.module';
import { AS_START, AS_GOAL, AS_WALLS, astarTrace, bfsInfo } from './astar';
import { astarSources } from './astar.sources';

const POINTS = new Set(['init', 'expand', 'goal', 'trace', 'done']);

describe('astar.module', () => {
  const steps = buildAstarSteps();
  const last = steps[steps.length - 1];
  const tr = astarTrace();
  const bfs = bfsInfo();

  it('TC-AS-MOD-01 最优对拍：路径 8 步 = BFS 最短且逐步相邻', () => {
    expect(tr.path.length - 1).toBe(8);
    expect(tr.path.length - 1).toBe(bfs.shortest);
    expect(tr.path[0]).toEqual(AS_START);
    expect(tr.path[tr.path.length - 1]).toEqual(AS_GOAL);
    for (let i = 1; i < tr.path.length; i++) {
      const [r1, c1] = tr.path[i - 1];
      const [r2, c2] = tr.path[i];
      expect(Math.abs(r1 - r2) + Math.abs(c1 - c2)).toBe(1);
    }
  });

  it('TC-AS-MOD-02 省的对拍：扩展 10 < BFS 可达 22', () => {
    expect(tr.expansions).toHaveLength(10);
    expect(bfs.reachable).toBe(22);
    expect(tr.expansions.length).toBeLessThan(bfs.reachable);
  });

  it('TC-AS-MOD-03 扩展序全等（tie-break f,h,r,c）', () => {
    expect(tr.expansions.map((e) => [...e.cell, e.f])).toEqual([
      [1, 0, 6],
      [1, 1, 6],
      [2, 1, 6],
      [2, 0, 6],
      [3, 1, 8],
      [3, 2, 8],
      [3, 3, 8],
      [2, 3, 8],
      [2, 4, 8],
      [2, 5, 8],
    ]);
  });

  it('TC-AS-MOD-04 步合法：point + maze + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.maze).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-AS-MOD-05 步数结构：13 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'expand',
      'expand',
      'expand',
      'expand',
      'expand',
      'expand',
      'expand',
      'expand',
      'expand',
      'goal',
      'trace',
      'done',
    ]);
  });

  it('TC-AS-MOD-06 expand 步：current=弹出格、visited 累积', () => {
    const expands = steps.filter((s) => s.point === 'expand');
    expands.forEach((s, k) => {
      expect(s.maze!.current).toEqual(tr.expansions[k].cell);
      expect(s.maze!.visited).toHaveLength(k + 1);
    });
  });

  it('TC-AS-MOD-07 letters：f 值累积、未触达与墙为空', () => {
    const lastExpand = steps.filter((s) => s.point === 'expand').at(-1)!;
    const L = lastExpand.maze!.letters!;
    expect(L[1][0]).toBe('6'); // 起点 f=6
    expect(L[3][3]).toBe('8');
    for (const [wr, wc] of AS_WALLS) expect(L[wr][wc]).toBe('');
    expect(L[0][5]).toBe(''); // 从未触达的角落
  });

  it('TC-AS-MOD-08 goal 步：current=G + 终点语义', () => {
    const goal = steps.find((s) => s.point === 'goal')!;
    expect(goal.maze!.current).toEqual(AS_GOAL);
    expect(goal.caption).toContain('终点');
  });

  it('TC-AS-MOD-09 trace 步：8 步最优路径 + solved', () => {
    const trace = steps.find((s) => s.point === 'trace')!;
    expect(trace.maze!.path).toEqual(tr.path);
    expect(trace.maze!.solved).toBe(true);
  });

  it('TC-AS-MOD-10 done caption：含 10 与 22 与可采纳语义', () => {
    expect(last.caption).toContain('10');
    expect(last.caption).toContain('22');
    expect(last.caption).toContain('高估');
  });

  it('TC-AS-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(astarSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of astarSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'expand', 'goal', 'init', 'trace'].sort(),
      );
    }
  });

  it('TC-AS-MOD-12 元信息：title 含 A*；initialInput=[]；mark=🧭', () => {
    expect(astarModule.title).toContain('A*');
    expect(astarModule.initialInput()).toEqual([]);
    expect(steps[0].maze!.mark).toBe('🧭');
  });
});
