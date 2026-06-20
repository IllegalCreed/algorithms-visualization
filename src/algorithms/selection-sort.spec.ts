import { describe, it, expect } from 'vitest';
import { selectionSortSteps } from './selection-sort';

describe('selectionSortSteps', () => {
  it('TC-SEL-ALGO-01 空数组与单元素不产生步骤', () => {
    expect(selectionSortSteps([])).toEqual([]);
    expect(selectionSortSteps([5])).toEqual([]);
  });

  it('TC-SEL-ALGO-02 最终数组升序排列', () => {
    const steps = selectionSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    expect(steps.at(-1)!.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SEL-ALGO-03 含重复元素结果正确且不越界', () => {
    expect(selectionSortSteps([3, 1, 3, 2]).at(-1)!.array).toEqual([1, 2, 3, 3]);
  });

  it('TC-SEL-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    selectionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });
});
