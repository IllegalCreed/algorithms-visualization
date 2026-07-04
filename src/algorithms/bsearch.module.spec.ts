// src/algorithms/bsearch.module.spec.ts —— 二分查找 module 对拍 oracle（C-091）
import { describe, it, expect } from 'vitest';
import { buildBsearchSteps, bsearchModule } from './bsearch.module';
import { BS_ARRAY, BS_HIT, BS_MISS, linearFind, bsearchTrace } from './bsearch';
import { bsearchSources } from './bsearch.sources';

const POINTS = new Set(['init', 'mid', 'cut', 'found', 'empty', 'done']);
const range = (a: number, b: number) => {
  const r: number[] = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
};

describe('bsearch.module', () => {
  const steps = buildBsearchSteps(BS_ARRAY);
  const last = steps[steps.length - 1];

  it('TC-BS-MOD-01 命中对拍：17 → 下标 8 = 线性扫；三次探测', () => {
    const tr = bsearchTrace(BS_ARRAY, BS_HIT);
    expect(tr.found).toBe(true);
    expect(tr.index).toBe(8);
    expect(tr.index).toBe(linearFind(BS_ARRAY, BS_HIT));
    expect(tr.probes.map((p) => [p.lo, p.hi, p.mid])).toEqual([
      [0, 9, 4],
      [5, 9, 7],
      [8, 9, 8],
    ]);
  });

  it('TC-BS-MOD-02 未命中对拍：4 → −1 = 线性扫；区间清空 lo=2>hi=1', () => {
    const tr = bsearchTrace(BS_ARRAY, BS_MISS);
    expect(tr.found).toBe(false);
    expect(tr.index).toBe(-1);
    expect(tr.index).toBe(linearFind(BS_ARRAY, BS_MISS));
    expect(tr.probes.map((p) => [p.lo, p.hi, p.mid, p.cmp])).toEqual([
      [0, 9, 4, '>'],
      [0, 3, 1, '<'],
      [2, 3, 2, '>'],
    ]);
    expect(tr.finalLo).toBe(2);
    expect(tr.finalHi).toBe(1);
  });

  it('TC-BS-MOD-03 步合法：执行点 + 10 柱升序恒序', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.array).toHaveLength(10);
      expect(s.array.map((a) => a[1])).toEqual(BS_ARRAY);
    }
  });

  it('TC-BS-MOD-04 步数结构：16 步 point 序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'mid',
      'cut',
      'mid',
      'cut',
      'mid',
      'found',
      'init',
      'mid',
      'cut',
      'mid',
      'cut',
      'mid',
      'cut',
      'empty',
      'done',
    ]);
  });

  it('TC-BS-MOD-05 init 步：lo/hi 指针 + 全区间', () => {
    const init = steps[0];
    expect(init.pointers).toEqual([
      { id: '0', index: 0 },
      { id: '2', index: 9 },
    ]);
    expect(init.emphasis.groupMembers).toEqual(range(0, 9));
  });

  it('TC-BS-MOD-06 mid 步：pivotIndex + 蓝指针依次 4,7,8 / 4,1,2', () => {
    const mids = steps.filter((s) => s.point === 'mid');
    expect(mids.map((s) => s.emphasis.pivotIndex)).toEqual([4, 7, 8, 4, 1, 2]);
    for (const s of mids) {
      const midPtr = s.pointers.find((p) => p.id === '1')!;
      expect(midPtr.index).toBe(s.emphasis.pivotIndex);
    }
  });

  it('TC-BS-MOD-07 cut 步：候选区间依次收缩至清空', () => {
    const cuts = steps.filter((s) => s.point === 'cut');
    expect(cuts.map((s) => s.emphasis.groupMembers)).toEqual([
      range(5, 9),
      range(8, 9),
      range(0, 3),
      range(2, 3),
      [],
    ]);
  });

  it('TC-BS-MOD-08 found 步：sortedIndices=[8] + caption 命中下标 8', () => {
    const found = steps.find((s) => s.point === 'found')!;
    expect(found.emphasis.sortedIndices).toEqual([8]);
    expect(found.caption).toContain('命中');
    expect(found.caption).toContain('8');
  });

  it('TC-BS-MOD-09 empty 步：caption 含 −1 与不存在', () => {
    const empty = steps.find((s) => s.point === 'empty')!;
    expect(empty.caption).toContain('-1');
    expect(empty.caption).toContain('不存在');
  });

  it('TC-BS-MOD-10 done caption 含 O(log n)', () => {
    expect(last.point).toBe('done');
    expect(last.caption).toContain('O(log n)');
  });

  it('TC-BS-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(bsearchSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of bsearchSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['cut', 'done', 'empty', 'found', 'init', 'mid'].sort(),
      );
    }
  });

  it('TC-BS-MOD-12 元信息：title 含二分查找；initialInput 升序', () => {
    expect(bsearchModule.title).toContain('二分查找');
    expect(bsearchModule.initialInput()).toEqual(BS_ARRAY);
    const inp = bsearchModule.initialInput();
    for (let i = 1; i < inp.length; i++) expect(inp[i]).toBeGreaterThan(inp[i - 1]);
  });
});
