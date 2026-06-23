import { describe, it, expect } from 'vitest';
import { mergeSortPasses } from './merge-sort';
import { buildMergeSortSteps, mergeSortModule } from './merge-sort.module';
import type { MergeExecPoint, Step } from '@/components/player/types';

const EXEC_POINTS: MergeExecPoint[] = [
  'widthChange',
  'mergeStart',
  'compare',
  'takeLeft',
  'takeRight',
  'drainLeft',
  'drainRight',
  'writeBack',
  'done',
];
const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const num = (s: Step<MergeExecPoint>, name: string) =>
  Number(s.vars.find((v) => v.name === name)!.value);

describe('buildMergeSortSteps', () => {
  it('TC-MERGE-MOD-01 空/单元素也产出至少一个 done 步', () => {
    expect(buildMergeSortSteps([]).at(-1)!.point).toBe('done');
    expect(buildMergeSortSteps([5]).at(-1)!.point).toBe('done');
  });

  it('TC-MERGE-MOD-02 末步数组与 oracle 最终结果一致（交叉校验，升序）', () => {
    const values = buildMergeSortSteps(BASE)
      .at(-1)!
      .array.map((t) => t[1]);
    expect(values).toEqual(mergeSortPasses(BASE).at(-1)!.array);
    expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-MERGE-MOD-03 每步主轨 array 的 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildMergeSortSteps([3, 1, 2, 5]);
    const initIds = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) {
      expect(new Set(s.array.map((t) => t[0]))).toEqual(initIds);
    }
  });

  it('TC-MERGE-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildMergeSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-MERGE-MOD-05 每步 point 合法；compare 步必带 comparing', () => {
    for (const s of buildMergeSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'compare') expect(Array.isArray(s.emphasis.comparing)).toBe(true);
    }
  });

  it('TC-MERGE-MOD-06 widthChange 步的 width 依次为 1,2,4,…', () => {
    const widths = buildMergeSortSteps(BASE)
      .filter((s) => s.point === 'widthChange')
      .map((s) => num(s, 'width'));
    expect(widths).toEqual([1, 2, 4, 8]); // n=10
  });

  it('TC-MERGE-MOD-07 各 width 趟边界数组与 oracle 快照一致', () => {
    const steps = buildMergeSortSteps(BASE);
    const passes = mergeSortPasses(BASE);
    const wc = steps.filter((s) => s.point === 'widthChange');
    for (let k = 1; k < wc.length; k++) {
      expect(wc[k].array.map((t) => t[1])).toEqual(passes[k - 1].array);
    }
    expect(steps.at(-1)!.array.map((t) => t[1])).toEqual(passes.at(-1)!.array);
  });

  it('TC-MERGE-MOD-08 每个 mergeStart 的 groupMembers/activeRange = [lo,hi)', () => {
    for (const s of buildMergeSortSteps(BASE).filter((x) => x.point === 'mergeStart')) {
      const lo = num(s, 'lo');
      const hi = num(s, 'hi');
      const expected: number[] = [];
      for (let m = lo; m < hi; m++) expected.push(m);
      expect(s.emphasis.groupMembers).toEqual(expected);
      expect(s.aux!.activeRange).toEqual([lo, hi]);
    }
  });

  it('TC-MERGE-MOD-09 一对合并内 aux.filled 单调增长（temp 只填不删）', () => {
    let prevLen = -1;
    for (const s of buildMergeSortSteps(BASE)) {
      if (s.point === 'mergeStart') {
        expect(s.aux!.filled).toEqual([]);
        prevLen = 0;
        continue;
      }
      if (s.point === 'widthChange' || s.point === 'done') {
        prevLen = -1;
        continue;
      }
      if (!s.aux || prevLen < 0) continue;
      expect(s.aux.filled.length).toBeGreaterThanOrEqual(prevLen);
      prevLen = s.aux.filled.length;
    }
  });

  it('TC-MERGE-MOD-10 writeBack 后主轨 [lo,hi) 段升序', () => {
    for (const s of buildMergeSortSteps(BASE).filter((x) => x.point === 'writeBack')) {
      const lo = num(s, 'lo');
      const hi = num(s, 'hi');
      const seg = s.array.slice(lo, hi).map((t) => t[1]);
      expect(seg).toEqual([...seg].sort((a, b) => a - b));
    }
  });

  it('TC-MERGE-MOD-11 done 步标 sortedFrom=0、aux 无 filled', () => {
    const done = buildMergeSortSteps([5, 3, 8, 1]).at(-1)!;
    expect(done.point).toBe('done');
    expect(done.emphasis.sortedFrom).toBe(0);
    expect(done.aux!.filled).toEqual([]);
  });

  it('TC-MERGE-MOD-12 take 步 temp 写入位的值 = 所取元素值', () => {
    for (const s of buildMergeSortSteps(BASE)) {
      if (s.point !== 'takeLeft' && s.point !== 'takeRight') continue;
      const k = s.aux!.pointer! - 1; // pointer 是写入后的 k+1
      const written = s.aux!.array[k][1];
      const ai = num(s, 'a[i]');
      const aj = num(s, 'a[j]');
      expect(written).toBe(s.point === 'takeLeft' ? ai : aj);
    }
  });

  it('TC-MERGE-MOD-13 每步主轨指针 clamp 在 [0,n-1]、aux.pointer 在 [0,n]', () => {
    for (const s of buildMergeSortSteps(BASE)) {
      for (const p of s.pointers) {
        expect(p.index).toBeGreaterThanOrEqual(0);
        expect(p.index).toBeLessThanOrEqual(BASE.length - 1);
      }
      if (s.aux?.pointer !== undefined) {
        expect(s.aux.pointer).toBeGreaterThanOrEqual(0);
        expect(s.aux.pointer).toBeLessThanOrEqual(BASE.length);
      }
    }
  });

  it('TC-MERGE-MOD-14 每步 aux.array 长度 = 主轨长度', () => {
    for (const s of buildMergeSortSteps(BASE)) {
      expect(s.aux!.array).toHaveLength(BASE.length);
    }
  });
});

describe('mergeSortModule.sources', () => {
  it('TC-MERGE-MOD-15 四门语言齐备', () => {
    expect(mergeSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-MERGE-MOD-16 每门语言每个 MergeExecPoint 行号落在源码物理行范围内', () => {
    for (const src of mergeSortModule.sources) {
      const lineCount = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const line = src.lineMap[p];
        expect(line, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(line, `${src.lang}/${p}`).toBeLessThanOrEqual(lineCount);
      }
    }
  });

  it('TC-MERGE-MOD-17 实际出现的 point 都能在每门语言映射到行', () => {
    const used = new Set(buildMergeSortSteps(mergeSortModule.initialInput()).map((s) => s.point));
    for (const src of mergeSortModule.sources) {
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
    }
  });
});
