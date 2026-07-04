// src/algorithms/bbound.module.spec.ts —— 二分边界 module 对拍 oracle（C-092）
import { describe, it, expect } from 'vitest';
import { buildBboundSteps, bboundModule } from './bbound.module';
import { BB_ARRAY, BB_T, bruteLb, bruteUb, boundTrace } from './bbound';
import { bboundSources } from './bbound.sources';

const POINTS = new Set(['init', 'probe', 'settle', 'range', 'done']);

describe('bbound.module', () => {
  const steps = buildBboundSteps(BB_ARRAY);
  const last = steps[steps.length - 1];
  const lb = boundTrace(BB_ARRAY, BB_T, 'lower');
  const ub = boundTrace(BB_ARRAY, BB_T, 'upper');

  it('TC-BB-MOD-01 边界对拍：lb=1、ub=4、count=3 = 线性扫', () => {
    expect(lb.result).toBe(1);
    expect(ub.result).toBe(4);
    expect(lb.result).toBe(bruteLb(BB_ARRAY, BB_T));
    expect(ub.result).toBe(bruteUb(BB_ARRAY, BB_T));
    expect(ub.result - lb.result).toBe(3);
  });

  it('TC-BB-MOD-02 lb 轨迹：四探且仅末探右走', () => {
    expect(lb.probes.map((p) => [p.lo, p.hi, p.mid])).toEqual([
      [0, 10, 5],
      [0, 5, 2],
      [0, 2, 1],
      [0, 1, 0],
    ]);
    expect(lb.probes.map((p) => p.goRight)).toEqual([false, false, false, true]);
  });

  it('TC-BB-MOD-03 ub 轨迹：四探 goRight 交替', () => {
    expect(ub.probes.map((p) => [p.lo, p.hi, p.mid])).toEqual([
      [0, 10, 5],
      [0, 5, 2],
      [3, 5, 4],
      [3, 4, 3],
    ]);
    expect(ub.probes.map((p) => p.goRight)).toEqual([false, true, false, true]);
  });

  it('TC-BB-MOD-04 步合法：10 柱升序恒序含重复', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.array.map((a) => a[1])).toEqual(BB_ARRAY);
    }
  });

  it('TC-BB-MOD-05 步数结构：14 步 point 序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'probe',
      'probe',
      'probe',
      'probe',
      'settle',
      'init',
      'probe',
      'probe',
      'probe',
      'probe',
      'settle',
      'range',
      'done',
    ]);
  });

  it('TC-BB-MOD-06 probe 步：pivotIndex 与区间收缩', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    expect(probes.map((s) => s.emphasis.pivotIndex)).toEqual([5, 2, 1, 0, 5, 2, 4, 3]);
    // lb 第二探后区间 [0,2) → members [0,1]
    expect(probes[1].emphasis.groupMembers).toEqual([0, 1]);
    // ub 第二探后区间 [3,5) → members [3,4]
    expect(probes[5].emphasis.groupMembers).toEqual([3, 4]);
  });

  it('TC-BB-MOD-07 哨兵位：hi=10 时无黄箭头，收缩后出现', () => {
    const init = steps[0];
    expect(init.pointers.find((p) => p.id === '2')).toBeUndefined();
    const probe2 = steps.filter((s) => s.point === 'probe')[1]; // hi 已=5
    expect(probe2.pointers.find((p) => p.id === '2')).toBeDefined();
  });

  it('TC-BB-MOD-08 settle 步：相遇点 [1]、[4] + 第一个 ≥/> 语义', () => {
    const settles = steps.filter((s) => s.point === 'settle');
    expect(settles).toHaveLength(2);
    expect(settles[0].emphasis.sortedIndices).toEqual([1]);
    expect(settles[0].caption).toContain('第一个 ≥');
    expect(settles[1].emphasis.sortedIndices).toEqual([4]);
    expect(settles[1].caption).toContain('第一个 >');
  });

  it('TC-BB-MOD-09 range 步：等值区间 [1,2,3] 全绿 + 计数 3', () => {
    const range = steps.find((s) => s.point === 'range')!;
    expect(range.emphasis.sortedIndices).toEqual([1, 2, 3]);
    expect(range.caption).toContain('3');
  });

  it('TC-BB-MOD-10 done caption：含 ub − lb 与 O(log n)', () => {
    expect(last.caption).toContain('O(log n)');
    expect(last.caption).toContain('ub');
  });

  it('TC-BB-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(bboundSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of bboundSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'init', 'probe', 'range', 'settle'].sort(),
      );
    }
  });

  it('TC-BB-MOD-12 元信息：title 含边界；initialInput 含重复升序', () => {
    expect(bboundModule.title).toContain('边界');
    expect(bboundModule.initialInput()).toEqual(BB_ARRAY);
  });
});
