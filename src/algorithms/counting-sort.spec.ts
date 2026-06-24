import { describe, it, expect } from 'vitest';
import { countingSortTrace } from './counting-sort';

const BASE = [3, 1, 4, 1, 6, 2, 3, 6, 4, 1];

describe('countingSortTrace', () => {
  it('TC-COUNT-ALGO-01 result 升序且与内置 sort 一致', () => {
    expect(countingSortTrace(BASE).result).toEqual([...BASE].sort((a, b) => a - b));
  });
  it('TC-COUNT-ALGO-02 counts/min/max 正确（含空桶=0）', () => {
    const t = countingSortTrace(BASE);
    expect(t.min).toBe(1);
    expect(t.max).toBe(6);
    expect(t.counts).toEqual([3, 1, 2, 2, 0, 2]);
  });
  it('TC-COUNT-ALGO-03 sum(counts) = n', () => {
    const t = countingSortTrace(BASE);
    expect(t.counts.reduce((a, b) => a + b, 0)).toBe(BASE.length);
  });
  it('TC-COUNT-ALGO-04 由 counts 按值域展开可重建 result', () => {
    const t = countingSortTrace(BASE);
    const rebuilt = t.counts.flatMap((c, b) => Array(c).fill(b + t.min));
    expect(rebuilt).toEqual(t.result);
  });
  it('TC-COUNT-ALGO-05 不修改入参', () => {
    const input = [3, 1, 2];
    countingSortTrace(input);
    expect(input).toEqual([3, 1, 2]);
  });
  it('TC-COUNT-ALGO-06 空 / 单元素', () => {
    expect(countingSortTrace([]).result).toEqual([]);
    expect(countingSortTrace([]).counts).toEqual([]);
    expect(countingSortTrace([5]).result).toEqual([5]);
    expect(countingSortTrace([5]).counts).toEqual([1]);
  });
  it('TC-COUNT-ALGO-07 重复 / 已序 / 逆序 / 全等值均升序', () => {
    for (const inp of [
      [2, 2, 1, 1, 3],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
      [4, 4, 4, 4],
    ])
      expect(countingSortTrace(inp).result).toEqual([...inp].sort((a, b) => a - b));
  });
});
