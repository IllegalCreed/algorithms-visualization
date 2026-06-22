import { describe, it, expect } from 'vitest';
import { insertionSortSteps } from './insertion-sort';
import { buildInsertionSortSteps, insertionSortModule } from './insertion-sort.module';
import type { InsertionExecPoint } from '@/components/player/types';

const EXEC_POINTS: InsertionExecPoint[] = ['outerLoop', 'compare', 'shift', 'insert', 'done'];

describe('buildInsertionSortSteps', () => {
  it('TC-INSERTION-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildInsertionSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildInsertionSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-INSERTION-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildInsertionSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = insertionSortSteps(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-INSERTION-MOD-03 每步 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildInsertionSortSteps([3, 1, 2]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-INSERTION-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildInsertionSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-INSERTION-MOD-05 每步 point 合法；shift 步必带数值型 keyIndex', () => {
    for (const s of buildInsertionSortSteps([5, 3, 8, 1])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'shift') expect(typeof s.emphasis.keyIndex).toBe('number');
    }
  });

  it('TC-INSERTION-MOD-06 每个 insert 步后，[0, i] 前缀升序（插入核心不变量）', () => {
    const steps = buildInsertionSortSteps([5, 3, 8, 1, 9, 2]);
    for (const s of steps) {
      if (s.point !== 'insert') continue;
      const i = s.pointers.find((p) => p.id === '0')!.index;
      const prefix = s.array.slice(0, i + 1).map((t) => t[1]);
      const sorted = [...prefix].sort((a, b) => a - b);
      expect(prefix).toEqual(sorted);
    }
  });

  it('TC-INSERTION-MOD-07 一轮内 keyIndex 单调不增（key 只向左滑）', () => {
    const steps = buildInsertionSortSteps([5, 3, 8, 1, 9, 2]);
    let prevKey = Infinity;
    for (const s of steps) {
      if (s.point === 'outerLoop') {
        prevKey = s.emphasis.keyIndex!; // 新一轮起点
        continue;
      }
      if (s.emphasis.keyIndex === undefined) continue;
      expect(s.emphasis.keyIndex).toBeLessThanOrEqual(prevKey);
      prevKey = s.emphasis.keyIndex;
    }
  });

  it('TC-INSERTION-MOD-08 sortedUpTo 单调不减且末步为 n', () => {
    const steps = buildInsertionSortSteps([5, 3, 8, 1, 9]);
    let prev = -1;
    for (const s of steps) {
      const su = s.emphasis.sortedUpTo!;
      expect(su).toBeGreaterThanOrEqual(prev);
      prev = su;
    }
    expect(steps.at(-1)!.emphasis.sortedUpTo).toBe(5);
  });

  it('TC-INSERTION-MOD-09 稳定性：相等元素的原始相对顺序保持不变', () => {
    // [3,1,3,2]：两个 3 的 id 为 '0'、'2'，排序后 '0' 仍在 '2' 之前
    const last = buildInsertionSortSteps([3, 1, 3, 2]).at(-1)!;
    const ids = last.array.map((t) => t[0]);
    const values = last.array.map((t) => t[1]);
    expect(values).toEqual([1, 2, 3, 3]);
    expect(ids.indexOf('0')).toBeLessThan(ids.indexOf('2'));
  });
});

describe('insertionSortModule.sources', () => {
  it('TC-INSERTION-MOD-10 四门语言齐备', () => {
    expect(insertionSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-INSERTION-MOD-11 每门语言每个 InsertionExecPoint 行号落在源码物理行范围内', () => {
    for (const src of insertionSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-INSERTION-MOD-12 实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildInsertionSortSteps(insertionSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of insertionSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
