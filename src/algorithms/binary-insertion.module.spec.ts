// src/algorithms/binary-insertion.module.spec.ts
import { describe, it, expect } from 'vitest';
import {
  buildBinaryInsertionSortSteps,
  binaryInsertionSortModule,
} from './binary-insertion.module';
import { binaryInsertionSortTrace } from './binary-insertion';
import type { BinaryInsertionExecPoint, Step } from '@/components/player/types';

const BASE = [5, 2, 9, 4, 7, 1, 8, 3];
const vals = (s: Step<BinaryInsertionExecPoint>) => s.array.map((t) => t[1]);
const keys = (s: Step<BinaryInsertionExecPoint>) => s.array.map((t) => t[0]);
const cnt = (steps: Step<BinaryInsertionExecPoint>[], p: BinaryInsertionExecPoint) =>
  steps.filter((s) => s.point === p).length;
const varOf = (s: Step<BinaryInsertionExecPoint>, name: string) =>
  s.vars.find((v) => v.name === name)?.value;

describe('binary-insertion.module', () => {
  it('TC-BININS-MOD-01 末步 done 且值序列 = oracle 结果（有序）', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    const last = steps[steps.length - 1];
    expect(last.point).toBe('done');
    expect(vals(last)).toEqual(binaryInsertionSortTrace(BASE).result);
    expect(vals(last)).toEqual([1, 2, 3, 4, 5, 7, 8, 9]);
  });

  it('TC-BININS-MOD-02 不改入参', () => {
    buildBinaryInsertionSortSteps(BASE);
    expect(BASE).toEqual([5, 2, 9, 4, 7, 1, 8, 3]);
  });

  it('TC-BININS-MOD-03 每步 array 位置键集合恒为 0..7', () => {
    for (const s of buildBinaryInsertionSortSteps(BASE)) {
      expect([...keys(s)].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });

  it('TC-BININS-MOD-04 每步执行点合法', () => {
    const ok = new Set<BinaryInsertionExecPoint>([
      'outerLoop',
      'probe',
      'goLeft',
      'goRight',
      'found',
      'shift',
      'insert',
      'done',
    ]);
    for (const s of buildBinaryInsertionSortSteps(BASE)) {
      expect(ok.has(s.point)).toBe(true);
    }
  });

  it('TC-BININS-MOD-05 轮结构守恒：#outerLoop=#found=#insert=7', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    expect(cnt(steps, 'outerLoop')).toBe(7);
    expect(cnt(steps, 'found')).toBe(7);
    expect(cnt(steps, 'insert')).toBe(7);
  });

  it('TC-BININS-MOD-06 折半守恒：#probe=#goLeft+#goRight=15', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    expect(cnt(steps, 'probe')).toBe(cnt(steps, 'goLeft') + cnt(steps, 'goRight'));
    expect(cnt(steps, 'probe')).toBe(15);
  });

  it('TC-BININS-MOD-07 搬移总数：#shift=15', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    expect(cnt(steps, 'shift')).toBe(15);
  });

  it('TC-BININS-MOD-08 零移动轮：key=9 found pos=2 后紧跟 insert', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    const idx = steps.findIndex((s) => s.point === 'found' && varOf(s, 'key') === 9);
    expect(idx).toBeGreaterThan(-1);
    expect(varOf(steps[idx], 'pos')).toBe(2);
    expect(steps[idx + 1].point).toBe('insert');
  });

  it('TC-BININS-MOD-09 全移动轮：key=1 found pos=0 后连续 5 个 shift', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    const idx = steps.findIndex((s) => s.point === 'found' && varOf(s, 'key') === 1);
    expect(varOf(steps[idx], 'pos')).toBe(0);
    for (let k = 1; k <= 5; k++) expect(steps[idx + k].point).toBe('shift');
    expect(steps[idx + 6].point).toBe('insert');
  });

  it('TC-BININS-MOD-10 probe 步含 lo/mid/hi 三指针且带 comparing', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    const probes = steps.filter((s) => s.point === 'probe');
    expect(probes.length).toBeGreaterThan(0);
    for (const s of probes) {
      const ids = s.pointers.map((p) => p.id);
      expect(ids).toContain('3'); // lo 绿
      expect(ids).toContain('1'); // mid 蓝
      expect(ids).toContain('0'); // hi 红
      expect(s.emphasis.comparing).toBeDefined();
    }
  });

  it('TC-BININS-MOD-11 outerLoop 步 keyIndex = i', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    for (const s of steps.filter((x) => x.point === 'outerLoop')) {
      expect(s.emphasis.keyIndex).toBe(varOf(s, 'i'));
    }
  });

  it('TC-BININS-MOD-12 done 步 sortedUpTo=n、无指针', () => {
    const steps = buildBinaryInsertionSortSteps(BASE);
    const done = steps[steps.length - 1];
    expect(done.emphasis.sortedUpTo).toBe(BASE.length);
    expect(done.pointers).toEqual([]);
  });

  it('TC-BININS-MOD-13 四语言 sources 且行号在源码行数内', () => {
    const langs = binaryInsertionSortModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of binaryInsertionSortModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-BININS-MOD-14 module 元信息', () => {
    expect(binaryInsertionSortModule.title).toBe('二分插入排序');
    expect(binaryInsertionSortModule.initialInput()).toEqual(BASE);
  });
});
