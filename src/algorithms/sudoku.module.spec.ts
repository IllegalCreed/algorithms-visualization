// src/algorithms/sudoku.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildSudokuSteps, sudokuModule } from './sudoku.module';
import { sudokuSolution, sudokuValid, SUDOKU_PUZZLE, SUDOKU_N } from './sudoku';
import type { SudokuExecPoint, Step } from '@/components/player/types';

const steps = () => buildSudokuSteps();
const last = (ss: Step<SudokuExecPoint>[]) => ss[ss.length - 1];
const cnt = (ss: Step<SudokuExecPoint>[], p: SudokuExecPoint) =>
  ss.filter((s) => s.point === p).length;
// 把当前 grid（含 null）转成数字盘（null→0）以复用 sudokuValid
const numGrid = (g: (number | null)[][]) => g.map((row) => row.map((v) => v ?? 0));

describe('sudoku.module', () => {
  it('TC-SDK-MOD-01 末步 done + solved + 终盘 = oracle', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.sudoku!.solved).toBe(true);
    expect(l.sudoku!.grid).toEqual(sudokuSolution());
  });

  it('TC-SDK-MOD-02 每步执行点合法且带数独轨（array 空）', () => {
    const ok = new Set<SudokuExecPoint>(['init', 'reject', 'place', 'backtrack', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.sudoku).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-SDK-MOD-03 给定格恒等于初始谜题', () => {
    for (const s of steps()) {
      const g = s.sudoku!;
      for (let r = 0; r < SUDOKU_N; r++)
        for (let c = 0; c < SUDOKU_N; c++)
          if (g.given[r][c]) expect(g.grid[r][c]).toBe(SUDOKU_PUZZLE[r][c]);
    }
  });

  it('TC-SDK-MOD-04 含真回溯（backtrack ≥ 2）', () => {
    expect(cnt(steps(), 'backtrack')).toBeGreaterThanOrEqual(2);
  });

  it('TC-SDK-MOD-05 place 填入合法（不与已填冲突）', () => {
    for (const s of steps().filter((x) => x.point === 'place')) {
      const [r, c] = s.sudoku!.current as [number, number];
      const v = s.sudoku!.grid[r][c] as number;
      // 该步 grid 已含 v，先清成 0 再校验唯一
      const g = numGrid(s.sudoku!.grid);
      g[r][c] = 0;
      expect(sudokuValid(g, r, c, v)).toBe(true);
    }
  });

  it('TC-SDK-MOD-06 reject 确有冲突', () => {
    for (const s of steps().filter((x) => x.point === 'reject')) {
      const [r, c] = s.sudoku!.current as [number, number];
      const v = s.sudoku!.tryNum as number;
      const g = numGrid(s.sudoku!.grid);
      expect(sudokuValid(g, r, c, v)).toBe(false); // 与行/列/宫冲突
    }
  });

  it('TC-SDK-MOD-07 backtrack 清空当前格且非给定', () => {
    for (const s of steps().filter((x) => x.point === 'backtrack')) {
      const [r, c] = s.sudoku!.current as [number, number];
      expect(s.sudoku!.grid[r][c]).toBeNull();
      expect(s.sudoku!.given[r][c]).toBe(false);
    }
  });

  it('TC-SDK-MOD-08 每步盘面合法（已填部分行/列/宫无重复）', () => {
    for (const s of steps()) {
      const g = numGrid(s.sudoku!.grid);
      for (let r = 0; r < SUDOKU_N; r++)
        for (let c = 0; c < SUDOKU_N; c++) {
          const v = g[r][c];
          if (v === 0) continue;
          g[r][c] = 0;
          expect(sudokuValid(g, r, c, v)).toBe(true);
          g[r][c] = v;
        }
    }
  });

  it('TC-SDK-MOD-09 终盘每格已填，每行为 1..4 全排列', () => {
    const grid = last(steps()).sudoku!.grid;
    for (const row of grid) {
      expect(row.every((v) => v != null)).toBe(true);
      expect([...row].sort()).toEqual([1, 2, 3, 4]);
    }
  });

  it('TC-SDK-MOD-10 vars 展示盘尺寸/当前格', () => {
    const text = steps()
      .flatMap((s) => s.vars.map((v) => `${v.name}${v.value}`))
      .join(' ');
    expect(text).toContain('4');
  });

  it('TC-SDK-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = sudokuModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of sudokuModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-SDK-MOD-12 module 元信息', () => {
    expect(sudokuModule.title).toMatch(/数独/);
    expect(sudokuModule.initialInput()).toEqual([]);
  });
});
