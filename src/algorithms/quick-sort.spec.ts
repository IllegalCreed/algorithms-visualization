import { describe, it, expect } from 'vitest';
import { quickSortPartitions } from './quick-sort';

const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];

describe('quickSortPartitions', () => {
  it('TC-QUICK-ALGO-01 末事件数组严格升序且与内置 sort 一致', () => {
    const ev = quickSortPartitions(BASE);
    expect(ev.at(-1)!.array).toEqual([...BASE].sort((a, b) => a - b));
  });

  it('TC-QUICK-ALGO-02 不修改入参', () => {
    const input = [3, 2, 1];
    quickSortPartitions(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-QUICK-ALGO-03 空 / 单元素返回空事件序列', () => {
    expect(quickSortPartitions([])).toEqual([]);
    expect(quickSortPartitions([5])).toEqual([]);
  });

  it('TC-QUICK-ALGO-04 BASE 的 pivot 落点序列 = [0,6,1,5,2,4,9,7]', () => {
    expect(quickSortPartitions(BASE).map((e) => e.pivotIndex)).toEqual([0, 6, 1, 5, 2, 4, 9, 7]);
  });

  it('TC-QUICK-ALGO-05 每次 partition 落点钉死最终位置', () => {
    const sorted = [...BASE].sort((a, b) => a - b);
    for (const e of quickSortPartitions(BASE)) {
      expect(e.array[e.pivotIndex]).toBe(sorted[e.pivotIndex]);
    }
  });

  it('TC-QUICK-ALGO-06 含重复 / 已序 / 逆序也正确升序', () => {
    for (const inp of [
      [2, 2, 1, 1, 3],
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
    ]) {
      const ev = quickSortPartitions(inp);
      const last = ev.length ? ev.at(-1)!.array : inp;
      expect(last).toEqual([...inp].sort((a, b) => a - b));
    }
  });
});
