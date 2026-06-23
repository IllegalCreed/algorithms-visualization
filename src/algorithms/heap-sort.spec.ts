import { describe, it, expect } from 'vitest';
import { heapSortTrace, isMaxHeap } from './heap-sort';

const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];

describe('heapSortTrace', () => {
  it('TC-HEAP-ALGO-01 result 升序且与内置 sort 一致', () => {
    expect(heapSortTrace(BASE).result).toEqual([...BASE].sort((a, b) => a - b));
  });

  it('TC-HEAP-ALGO-02 built 是大顶堆', () => {
    expect(isMaxHeap(heapSortTrace(BASE).built)).toBe(true);
  });

  it('TC-HEAP-ALGO-03 BASE 建堆后 = [10,9,8,6,7,5,4,3,2,1]', () => {
    expect(heapSortTrace(BASE).built).toEqual([10, 9, 8, 6, 7, 5, 4, 3, 2, 1]);
  });

  it('TC-HEAP-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    heapSortTrace(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-HEAP-ALGO-05 空 / 单元素 result 原样', () => {
    expect(heapSortTrace([]).result).toEqual([]);
    expect(heapSortTrace([5]).result).toEqual([5]);
  });

  it('TC-HEAP-ALGO-06 含重复 / 已序 / 逆序均升序', () => {
    for (const inp of [
      [2, 2, 1, 1, 3],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
    ]) {
      expect(heapSortTrace(inp).result).toEqual([...inp].sort((a, b) => a - b));
    }
  });

  it('TC-HEAP-ALGO-07 isMaxHeap 能识别非堆', () => {
    expect(isMaxHeap([1, 2, 3])).toBe(false);
    expect(isMaxHeap([3, 2, 1])).toBe(true);
  });
});
