import { describe, it, expect } from 'vitest';
import { shellSortPasses } from './shell-sort';
import { buildShellSortSteps, shellSortModule } from './shell-sort.module';
import type { ShellExecPoint, Step } from '@/components/player/types';

const EXEC_POINTS: ShellExecPoint[] = [
  'gapChange',
  'groupStart',
  'outerLoop',
  'compare',
  'shift',
  'insert',
  'done',
];

const num = (s: Step<ShellExecPoint>, name: string) =>
  Number(s.vars.find((v) => v.name === name)!.value);

describe('buildShellSortSteps', () => {
  it('TC-SHELL-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildShellSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildShellSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-SHELL-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const last = buildShellSortSteps(input).at(-1)!;
    const values = last.array.map((t) => t[1]);
    const oracle = shellSortPasses(input).at(-1)!.array;
    expect(values).toEqual(oracle);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-SHELL-MOD-03 每步 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildShellSortSteps([3, 1, 2]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-SHELL-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildShellSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-SHELL-MOD-05 每步 point 合法；shift 步必带数值型 keyIndex', () => {
    for (const s of buildShellSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'shift') expect(typeof s.emphasis.keyIndex).toBe('number');
    }
  });

  it('TC-SHELL-MOD-06 gapChange 步的 gap 依次为 ⌊n/2⌋ 减半到 1', () => {
    const steps = buildShellSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]); // n=10
    const gaps = steps.filter((s) => s.point === 'gapChange').map((s) => num(s, 'gap'));
    expect(gaps).toEqual([5, 2, 1]);
  });

  it('TC-SHELL-MOD-07 各 gap-pass 边界数组与 oracle 快照一致', () => {
    const input = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
    const steps = buildShellSortSteps(input);
    const passes = shellSortPasses(input);
    const gapChanges = steps.filter((s) => s.point === 'gapChange');
    // 第 k 个 gapChange（k≥1）的 array = 第 k-1 个 pass 完成态；done = 最后一个 pass
    for (let k = 1; k < gapChanges.length; k++) {
      expect(gapChanges[k].array.map((t) => t[1])).toEqual(passes[k - 1].array);
    }
    expect(steps.at(-1)!.array.map((t) => t[1])).toEqual(passes.at(-1)!.array);
  });

  it('TC-SHELL-MOD-08 每个 groupStart 的 groupMembers = 该 gap 下的子序列下标', () => {
    const n = 10;
    const steps = buildShellSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    for (const s of steps.filter((x) => x.point === 'groupStart')) {
      const gap = num(s, 'gap');
      const start = num(s, 'group');
      const expected: number[] = [];
      for (let k = start; k < n; k += gap) expected.push(k);
      expect([...s.emphasis.groupMembers!]).toEqual(expected);
    }
  });

  it('TC-SHELL-MOD-09 一轮内 keyIndex 单调不增（key 只向左跳）', () => {
    const steps = buildShellSortSteps([7, 6, 5, 10, 9, 8, 4, 3, 2, 1]);
    let prev = Infinity;
    for (const s of steps) {
      if (s.point === 'outerLoop') {
        prev = s.emphasis.keyIndex!; // 新一轮起点
        continue;
      }
      if (s.point === 'gapChange' || s.point === 'groupStart' || s.point === 'done') {
        prev = Infinity; // 轮间重置
        continue;
      }
      if (s.emphasis.keyIndex === undefined) continue;
      expect(s.emphasis.keyIndex).toBeLessThanOrEqual(prev);
      prev = s.emphasis.keyIndex;
    }
  });

  it('TC-SHELL-MOD-10 done 步标 sortedFrom=0（全部有序）', () => {
    const done = buildShellSortSteps([5, 3, 8, 1, 9, 2]).at(-1)!;
    expect(done.point).toBe('done');
    expect(done.emphasis.sortedFrom).toBe(0);
  });
});

describe('shellSortModule.sources', () => {
  it('TC-SHELL-MOD-11 四门语言齐备', () => {
    expect(shellSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-SHELL-MOD-12 每门语言每个 ShellExecPoint 行号落在源码物理行范围内', () => {
    for (const src of shellSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-SHELL-MOD-13 实际出现在步骤里的 point 都能在每门语言映射到行', () => {
    const usedPoints = new Set(
      buildShellSortSteps(shellSortModule.initialInput()).map((s) => s.point),
    );
    for (const src of shellSortModule.sources) {
      for (const p of usedPoints) {
        expect(typeof src.lineMap[p]).toBe('number');
      }
    }
  });
});
