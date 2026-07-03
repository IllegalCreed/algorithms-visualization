// src/algorithms/lis.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildLisSteps, lisModule } from './lis.module';
import { lisDp, lisLength, lisIndices, lisValues, LIS_INPUT } from './lis';
import type { LisExecPoint, Step } from '@/components/player/types';

const steps = () => buildLisSteps();
const cnt = (ss: Step<LisExecPoint>[], p: LisExecPoint) => ss.filter((s) => s.point === p).length;
const last = (ss: Step<LisExecPoint>[]) => ss[ss.length - 1];
const n = LIS_INPUT.length;

describe('lis.module', () => {
  it('TC-LIS-MOD-01 fillDone dp 行最大值 = lisLength() = 4', () => {
    const fd = steps().find((s) => s.point === 'fillDone')!;
    const dpRow = fd.matrix!.cells[1].map((v) => v ?? 0);
    expect(Math.max(...dpRow)).toBe(lisLength());
    expect(lisLength()).toBe(4);
  });

  it('TC-LIS-MOD-02 每步执行点合法且携带矩阵轨（array 空）', () => {
    const ok = new Set<LisExecPoint>(['init', 'scan', 'extend', 'fillDone', 'result']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.matrix).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-LIS-MOD-03 两行表：2 行 × n 列，rowLabels 含「值」「dp」', () => {
    const mt = steps()[0].matrix!;
    expect(mt.cells).toHaveLength(2);
    expect(mt.cells[0]).toHaveLength(n);
    expect(mt.rowLabels).toContain('值');
    expect(mt.rowLabels).toContain('dp');
  });

  it('TC-LIS-MOD-04 init 步 dp 行全 1', () => {
    const init = steps().find((s) => s.point === 'init')!;
    expect(init.matrix!.cells[1]).toEqual(Array(n).fill(1));
  });

  it('TC-LIS-MOD-05 extend 步：active=[1,i]、dp[i]=dp[j]+1（源 j）', () => {
    for (const s of steps().filter((x) => x.point === 'extend')) {
      const [ri, i] = s.matrix!.active!;
      expect(ri).toBe(1);
      const j = (s.matrix!.sources ?? []).find((c) => c[0] === 1)![1]; // dp 源在行 1
      expect(s.matrix!.cells[0][j]! < s.matrix!.cells[0][i]!).toBe(true); // a[j] < a[i]
      expect(s.matrix!.cells[1][i]).toBe((s.matrix!.cells[1][j] as number) + 1);
      expect(s.matrix!.updatedCell).toEqual([1, i]);
    }
  });

  it('TC-LIS-MOD-06 scan 步不更新（updatedCell 空）', () => {
    for (const s of steps().filter((x) => x.point === 'scan')) {
      expect(s.matrix!.updatedCell ?? null).toBeNull();
    }
  });

  it('TC-LIS-MOD-07 末步 result，含 lisValues 连接 1→3→4→5', () => {
    const l = last(steps());
    expect(l.point).toBe('result');
    const text = (l.caption ?? '') + l.vars.map((v) => `${v.name}${v.value}`).join('');
    expect(text).toContain(lisValues().join('→'));
    expect(lisValues().join('→')).toBe('1→3→4→5');
  });

  it('TC-LIS-MOD-08 result 步 pathCells = LIS 位置（值行）', () => {
    const l = last(steps());
    const expected = lisIndices().map((i) => [0, i]);
    expect(l.matrix!.pathCells).toEqual(expected);
    expect(lisIndices()).toEqual([0, 1, 3, 5]);
  });

  it('TC-LIS-MOD-09 末步 dp 行 = lisDp().dp = [1,2,2,3,3,4]', () => {
    expect(last(steps()).matrix!.cells[1]).toEqual(lisDp().dp);
  });

  it('TC-LIS-MOD-10 存在 scan + extend', () => {
    const ss = steps();
    expect(cnt(ss, 'scan')).toBeGreaterThanOrEqual(1);
    expect(cnt(ss, 'extend')).toBeGreaterThanOrEqual(1);
  });

  it('TC-LIS-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = lisModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of lisModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-LIS-MOD-12 module 元信息', () => {
    expect(lisModule.title).toMatch(/递增子序列|LIS/);
    expect(lisModule.initialInput()).toEqual([]);
  });
});
