import { describe, it, expect } from 'vitest';
import { selectionSortSteps } from './selection-sort';
import { buildSelectionSortSteps, selectionSortModule } from './selection-sort.module';
import type { SelectionExecPoint } from '@/components/player/types';

const EXEC_POINTS: SelectionExecPoint[] = [
  'outerLoop',
  'innerLoop',
  'compare',
  'newMin',
  'swap',
  'noSwap',
  'done',
];

describe('buildSelectionSortSteps', () => {
  it('TC-SELECTION-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildSelectionSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildSelectionSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-SELECTION-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildSelectionSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = selectionSortSteps(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SELECTION-MOD-03 每步 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildSelectionSortSteps([3, 1, 2]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-SELECTION-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildSelectionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-SELECTION-MOD-05 每步 point 合法；swap 步 swapped 为真、noSwap 步不交换', () => {
    // [1,3,2]：i=0 时 1 已最小→noSwap，i=1 时→swap，同时覆盖两分支
    for (const s of buildSelectionSortSteps([1, 3, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'swap') expect(s.emphasis.swapped).toBe(true);
      if (s.point === 'noSwap') expect(s.emphasis.swapped).toBeFalsy();
    }
  });

  it('TC-SELECTION-MOD-06 newMin 步 min 指针落在 emphasis.minIndex 上', () => {
    const newMins = buildSelectionSortSteps([5, 3, 8, 1]).filter((s) => s.point === 'newMin');
    expect(newMins.length).toBeGreaterThan(0);
    for (const s of newMins) {
      const minIdx = s.emphasis.minIndex!;
      const minPointer = s.pointers.find((p) => p.id === '2')!;
      expect(minPointer.index).toBe(minIdx);
    }
  });

  it('TC-SELECTION-MOD-07 每轮结束后 i 位置即 [i,n) 最小（选择核心不变量）', () => {
    for (const s of buildSelectionSortSteps([5, 3, 8, 1, 9, 2])) {
      if (s.point !== 'swap' && s.point !== 'noSwap') continue;
      const i = s.pointers.find((p) => p.id === '0')!.index;
      const vals = s.array.map((t) => t[1]);
      expect(vals[i]).toBe(Math.min(...vals.slice(i)));
    }
  });

  it('TC-SELECTION-MOD-08 sortedUpTo 单调不减且末步为 n', () => {
    const steps = buildSelectionSortSteps([5, 3, 8, 1, 9]);
    let prev = -1;
    for (const s of steps) {
      const su = s.emphasis.sortedUpTo!;
      expect(su).toBeGreaterThanOrEqual(prev);
      prev = su;
    }
    expect(steps.at(-1)!.emphasis.sortedUpTo).toBe(5);
  });

  it('TC-SELECTION-MOD-09 交换次数 ≤ n-1', () => {
    const input = [5, 3, 8, 1, 9, 2];
    const swaps = buildSelectionSortSteps(input).filter((s) => s.point === 'swap').length;
    expect(swaps).toBeLessThanOrEqual(input.length - 1);
  });
});

describe('selectionSortModule.sources', () => {
  it('TC-SELECTION-MOD-10 四门语言齐备', () => {
    expect(selectionSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-SELECTION-MOD-11 每门语言每个 SelectionExecPoint 行号落在源码物理行范围内', () => {
    for (const src of selectionSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-SELECTION-MOD-12 实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildSelectionSortSteps(selectionSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of selectionSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
