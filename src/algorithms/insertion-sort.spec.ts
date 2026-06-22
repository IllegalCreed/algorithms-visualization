import { describe, it, expect } from 'vitest';
import { insertionSortSteps } from './insertion-sort';

describe('insertionSortSteps', () => {
  it('TC-INS-ALGO-01 空数组与单元素不产生步骤', () => {
    expect(insertionSortSteps([])).toEqual([]);
    expect(insertionSortSteps([5])).toEqual([]);
  });

  it('TC-INS-ALGO-02 最终数组升序排列', () => {
    const steps = insertionSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    expect(steps.at(-1)!.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-INS-ALGO-03 含重复元素结果正确且不越界', () => {
    expect(insertionSortSteps([3, 1, 3, 2]).at(-1)!.array).toEqual([1, 2, 3, 3]);
  });

  it('TC-INS-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    insertionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-INS-ALGO-05 已升序输入：每轮零移位（最佳情况 O(n)）', () => {
    const steps = insertionSortSteps([1, 2, 3, 4, 5]);
    for (const s of steps) expect(s.shifts).toBe(0);
  });
});
