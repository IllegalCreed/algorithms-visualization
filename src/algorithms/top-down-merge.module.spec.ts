// src/algorithms/top-down-merge.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildTopDownMergeSortSteps, topDownMergeSortModule } from './top-down-merge.module';
import { topDownMergeSortTrace } from './top-down-merge';
import type { Step, TopDownMergeExecPoint } from '@/components/player/types';

const BASE = [6, 3, 8, 1, 9, 2, 7, 4];
const vals = (s: Step<TopDownMergeExecPoint>) => s.array.map((t) => t[1]);
const keys = (s: Step<TopDownMergeExecPoint>) => s.array.map((t) => t[0]);
const cnt = (steps: Step<TopDownMergeExecPoint>[], p: TopDownMergeExecPoint) =>
  steps.filter((s) => s.point === p).length;

describe('top-down-merge.module', () => {
  it('TC-TDMERGE-MOD-01 末步 done 且值序列 = oracle 结果（有序）', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    const last = steps[steps.length - 1];
    expect(last.point).toBe('done');
    expect(vals(last)).toEqual(topDownMergeSortTrace(BASE).result);
    expect(vals(last)).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
  });

  it('TC-TDMERGE-MOD-02 不改入参', () => {
    buildTopDownMergeSortSteps(BASE);
    expect(BASE).toEqual([6, 3, 8, 1, 9, 2, 7, 4]);
  });

  it('TC-TDMERGE-MOD-03 每步 array 位置键集合恒为 0..7', () => {
    for (const s of buildTopDownMergeSortSteps(BASE)) {
      expect([...keys(s)].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });

  it('TC-TDMERGE-MOD-04 每步执行点合法且同时带 aux 与 stack 双辅助轨', () => {
    const ok = new Set<TopDownMergeExecPoint>([
      'split',
      'mergeStart',
      'compare',
      'takeLeft',
      'takeRight',
      'drainLeft',
      'drainRight',
      'writeBack',
      'done',
    ]);
    for (const s of buildTopDownMergeSortSteps(BASE)) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.aux).toBeDefined();
      expect(s.stack).toBeDefined();
    }
  });

  it('TC-TDMERGE-MOD-05 split 结构：共 7 个且首 split 栈为 [[0,7]]', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    expect(cnt(steps, 'split')).toBe(7);
    const first = steps.find((s) => s.point === 'split')!;
    expect(first.stack!.frames).toEqual([{ lo: 0, hi: 7 }]);
  });

  it('TC-TDMERGE-MOD-06 merge 块守恒：#mergeStart == #writeBack == 7', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    expect(cnt(steps, 'mergeStart')).toBe(7);
    expect(cnt(steps, 'writeBack')).toBe(7);
  });

  it('TC-TDMERGE-MOD-07 比较/写入守恒：#compare=#take、take+drain=24', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    const takes = cnt(steps, 'takeLeft') + cnt(steps, 'takeRight');
    const drains = cnt(steps, 'drainLeft') + cnt(steps, 'drainRight');
    expect(cnt(steps, 'compare')).toBe(takes);
    expect(takes + drains).toBe(24);
  });

  it('TC-TDMERGE-MOD-08 首个合并快照：merge[0,1] 拷回后前两位 [3,6]', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    const firstWB = steps.find((s) => s.point === 'writeBack')!;
    expect(vals(firstWB).slice(0, 2)).toEqual([3, 6]);
  });

  it('TC-TDMERGE-MOD-09 递归栈深达 3 且 done 步栈空', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    expect(steps.some((s) => s.stack!.frames.length === 3)).toBe(true);
    const done = steps[steps.length - 1];
    expect(done.stack!.frames).toEqual([]);
  });

  it('TC-TDMERGE-MOD-10 栈顶=当前活动区间：首 mergeStart 栈顶 [0,1]', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    const firstMS = steps.find((s) => s.point === 'mergeStart')!;
    const top = firstMS.stack!.frames[firstMS.stack!.frames.length - 1];
    expect(top).toEqual({ lo: 0, hi: 1 });
  });

  it('TC-TDMERGE-MOD-11 done 步 sortedFrom=0、无指针', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    const done = steps[steps.length - 1];
    expect(done.emphasis.sortedFrom).toBe(0);
    expect(done.pointers).toEqual([]);
  });

  it('TC-TDMERGE-MOD-12 存在 compare 步含 i/j 双指针且带 comparing', () => {
    const steps = buildTopDownMergeSortSteps(BASE);
    const has = steps.some((s) => {
      if (s.point !== 'compare') return false;
      const ids = s.pointers.map((p) => p.id);
      return ids.includes('0') && ids.includes('1') && !!s.emphasis.comparing;
    });
    expect(has).toBe(true);
  });

  it('TC-TDMERGE-MOD-13 四语言 sources 且行号在源码行数内', () => {
    const langs = topDownMergeSortModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of topDownMergeSortModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-TDMERGE-MOD-14 module 元信息', () => {
    expect(topDownMergeSortModule.title).toBe('自顶向下归并');
    expect(topDownMergeSortModule.initialInput()).toEqual(BASE);
  });
});
