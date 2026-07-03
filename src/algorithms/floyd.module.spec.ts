// src/algorithms/floyd.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildFloydSteps, floydModule } from './floyd.module';
import { floydTrace } from './floyd';
import type { FloydExecPoint, Step } from '@/components/player/types';

const steps = () => buildFloydSteps();
const cnt = (ss: Step<FloydExecPoint>[], p: FloydExecPoint) =>
  ss.filter((s) => s.point === p).length;
const num = (v: number | null) => (v === null ? Infinity : v);

describe('floyd.module', () => {
  it('TC-FLOYD-MOD-01 末步 cells = oracle floydTrace() 终态矩阵', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    expect(last.matrix!.cells).toEqual(floydTrace());
    expect(last.matrix!.cells).toEqual([
      [0, 3, 5, 6],
      [8, 0, 2, 3],
      [6, 9, 0, 1],
      [5, 8, 10, 0],
    ]);
  });

  it('TC-FLOYD-MOD-02 每步执行点合法且携带矩阵轨（array 空）', () => {
    const ok = new Set<FloydExecPoint>(['init', 'pivotStart', 'relaxUpdate', 'relaxSkip', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.matrix).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-FLOYD-MOD-03 4 个中转点：#pivotStart == 4', () => {
    expect(cnt(steps(), 'pivotStart')).toBe(4);
  });

  it('TC-FLOYD-MOD-04 松弛统计：#relaxUpdate==10、#relaxSkip==3', () => {
    const ss = steps();
    expect(cnt(ss, 'relaxUpdate')).toBe(10);
    expect(cnt(ss, 'relaxSkip')).toBe(3);
  });

  it('TC-FLOYD-MOD-05 init 步 cells = 邻接矩阵（对角 0、A→B=3、A→D 不可达 null）', () => {
    const init = steps().find((s) => s.point === 'init')!;
    const c = init.matrix!.cells;
    expect(c[0][0]).toBe(0);
    expect(c[0][1]).toBe(3);
    expect(c[0][2]).toBe(6);
    expect(c[0][3]).toBeNull(); // A→D 无直接边
    expect(c[3][0]).toBe(5); // D→A=5
  });

  it('TC-FLOYD-MOD-06 done 步矩阵无 ∞（含环 → 全点对可达）', () => {
    const done = steps().find((s) => s.point === 'done')!;
    expect(done.matrix!.cells.flat().every((v) => v !== null)).toBe(true);
  });

  it('TC-FLOYD-MOD-07 关键最短距离 cells[1][0]=8（B→A）、[0][3]=6（A→D）、[2][1]=9（C→B）', () => {
    const done = steps().find((s) => s.point === 'done')!;
    const c = done.matrix!.cells;
    expect(c[1][0]).toBe(8);
    expect(c[0][3]).toBe(6);
    expect(c[2][1]).toBe(9);
  });

  it('TC-FLOYD-MOD-08 第 k 个 pivotStart 步 matrix.pivot === k', () => {
    const pivots = steps()
      .filter((s) => s.point === 'pivotStart')
      .map((s) => s.matrix!.pivot);
    expect(pivots).toEqual([0, 1, 2, 3]);
  });

  it('TC-FLOYD-MOD-09 每个单元值单调不增（松弛不变量）', () => {
    const ss = steps();
    const n = ss[0].matrix!.cells.length;
    const cur = ss[0].matrix!.cells.map((row) => row.map(num));
    for (const s of ss) {
      const c = s.matrix!.cells;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          expect(num(c[i][j])).toBeLessThanOrEqual(cur[i][j]);
          cur[i][j] = num(c[i][j]);
        }
    }
  });

  it('TC-FLOYD-MOD-10 每个 relax 步 active 非空、sources 长度 2', () => {
    for (const s of steps().filter((x) => x.point === 'relaxUpdate' || x.point === 'relaxSkip')) {
      expect(s.matrix!.active).toBeTruthy();
      expect(s.matrix!.sources).toHaveLength(2);
    }
  });

  it('TC-FLOYD-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = floydModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of floydModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-FLOYD-MOD-12 module 元信息', () => {
    expect(floydModule.title).toContain('Floyd');
    expect(floydModule.initialInput()).toEqual([]);
  });
});
