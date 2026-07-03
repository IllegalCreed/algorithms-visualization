// src/algorithms/queens.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildQueensSteps, queensModule } from './queens.module';
import { queensTrace, QUEENS_N } from './queens';
import type { NQueensExecPoint, Step } from '@/components/player/types';

const steps = () => buildQueensSteps();
const cnt = (ss: Step<NQueensExecPoint>[], p: NQueensExecPoint) =>
  ss.filter((s) => s.point === p).length;
const placed = (q: (number | null)[]) => q.filter((x) => x !== null).length;

describe('queens.module', () => {
  it('TC-QUEENS-MOD-01 末步 solved，queens = oracle [1,3,0,2]', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('solved');
    expect(last.board!.queens).toEqual(queensTrace());
    expect(last.board!.queens).toEqual([1, 3, 0, 2]);
  });

  it('TC-QUEENS-MOD-02 每步执行点合法且携带棋盘轨（array 空）', () => {
    const ok = new Set<NQueensExecPoint>(['init', 'tryConflict', 'place', 'backtrack', 'solved']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.board).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-QUEENS-MOD-03 解合法：4 皇后两两不同行、不同对角线', () => {
    const q = steps()[steps().length - 1].board!.queens as number[];
    for (let i = 0; i < q.length; i++)
      for (let j = i + 1; j < q.length; j++) {
        expect(q[i]).not.toBe(q[j]); // 不同行
        expect(Math.abs(q[i] - q[j])).not.toBe(Math.abs(i - j)); // 不同对角线
      }
  });

  it('TC-QUEENS-MOD-04 init 空盘（queens 全 null）', () => {
    const init = steps().find((s) => s.point === 'init')!;
    expect(init.board!.queens.every((x) => x === null)).toBe(true);
  });

  it('TC-QUEENS-MOD-05 首个 place：tryCell=[0,0]、queens[0]=0', () => {
    const firstPlace = steps().find((s) => s.point === 'place')!;
    expect(firstPlace.board!.tryCell).toEqual([0, 0]);
    expect(firstPlace.board!.queens[0]).toBe(0);
  });

  it('TC-QUEENS-MOD-06 每个 tryConflict 步 conflictCells 非空', () => {
    for (const s of steps().filter((x) => x.point === 'tryConflict')) {
      expect((s.board!.conflictCells ?? []).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('TC-QUEENS-MOD-07 存在回溯：#backtrack >= 1', () => {
    expect(cnt(steps(), 'backtrack')).toBeGreaterThanOrEqual(1);
  });

  it('TC-QUEENS-MOD-08 恰一解：#solved==1，末步满盘 4 皇后', () => {
    const ss = steps();
    expect(cnt(ss, 'solved')).toBe(1);
    expect(placed(ss[ss.length - 1].board!.queens)).toBe(QUEENS_N);
  });

  it('TC-QUEENS-MOD-09 每步已放皇后数在 [0,4]', () => {
    for (const s of steps()) {
      const c = placed(s.board!.queens);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(QUEENS_N);
    }
  });

  it('TC-QUEENS-MOD-10 每个 tryConflict/place 步 tryCell 在盘内', () => {
    for (const s of steps().filter((x) => x.point === 'tryConflict' || x.point === 'place')) {
      const [r, c] = s.board!.tryCell!;
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(QUEENS_N);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(QUEENS_N);
    }
  });

  it('TC-QUEENS-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = queensModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of queensModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-QUEENS-MOD-12 module 元信息', () => {
    expect(queensModule.title).toContain('皇后');
    expect(queensModule.initialInput()).toEqual([]);
  });
});
