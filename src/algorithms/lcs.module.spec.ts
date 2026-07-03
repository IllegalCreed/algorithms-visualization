// src/algorithms/lcs.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildLcsSteps, lcsModule } from './lcs.module';
import { lcsLength, lcsString, lcsPath, LCS_X, LCS_Y } from './lcs';
import type { LcsExecPoint, Step } from '@/components/player/types';

const steps = () => buildLcsSteps();
const cnt = (ss: Step<LcsExecPoint>[], p: LcsExecPoint) => ss.filter((s) => s.point === p).length;
const last = (ss: Step<LcsExecPoint>[]) => ss[ss.length - 1];
const m = LCS_X.length;
const n = LCS_Y.length;

describe('lcs.module', () => {
  it('TC-LCS-MOD-01 fillDone 右下角 = lcsLength() = 3', () => {
    const fd = steps().find((s) => s.point === 'fillDone')!;
    expect(fd.matrix!.cells[m][n]).toBe(lcsLength());
    expect(lcsLength()).toBe(3);
  });

  it('TC-LCS-MOD-02 每步执行点合法且携带矩阵轨（array 空）', () => {
    const ok = new Set<LcsExecPoint>(['init', 'match', 'mismatch', 'fillDone', 'trace', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.matrix).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-LCS-MOD-03 DP 表 (m+1)×(n+1) = 5×5，标签含 ∅ + 字符', () => {
    const mt = steps()[0].matrix!;
    expect(mt.cells).toHaveLength(m + 1);
    expect(mt.cells[0]).toHaveLength(n + 1);
    expect(mt.rowLabels).toEqual(['∅', ...LCS_X.split('')]);
    expect(mt.colLabels).toEqual(['∅', ...LCS_Y.split('')]);
  });

  it('TC-LCS-MOD-04 init 步第 0 行、第 0 列全 0', () => {
    const init = steps().find((s) => s.point === 'init')!;
    const c = init.matrix!.cells;
    for (let j = 0; j <= n; j++) expect(c[0][j]).toBe(0);
    for (let i = 0; i <= m; i++) expect(c[i][0]).toBe(0);
  });

  it('TC-LCS-MOD-05 match 步取左上 +1', () => {
    for (const s of steps().filter((x) => x.point === 'match')) {
      const [i, j] = s.matrix!.active!;
      expect(LCS_X[i - 1]).toBe(LCS_Y[j - 1]);
      expect(s.matrix!.cells[i][j]).toBe((s.matrix!.cells[i - 1][j - 1] as number) + 1);
    }
  });

  it('TC-LCS-MOD-06 mismatch 步取上/左较大', () => {
    for (const s of steps().filter((x) => x.point === 'mismatch')) {
      const [i, j] = s.matrix!.active!;
      expect(LCS_X[i - 1]).not.toBe(LCS_Y[j - 1]);
      const up = s.matrix!.cells[i - 1][j] as number;
      const left = s.matrix!.cells[i][j - 1] as number;
      expect(s.matrix!.cells[i][j]).toBe(Math.max(up, left));
    }
  });

  it('TC-LCS-MOD-07 末步 done，vars/caption 含 lcsString() = ACD', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    const text = (l.caption ?? '') + l.vars.map((v) => `${v.name}${v.value}`).join('');
    expect(text).toContain(lcsString());
    expect(lcsString()).toBe('ACD');
  });

  it('TC-LCS-MOD-08 trace/done 步 pathCells = lcsPath()', () => {
    expect(last(steps()).matrix!.pathCells).toEqual(lcsPath());
    // 首个 trace 的 pathCells 首元素 = 右下角 (m,n)
    const firstTrace = steps().find((s) => s.point === 'trace')!;
    expect(firstTrace.matrix!.pathCells![0]).toEqual([m, n]);
  });

  it('TC-LCS-MOD-09 trace 步 pathCells 数量单调不减', () => {
    let prev = 0;
    for (const s of steps().filter((x) => x.point === 'trace' || x.point === 'done')) {
      const len = (s.matrix!.pathCells ?? []).length;
      expect(len).toBeGreaterThanOrEqual(prev);
      prev = len;
    }
  });

  it('TC-LCS-MOD-10 存在填表 + 回溯', () => {
    const ss = steps();
    expect(cnt(ss, 'match')).toBeGreaterThanOrEqual(1);
    expect(cnt(ss, 'mismatch')).toBeGreaterThanOrEqual(1);
    expect(cnt(ss, 'trace')).toBeGreaterThanOrEqual(1);
  });

  it('TC-LCS-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = lcsModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of lcsModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-LCS-MOD-12 module 元信息', () => {
    expect(lcsModule.title).toMatch(/公共子序列|LCS/);
    expect(lcsModule.initialInput()).toEqual([]);
  });
});
