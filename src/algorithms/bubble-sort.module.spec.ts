// src/algorithms/bubble-sort.module.spec.ts
import { describe, it, expect } from 'vitest';
import { bubbleSortSteps } from './bubble-sort';
import { buildBubbleSortSteps, bubbleSortModule } from './bubble-sort.module';
import type { ExecPoint } from '@/components/player/types';

const EXEC_POINTS: ExecPoint[] = ['outerLoop', 'innerLoop', 'compare', 'swap', 'noSwap', 'done'];

describe('buildBubbleSortSteps', () => {
  it('空数组/单元素也产出至少一个 done 步（播放器不能空）', () => {
    expect(buildBubbleSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildBubbleSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('末步数组与 oracle 最终结果一致（交叉校验）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildBubbleSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = bubbleSortSteps(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('稳定 key：每个步 array 的 id 集合恒等于初始 id 集合（FLIP 前提）', () => {
    const input = [3, 1, 2];
    const all = buildBubbleSortSteps(input);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('不修改入参', () => {
    const input = [3, 2, 1];
    buildBubbleSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('每个步的 point 合法，且 swap 步 emphasis.swapped 为真', () => {
    for (const s of buildBubbleSortSteps([3, 1, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'swap') expect(s.emphasis.swapped).toBe(true);
      if (s.point === 'noSwap') expect(s.emphasis.swapped).toBe(false);
    }
  });

  it('变量面板 j / a[j] / a[j+1] 对应内层循环计数器与被比较的两元素（不错位一格）', () => {
    const steps = buildBubbleSortSteps([5, 3, 8]);
    const firstCompare = steps.find((s) => s.point === 'compare')!;
    const val = (name: string) => firstCompare.vars.find((r) => r.name === name)!.value;
    expect(val('j')).toBe(0); // 内层循环计数器（红箭头位置）
    expect(val('a[j]')).toBe(5); // work[0]
    expect(val('a[j+1]')).toBe(3); // work[1]，与 caption "5 > 3" 一致
  });
});

describe('bubbleSortModule.sources', () => {
  it('四门语言齐备', () => {
    expect(bubbleSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('每门语言的每个 ExecPoint 行号都落在源码物理行范围内', () => {
    for (const src of bubbleSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildBubbleSortSteps(bubbleSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of bubbleSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
