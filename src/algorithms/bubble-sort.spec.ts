import { describe, it, expect } from 'vitest';
import { bubbleSortSteps } from './bubble-sort';

describe('bubbleSortSteps', () => {
  it('空数组与单元素不产生步骤', () => {
    expect(bubbleSortSteps([])).toEqual([]);
    expect(bubbleSortSteps([5])).toEqual([]);
  });

  it('最终数组升序排列', () => {
    const steps = bubbleSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    const last = steps[steps.length - 1];
    expect(last.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('每步 compare 是相邻合法下标', () => {
    const steps = bubbleSortSteps([3, 1, 2]);
    for (const s of steps) {
      const [a, b] = s.compare;
      expect(b).toBe(a + 1);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(s.array.length);
    }
  });

  it('已排序数组无任何 swap', () => {
    const steps = bubbleSortSteps([1, 2, 3, 4]);
    expect(steps.every((s) => !s.swapped)).toBe(true);
  });

  it('含重复元素结果正确且稳定地不越界', () => {
    const last = bubbleSortSteps([3, 1, 3, 2])!.at(-1)!;
    expect(last.array).toEqual([1, 2, 3, 3]);
  });

  it('不修改入参', () => {
    const input = [3, 2, 1];
    bubbleSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });
});
