import { describe, it, expect } from 'vitest';
import { buildRadixSortSteps, radixSortModule } from './radix-sort.module';
import { radixSortSources } from './radix-sort.sources';
import { radixSortTrace } from './radix-sort';
import type { Step } from '@/components/player/types';

const BASE = [42, 7, 25, 63, 18, 31, 56, 9];
const val = (s: Step) => s.array.map((t) => t[1]);
const keys = (s: Step) => s.array.map((t) => t[0]);
const byPoint = (steps: Step[], p: string) => steps.filter((s) => s.point === p);

describe('radix-sort.module 基数排序步骤', () => {
  it('TC-RADIX-MOD-01 末步 done、有序 = oracle.result', () => {
    const steps = buildRadixSortSteps(BASE);
    const last = steps.at(-1)!;
    expect(last.point).toBe('done');
    expect(val(last)).toEqual(radixSortTrace(BASE).result);
    expect(val(last)).toEqual([7, 9, 18, 25, 31, 42, 56, 63]);
  });

  it('TC-RADIX-MOD-02 不修改入参', () => {
    const copy = [...BASE];
    buildRadixSortSteps(BASE);
    expect(BASE).toEqual(copy);
  });

  it('TC-RADIX-MOD-03 位置键恒为 0..7', () => {
    for (const s of buildRadixSortSteps(BASE))
      expect([...keys(s)].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
  });

  it('TC-RADIX-MOD-04 每步 point 合法且带桶轨 count', () => {
    for (const s of buildRadixSortSteps(BASE)) {
      expect(['passStart', 'distribute', 'collect', 'done']).toContain(s.point);
      expect(s.count).toBeTruthy();
    }
  });

  it('TC-RADIX-MOD-05 步数结构：distribute 16 / collect 16 / passStart 2 / done 1', () => {
    const steps = buildRadixSortSteps(BASE);
    expect(byPoint(steps, 'distribute')).toHaveLength(16);
    expect(byPoint(steps, 'collect')).toHaveLength(16);
    expect(byPoint(steps, 'passStart')).toHaveLength(2);
    expect(byPoint(steps, 'done')).toHaveLength(1);
  });

  it('TC-RADIX-MOD-06 第 1 轮个位分桶计数 [0,1,1,1,0,1,1,1,1,1]', () => {
    const dist = byPoint(buildRadixSortSteps(BASE), 'distribute');
    expect(dist[7].count!.buckets).toEqual([0, 1, 1, 1, 0, 1, 1, 1, 1, 1]);
  });

  it('TC-RADIX-MOD-07 首个 distribute（42 个位 2）activeBucket 2 + 读游标 1', () => {
    const first = byPoint(buildRadixSortSteps(BASE), 'distribute')[0];
    expect(first.count!.activeBucket).toBe(2);
    expect(first.pointers.some((p) => p.id === '1')).toBe(true);
  });

  it('TC-RADIX-MOD-08 第 1 轮收集结果 [31,42,63,25,56,7,18,9] + 写游标 3', () => {
    const collect = byPoint(buildRadixSortSteps(BASE), 'collect');
    expect(val(collect[7])).toEqual([31, 42, 63, 25, 56, 7, 18, 9]);
    expect(collect[7].pointers.some((p) => p.id === '3')).toBe(true);
  });

  it('TC-RADIX-MOD-09 done 步 sortedUpTo=n、无指针', () => {
    const last = buildRadixSortSteps(BASE).at(-1)!;
    expect(last.emphasis.sortedUpTo).toBe(BASE.length);
    expect(last.pointers).toEqual([]);
  });

  it('TC-RADIX-MOD-10 四语言齐备', () => {
    expect(radixSortSources.map((s) => s.lang)).toEqual(['ts', 'python', 'go', 'rust']);
  });

  it('TC-RADIX-MOD-11 每语言每个 point 行号在源码行数内', () => {
    for (const src of radixSortSources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-RADIX-MOD-12 产出的 point 都能映射行号', () => {
    const points = new Set(buildRadixSortSteps(BASE).map((s) => s.point));
    for (const src of radixSortSources)
      for (const p of points)
        expect(src.lineMap[p as keyof typeof src.lineMap]).toBeTypeOf('number');
  });

  it('TC-RADIX-MOD-13 module 元信息', () => {
    expect(radixSortModule.title).toBe('基数排序');
    expect(radixSortModule.initialInput()).toEqual(BASE);
  });
});
