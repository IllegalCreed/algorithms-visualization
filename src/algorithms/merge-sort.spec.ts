import { describe, it, expect } from 'vitest';
import { mergeSortPasses } from './merge-sort';

const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const lastArr = (input: number[]) => {
  const p = mergeSortPasses(input);
  return p.length ? p[p.length - 1].array : [...input];
};

describe('mergeSortPasses', () => {
  it('TC-MERGE-ALGO-01 空数组与单元素不产生 pass', () => {
    expect(mergeSortPasses([])).toEqual([]);
    expect(mergeSortPasses([5])).toEqual([]);
  });

  it('TC-MERGE-ALGO-02 基准数据最终升序', () => {
    expect(lastArr(BASE)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-MERGE-ALGO-03 含重复元素结果正确', () => {
    expect(lastArr([3, 1, 2, 3, 1])).toEqual([1, 1, 2, 3, 3]);
  });

  it('TC-MERGE-ALGO-04 不修改入参', () => {
    const input = [3, 2, 1];
    mergeSortPasses(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-MERGE-ALGO-05 width 序列为 1,2,4,…（<n）', () => {
    expect(mergeSortPasses(BASE).map((p) => p.width)).toEqual([1, 2, 4, 8]); // n=10
    expect(mergeSortPasses([5, 3, 8, 1]).map((p) => p.width)).toEqual([1, 2]); // n=4
  });

  it('TC-MERGE-ALGO-06 已升序输入幂等（最终仍升序）', () => {
    expect(lastArr([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('TC-MERGE-ALGO-07 逆序输入最终升序', () => {
    expect(lastArr([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it('TC-MERGE-ALGO-08 每趟 width 后每个 2*width 块内部有序（核心不变量）', () => {
    for (const { width, array } of mergeSortPasses(BASE)) {
      const blk = 2 * width;
      for (let lo = 0; lo < array.length; lo += blk) {
        const seg = array.slice(lo, Math.min(lo + blk, array.length));
        expect(seg).toEqual([...seg].sort((a, b) => a - b));
      }
    }
  });

  it('TC-MERGE-ALGO-09 随机用例与 Array.sort 交叉校验', () => {
    const cases = [[2], [], [9, 9, 9], [4, 1, 4, 1, 5, 9, 2, 6], [10, -3, 0, 7, 7, -3]];
    for (const c of cases) {
      expect(lastArr(c)).toEqual([...c].sort((a, b) => a - b));
    }
  });
});
