// src/algorithms/dual-pivot-quick.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildDualPivotQuickSortSteps, dualPivotQuickSortModule } from './dual-pivot-quick.module';
import { dualPivotQuickSortTrace } from './dual-pivot-quick';
import type { DualPivotExecPoint, Step } from '@/components/player/types';

const BASE = [3, 5, 9, 1, 6, 2, 4, 7];
const vals = (s: Step<DualPivotExecPoint>) => s.array.map((t) => t[1]);
const keys = (s: Step<DualPivotExecPoint>) => s.array.map((t) => t[0]);
const cnt = (steps: Step<DualPivotExecPoint>[], p: DualPivotExecPoint) =>
  steps.filter((s) => s.point === p).length;
const varOf = (s: Step<DualPivotExecPoint>, name: string) =>
  s.vars.find((v) => v.name === name)?.value;

describe('dual-pivot-quick.module', () => {
  it('TC-DUALPIVOT-MOD-01 末步 done 且值序列 = oracle 结果（有序）', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    const last = steps[steps.length - 1];
    expect(last.point).toBe('done');
    expect(vals(last)).toEqual(dualPivotQuickSortTrace(BASE).result);
    expect(vals(last)).toEqual([1, 2, 3, 4, 5, 6, 7, 9]);
  });

  it('TC-DUALPIVOT-MOD-02 不改入参', () => {
    buildDualPivotQuickSortSteps(BASE);
    expect(BASE).toEqual([3, 5, 9, 1, 6, 2, 4, 7]);
  });

  it('TC-DUALPIVOT-MOD-03 每步 array 位置键集合恒为 0..7', () => {
    for (const s of buildDualPivotQuickSortSteps(BASE)) {
      expect([...keys(s)].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });

  it('TC-DUALPIVOT-MOD-04 每步执行点合法且携带区间栈 stack', () => {
    const ok = new Set<DualPivotExecPoint>([
      'pop',
      'pivotSelect',
      'compare',
      'less',
      'between',
      'greater',
      'pivotPlace',
      'push',
      'done',
    ]);
    for (const s of buildDualPivotQuickSortSteps(BASE)) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.stack).toBeDefined();
    }
  });

  it('TC-DUALPIVOT-MOD-05 三路分支守恒：#compare == #less + #between + #greater', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    expect(cnt(steps, 'compare')).toBe(
      cnt(steps, 'less') + cnt(steps, 'between') + cnt(steps, 'greater'),
    );
  });

  it('TC-DUALPIVOT-MOD-06 弹/选/归/压守恒：#pop == #pivotSelect == #pivotPlace == #push', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    expect(cnt(steps, 'pop')).toBe(cnt(steps, 'pivotSelect'));
    expect(cnt(steps, 'pivotSelect')).toBe(cnt(steps, 'pivotPlace'));
    expect(cnt(steps, 'pivotPlace')).toBe(cnt(steps, 'push'));
  });

  it('TC-DUALPIVOT-MOD-07 首趟双基准 p=3/q=7 且扫描步 pivotIndices=[0,7] 双紫', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    const firstSelect = steps.find((s) => s.point === 'pivotSelect')!;
    expect(varOf(firstSelect, 'p')).toBe(3);
    expect(varOf(firstSelect, 'q')).toBe(7);
    expect(firstSelect.emphasis.pivotIndices).toEqual([0, 7]);
    const firstCompare = steps.find((s) => s.point === 'compare')!;
    expect(firstCompare.emphasis.pivotIndices).toEqual([0, 7]);
  });

  it('TC-DUALPIVOT-MOD-08 首趟归位快照：array=[2,1,3,5,6,4,7,9] 且 2/6 钉死', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    const firstPlace = steps.find((s) => s.point === 'pivotPlace')!;
    expect(vals(firstPlace)).toEqual([2, 1, 3, 5, 6, 4, 7, 9]);
    expect(firstPlace.emphasis.sortedIndices).toEqual(expect.arrayContaining([2, 6]));
    expect(firstPlace.emphasis.pivotIndices).toBeUndefined(); // 归位后不再染紫
  });

  it('TC-DUALPIVOT-MOD-09 三分支 less/between/greater 各至少出现一次', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    expect(cnt(steps, 'less')).toBeGreaterThan(0);
    expect(cnt(steps, 'between')).toBeGreaterThan(0);
    expect(cnt(steps, 'greater')).toBeGreaterThan(0);
  });

  it('TC-DUALPIVOT-MOD-10 每个 pivotSelect p≤q，且存在「首尾反了先交换」步', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    const selects = steps.filter((s) => s.point === 'pivotSelect');
    for (const s of selects) {
      expect(Number(varOf(s, 'p'))).toBeLessThanOrEqual(Number(varOf(s, 'q')));
    }
    expect(selects.some((s) => s.caption?.includes('交换'))).toBe(true);
  });

  it('TC-DUALPIVOT-MOD-11 done 步 sortedIndices 全量、无指针', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    const done = steps[steps.length - 1];
    expect(done.emphasis.sortedIndices).toHaveLength(BASE.length);
    expect(done.pointers).toEqual([]);
  });

  it('TC-DUALPIVOT-MOD-12 存在 compare 步同时含 lt/i/gt 三指针', () => {
    const steps = buildDualPivotQuickSortSteps(BASE);
    const has3 = steps.some((s) => {
      if (s.point !== 'compare') return false;
      const ids = s.pointers.map((p) => p.id);
      return ids.includes('3') && ids.includes('1') && ids.includes('0');
    });
    expect(has3).toBe(true);
  });

  it('TC-DUALPIVOT-MOD-13 四语言 sources 且行号在源码行数内', () => {
    const langs = dualPivotQuickSortModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of dualPivotQuickSortModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-DUALPIVOT-MOD-14 module 元信息', () => {
    expect(dualPivotQuickSortModule.title).toBe('双轴快排');
    expect(dualPivotQuickSortModule.initialInput()).toEqual(BASE);
  });
});
