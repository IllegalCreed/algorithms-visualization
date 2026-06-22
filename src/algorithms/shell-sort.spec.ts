import { describe, it, expect } from 'vitest';
import { shellSortPasses } from './shell-sort';

describe('shellSortPasses', () => {
  it('TC-SHELL-ALGO-01 空数组与单元素不产生 pass', () => {
    expect(shellSortPasses([])).toEqual([]);
    expect(shellSortPasses([5])).toEqual([]);
  });

  it('TC-SHELL-ALGO-02 最终 pass 升序排列', () => {
    const passes = shellSortPasses([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    expect(passes.at(-1)!.array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SHELL-ALGO-03 含重复元素结果正确且不越界', () => {
    expect(shellSortPasses([3, 1, 3, 2]).at(-1)!.array).toEqual([1, 2, 3, 3]);
  });

  it('TC-SHELL-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    shellSortPasses(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-SHELL-ALGO-05 gap 序列为 ⌊n/2⌋ 减半到 1', () => {
    expect(shellSortPasses([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]).map((p) => p.gap)).toEqual([5, 2, 1]);
    expect(shellSortPasses([4, 3, 2, 1]).map((p) => p.gap)).toEqual([2, 1]);
  });

  it('TC-SHELL-ALGO-06 已升序输入：最终仍升序、gap 序列不变（幂等正确）', () => {
    const passes = shellSortPasses([1, 2, 3, 4, 5]);
    expect(passes.at(-1)!.array).toEqual([1, 2, 3, 4, 5]);
    expect(passes.map((p) => p.gap)).toEqual([2, 1]);
  });
});
