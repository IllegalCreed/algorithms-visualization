// src/algorithms/three-way-quick.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildThreeWayQuickSortSteps, threeWayQuickSortModule } from './three-way-quick.module';
import { threeWayQuickSortTrace } from './three-way-quick';
import type { Step, ThreeWayExecPoint } from '@/components/player/types';

const BASE = [5, 3, 8, 3, 5, 8, 3, 5];
const vals = (s: Step<ThreeWayExecPoint>) => s.array.map((t) => t[1]);
const keys = (s: Step<ThreeWayExecPoint>) => s.array.map((t) => t[0]);
const cnt = (steps: Step<ThreeWayExecPoint>[], p: ThreeWayExecPoint) =>
  steps.filter((s) => s.point === p).length;

describe('three-way-quick.module', () => {
  it('TC-3WQUICK-MOD-01 末步 done 且值序列 = oracle 结果（有序）', () => {
    const steps = buildThreeWayQuickSortSteps(BASE);
    const last = steps[steps.length - 1];
    expect(last.point).toBe('done');
    expect(vals(last)).toEqual(threeWayQuickSortTrace(BASE).result);
    expect(vals(last)).toEqual([3, 3, 3, 5, 5, 5, 8, 8]);
  });

  it('TC-3WQUICK-MOD-02 不改入参', () => {
    buildThreeWayQuickSortSteps(BASE);
    expect(BASE).toEqual([5, 3, 8, 3, 5, 8, 3, 5]);
  });

  it('TC-3WQUICK-MOD-03 每步 array 位置键集合恒为 0..7', () => {
    for (const s of buildThreeWayQuickSortSteps(BASE)) {
      expect([...keys(s)].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });

  it('TC-3WQUICK-MOD-04 每步执行点合法且携带区间栈 stack', () => {
    const ok = new Set<ThreeWayExecPoint>([
      'pop',
      'pivotSelect',
      'compare',
      'less',
      'greater',
      'equal',
      'push',
      'done',
    ]);
    for (const s of buildThreeWayQuickSortSteps(BASE)) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.stack).toBeDefined();
    }
  });

  it('TC-3WQUICK-MOD-05 三路分支守恒：#compare == #less + #greater + #equal', () => {
    const steps = buildThreeWayQuickSortSteps(BASE);
    expect(cnt(steps, 'compare')).toBe(
      cnt(steps, 'less') + cnt(steps, 'greater') + cnt(steps, 'equal'),
    );
  });

  it('TC-3WQUICK-MOD-06 弹/选/压守恒：#pop == #pivotSelect == #push', () => {
    const steps = buildThreeWayQuickSortSteps(BASE);
    expect(cnt(steps, 'pop')).toBe(cnt(steps, 'pivotSelect'));
    expect(cnt(steps, 'pivotSelect')).toBe(cnt(steps, 'push'));
  });

  it('TC-3WQUICK-MOD-07 首划分基准 = a[lo] = 5', () => {
    const first = buildThreeWayQuickSortSteps(BASE).find((s) => s.point === 'pivotSelect')!;
    expect(first.vars.find((v) => v.name === 'pivot')?.value).toBe(5);
  });

  it('TC-3WQUICK-MOD-08 首划分后三段成形 + 中段（值 5）钉死', () => {
    const steps = buildThreeWayQuickSortSteps(BASE);
    const firstPush = steps.find((s) => s.point === 'push')!;
    expect(vals(firstPush)).toEqual([3, 3, 3, 5, 5, 5, 8, 8]);
    expect(firstPush.emphasis.sortedIndices).toEqual(expect.arrayContaining([3, 4, 5]));
  });

  it('TC-3WQUICK-MOD-09 三分支 less/greater/equal 各至少出现一次', () => {
    const steps = buildThreeWayQuickSortSteps(BASE);
    expect(cnt(steps, 'less')).toBeGreaterThan(0);
    expect(cnt(steps, 'greater')).toBeGreaterThan(0);
    expect(cnt(steps, 'equal')).toBeGreaterThan(0);
  });

  it('TC-3WQUICK-MOD-10 done 步 sortedIndices 全量、无指针', () => {
    const steps = buildThreeWayQuickSortSteps(BASE);
    const done = steps[steps.length - 1];
    expect(done.emphasis.sortedIndices).toHaveLength(BASE.length);
    expect(done.pointers).toEqual([]);
  });

  it('TC-3WQUICK-MOD-11 存在 compare 步同时含 lt/i/gt 三指针', () => {
    const steps = buildThreeWayQuickSortSteps(BASE);
    const has3 = steps.some((s) => {
      if (s.point !== 'compare') return false;
      const ids = s.pointers.map((p) => p.id);
      return ids.includes('3') && ids.includes('1') && ids.includes('0');
    });
    expect(has3).toBe(true);
  });

  it('TC-3WQUICK-MOD-12 四语言 sources 且行号在源码行数内', () => {
    const langs = threeWayQuickSortModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of threeWayQuickSortModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-3WQUICK-MOD-13 module 元信息', () => {
    expect(threeWayQuickSortModule.title).toBe('三路快排');
    expect(threeWayQuickSortModule.initialInput()).toEqual(BASE);
  });
});
