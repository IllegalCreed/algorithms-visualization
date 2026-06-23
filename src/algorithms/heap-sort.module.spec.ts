import { describe, it, expect } from 'vitest';
import { heapSortTrace, isMaxHeap } from './heap-sort';
import { buildHeapSortSteps, heapSortModule } from './heap-sort.module';
import type { HeapExecPoint, Step } from '@/components/player/types';

const EXEC: HeapExecPoint[] = ['heapify', 'compare', 'swap', 'settle', 'extract', 'done'];
const BASE = [7, 6, 5, 10, 9, 8, 4, 3, 2, 1];
const val = (s: Step<HeapExecPoint>) => s.array.map((t) => t[1]);

describe('buildHeapSortSteps', () => {
  it('TC-HEAP-MOD-01 空 / 单元素只产出 done、sortedFrom=0', () => {
    expect(buildHeapSortSteps([]).at(-1)!.point).toBe('done');
    const s1 = buildHeapSortSteps([5]).at(-1)!;
    expect(s1.point).toBe('done');
    expect(s1.emphasis.sortedFrom).toBe(0);
  });

  it('TC-HEAP-MOD-02 末步升序 = oracle result', () => {
    expect(val(buildHeapSortSteps(BASE).at(-1)!)).toEqual(heapSortTrace(BASE).result);
    expect(val(buildHeapSortSteps(BASE).at(-1)!)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-HEAP-MOD-03 每步 id 集合恒等于初始（FLIP）', () => {
    const all = buildHeapSortSteps([3, 1, 2, 5]);
    const init = new Set(all[0].array.map((t) => t[0]));
    for (const s of all) expect(new Set(s.array.map((t) => t[0]))).toEqual(init);
  });

  it('TC-HEAP-MOD-04 不修改入参', () => {
    const input = [3, 2, 1];
    buildHeapSortSteps(input);
    expect(input).toEqual([3, 2, 1]);
  });

  it('TC-HEAP-MOD-05 每步 point 合法；compare 带 comparing', () => {
    for (const s of buildHeapSortSteps([5, 3, 8, 1, 9, 2])) {
      expect(EXEC).toContain(s.point);
      if (s.point === 'compare') expect(Array.isArray(s.emphasis.comparing)).toBe(true);
    }
  });

  it('TC-HEAP-MOD-06 建堆阶段末步 = oracle built 且为大顶堆', () => {
    const steps = buildHeapSortSteps(BASE);
    const idx = steps.findIndex((s) => s.point === 'extract'); // 首个 extract 前一步=建堆完成
    const built = val(steps[idx - 1]);
    expect(built).toEqual(heapSortTrace(BASE).built);
    expect(isMaxHeap(built)).toBe(true);
  });

  it('TC-HEAP-MOD-07 extract 步 sortedFrom = tree.heapSize 且单调递减', () => {
    let prev = Infinity;
    for (const s of buildHeapSortSteps(BASE).filter((x) => x.point === 'extract')) {
      expect(s.emphasis.sortedFrom).toBe(s.tree!.heapSize);
      expect(s.emphasis.sortedFrom!).toBeLessThan(prev);
      prev = s.emphasis.sortedFrom!;
    }
  });

  it('TC-HEAP-MOD-08 extract 堆顶取出序列 = [10,9,8,7,6,5,4,3,2]', () => {
    const tops = buildHeapSortSteps(BASE)
      .filter((s) => s.point === 'extract')
      .map((s) => s.array[s.tree!.heapSize][1]); // 换到 end=heapSize 的最大值
    expect(tops).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2]);
  });

  it('TC-HEAP-MOD-09 heapify 步 heapNode 为数字（建堆活动节点）', () => {
    for (const s of buildHeapSortSteps(BASE).filter((x) => x.point === 'heapify'))
      expect(typeof s.emphasis.heapNode).toBe('number');
  });

  it('TC-HEAP-MOD-10 done 步 sortedFrom=0、tree.heapSize=0', () => {
    const d = buildHeapSortSteps([5, 3, 8, 1]).at(-1)!;
    expect(d.emphasis.sortedFrom).toBe(0);
    expect(d.tree!.heapSize).toBe(0);
  });

  it('TC-HEAP-MOD-11 每步带 tree 快照', () => {
    for (const s of buildHeapSortSteps(BASE)) expect(typeof s.tree!.heapSize).toBe('number');
  });

  it('TC-HEAP-MOD-12 堆用节点高亮、无指针箭头', () => {
    for (const s of buildHeapSortSteps(BASE)) expect(s.pointers).toEqual([]);
  });
});

describe('heapSortModule.sources', () => {
  it('TC-HEAP-MOD-13 四门语言齐备', () => {
    expect(heapSortModule.sources.map((s) => s.lang).sort()).toEqual(
      ['go', 'python', 'rust', 'ts'].sort(),
    );
  });

  it('TC-HEAP-MOD-14 每门语言每个 point 行号在源码行范围内', () => {
    for (const src of heapSortModule.sources) {
      const lc = src.code.split('\n').length;
      for (const p of EXEC) {
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeGreaterThanOrEqual(1);
        expect(src.lineMap[p], `${src.lang}/${p}`).toBeLessThanOrEqual(lc);
      }
    }
  });

  it('TC-HEAP-MOD-15 实际出现的 point 都能映射到行', () => {
    const used = new Set(buildHeapSortSteps(heapSortModule.initialInput()).map((s) => s.point));
    for (const src of heapSortModule.sources)
      for (const p of used) expect(typeof src.lineMap[p]).toBe('number');
  });
});
