// src/algorithms/editdist.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildEditDistSteps, editDistModule } from './editdist.module';
import { editDistTrace } from './editdist';
import type { EditDistExecPoint, Step } from '@/components/player/types';

const steps = () => buildEditDistSteps();
const cnt = (ss: Step<EditDistExecPoint>[], p: EditDistExecPoint) =>
  ss.filter((s) => s.point === p).length;

describe('editdist.module', () => {
  it('TC-EDIT-MOD-01 末步 cells = oracle editDistTrace()，右下角 = 2', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    expect(last.matrix!.cells).toEqual(editDistTrace());
    expect(last.matrix!.cells[3][3]).toBe(2);
  });

  it('TC-EDIT-MOD-02 每步执行点合法且携带矩阵轨（array 空）', () => {
    const ok = new Set<EditDistExecPoint>(['init', 'cellMatch', 'cellDiff', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.matrix).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-EDIT-MOD-03 填格统计：#cellMatch==1（仅 S==S）、#cellDiff==8', () => {
    const ss = steps();
    expect(cnt(ss, 'cellMatch')).toBe(1);
    expect(cnt(ss, 'cellDiff')).toBe(8);
  });

  it('TC-EDIT-MOD-04 init 步边界：第 0 行/列 = [0,1,2,3]，内部 null', () => {
    const init = steps().find((s) => s.point === 'init')!;
    const c = init.matrix!.cells;
    expect(c[0]).toEqual([0, 1, 2, 3]);
    expect([c[0][0], c[1][0], c[2][0], c[3][0]]).toEqual([0, 1, 2, 3]);
    expect(c[1][1]).toBeNull(); // 内部格未填
  });

  it('TC-EDIT-MOD-05 (1,1) match 步：cells[1][1]=0、sources 单个左上 [[0,0]]', () => {
    const firstMatch = steps().find((s) => s.point === 'cellMatch')!;
    expect(firstMatch.matrix!.cells[1][1]).toBe(0);
    expect(firstMatch.matrix!.sources).toEqual([[0, 0]]);
  });

  it('TC-EDIT-MOD-06 每个 cellDiff 步 sources 长度 3（左上/上/左）', () => {
    for (const s of steps().filter((x) => x.point === 'cellDiff')) {
      expect(s.matrix!.sources).toHaveLength(3);
    }
  });

  it('TC-EDIT-MOD-07 每步行列标签 + emptyText 空白', () => {
    for (const s of steps()) {
      expect(s.matrix!.rowLabels).toEqual(['∅', 'S', 'A', 'T']);
      expect(s.matrix!.colLabels).toEqual(['∅', 'S', 'U', 'N']);
      expect(s.matrix!.emptyText).toBe('');
    }
  });

  it('TC-EDIT-MOD-08 编辑距离答案 = 2', () => {
    const done = steps().find((s) => s.point === 'done')!;
    expect(done.matrix!.cells[3][3]).toBe(2);
    expect(editDistTrace()[3][3]).toBe(2);
  });

  it('TC-EDIT-MOD-09 单元写入一次不变（DP 不变量）', () => {
    const ss = steps();
    const n = 4;
    const seen: (number | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));
    for (const s of ss) {
      const c = s.matrix!.cells;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          if (seen[i][j] !== null) expect(c[i][j]).toBe(seen[i][j]); // 一旦填入不再改
          if (c[i][j] !== null) seen[i][j] = c[i][j];
        }
    }
  });

  it('TC-EDIT-MOD-10 每个填格步 active 为当前格', () => {
    for (const s of steps().filter((x) => x.point === 'cellMatch' || x.point === 'cellDiff')) {
      expect(s.matrix!.active).toBeTruthy();
      expect(s.matrix!.active).toHaveLength(2);
    }
  });

  it('TC-EDIT-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = editDistModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of editDistModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-EDIT-MOD-12 module 元信息', () => {
    expect(editDistModule.title).toContain('编辑距离');
    expect(editDistModule.initialInput()).toEqual([]);
  });
});
