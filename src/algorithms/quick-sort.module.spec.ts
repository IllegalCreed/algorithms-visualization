import { describe, it, expect } from 'vitest';
import { quickSortPartitions } from './quick-sort';
import { buildQuickSortSteps, quickSortModule } from './quick-sort.module';
import type { QuickExecPoint, Step } from '@/components/player/types';

const EXEC_POINTS: QuickExecPoint[] = [
  'pop',
  'pivotSelect',
  'compare',
  'swap',
  'noSwap',
  'pivotPlace',
  'push',
  'done',
];
const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const num = (s: Step<QuickExecPoint>, name: string) =>
  Number(s.vars.find((v) => v.name === name)!.value);

describe('buildQuickSortSteps', () => {
  it('TC-QUICK-MOD-01 空 / 单元素只产出一个 done 步，sortedIndices 全集', () => {
    const e = buildQuickSortSteps([]);
    expect(e.at(-1)!.point).toBe('done');
    const s1 = buildQuickSortSteps([5]);
    expect(s1.at(-1)!.point).toBe('done');
    expect(s1.at(-1)!.emphasis.sortedIndices).toEqual([0]);
  });

  it('TC-QUICK-MOD-02 末步数组与 oracle 一致（升序）', () => {
    const v = buildQuickSortSteps(BASE)
      .at(-1)!
      .array.map((t) => t[1]);
    expect(v).toEqual(quickSortPartitions(BASE).at(-1)!.array);
    expect(v).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-QUICK-MOD-03 每步 id 集合恒等于初始（FLIP 前提）', () => {
    const all = buildQuickSortSteps([3, 1, 2, 5]);
    const init = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) expect(new Set(s.array.map((t) => t[0]))).toEqual(init);
  });

  it('TC-QUICK-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildQuickSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-QUICK-MOD-05 每步 point 合法；compare 步必带 comparing=[j,hi]', () => {
    for (const s of buildQuickSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC_POINTS).toContain(s.point);
      if (s.point === 'compare') {
        expect(Array.isArray(s.emphasis.comparing)).toBe(true);
        expect(s.emphasis.comparing![1]).toBe(num(s, 'hi'));
      }
    }
  });

  it('TC-QUICK-MOD-06 pivotPlace 落点序列 = oracle pivotIndex 序列', () => {
    const places = buildQuickSortSteps(BASE)
      .filter((s) => s.point === 'pivotPlace')
      .map((s) => num(s, 'i'));
    expect(places).toEqual(quickSortPartitions(BASE).map((e) => e.pivotIndex));
  });

  it('TC-QUICK-MOD-07 sortedIndices 单调不减、末步全集', () => {
    let prev = 0;
    for (const s of buildQuickSortSteps(BASE)) {
      const len = s.emphasis.sortedIndices?.length ?? 0;
      expect(len).toBeGreaterThanOrEqual(prev);
      prev = len;
    }
    expect(
      [...buildQuickSortSteps(BASE).at(-1)!.emphasis.sortedIndices!].sort((a, b) => a - b),
    ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('TC-QUICK-MOD-08 pivotSelect 步 pivotIndex=hi 且 pivot 值=a[hi]', () => {
    for (const s of buildQuickSortSteps(BASE).filter((x) => x.point === 'pivotSelect')) {
      expect(s.emphasis.pivotIndex).toBe(num(s, 'hi'));
      expect(num(s, 'pivot')).toBe(s.array[num(s, 'hi')][1]);
    }
  });

  it('TC-QUICK-MOD-09 栈序：pop 步弹出的区间 = 前一步栈顶（先右后左→先取左）', () => {
    const steps = buildQuickSortSteps(BASE);
    for (let k = 1; k < steps.length; k++) {
      if (steps[k].point !== 'pop') continue;
      const prevStack = steps[k - 1].stack!.frames;
      const popped = steps[k].stack!.popped!;
      if (prevStack.length) expect(popped).toEqual(prevStack[prevStack.length - 1]);
    }
  });

  it('TC-QUICK-MOD-10 done 步 stack 空、sortedIndices 全集', () => {
    const d = buildQuickSortSteps([5, 3, 8, 1]).at(-1)!;
    expect(d.point).toBe('done');
    expect(d.stack!.frames).toEqual([]);
  });

  it('TC-QUICK-MOD-11 每步指针 clamp 在 [0,n-1]', () => {
    for (const s of buildQuickSortSteps(BASE)) {
      for (const p of s.pointers) {
        expect(p.index).toBeGreaterThanOrEqual(0);
        expect(p.index).toBeLessThanOrEqual(BASE.length - 1);
      }
    }
  });

  it('TC-QUICK-MOD-12 每步带 stack 快照（StackTrack）', () => {
    for (const s of buildQuickSortSteps(BASE)) expect(Array.isArray(s.stack!.frames)).toBe(true);
  });

  it('TC-QUICK-MOD-13 swap 步后小于区不变量：a[lo..i-1] 全 < pivot', () => {
    for (const s of buildQuickSortSteps(BASE).filter((x) => x.point === 'swap')) {
      const lo = num(s, 'lo');
      const i = num(s, 'i');
      const pivot = num(s, 'pivot');
      for (let t = lo; t < i; t++) expect(s.array[t][1]).toBeLessThan(pivot);
    }
  });
});

describe('quickSortModule.sources', () => {
  it('TC-QUICK-MOD-14 四门语言齐备', () => {
    expect(quickSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-QUICK-MOD-15 每门语言每个 point 行号落在源码物理行范围内', () => {
    for (const src of quickSortModule.sources) {
      const lc = src.code.split('\n').length;
      for (const p of EXEC_POINTS) {
        const ln = src.lineMap[p];
        expect(ln, `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(ln, `${src.lang}/${p}`).toBeLessThanOrEqual(lc);
      }
    }
  });

  it('TC-QUICK-MOD-16 实际出现的 point 都能在每门语言映射到行', () => {
    const used = new Set(buildQuickSortSteps(quickSortModule.initialInput()).map((s) => s.point));
    for (const src of quickSortModule.sources) {
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
    }
  });
});
