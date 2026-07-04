// src/algorithms/suffixarray.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildSuffixArraySteps, suffixArrayModule } from './suffixarray.module';
import { suffixArray, SA_STR } from './suffixarray';
import type { SuffixArrayExecPoint, Step } from '@/components/player/types';

const steps = () => buildSuffixArraySteps();
const last = (ss: Step<SuffixArrayExecPoint>[]) => ss[ss.length - 1];
const N = SA_STR.length;

describe('suffixarray.module', () => {
  it('TC-SA-MOD-01 末步 done + sa = suffixArray()', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.suffixArray!.done).toBe(true);
    expect(l.suffixArray!.order).toEqual(suffixArray());
    expect(suffixArray()).toEqual([5, 3, 1, 0, 4, 2]);
  });

  it('TC-SA-MOD-02 每步执行点合法且带后缀轨（array 空）', () => {
    const ok = new Set<SuffixArrayExecPoint>(['init', 'sort', 'rank', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.suffixArray).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-SA-MOD-03 原串不变 banana', () => {
    for (const s of steps()) expect(s.suffixArray!.s).toBe('banana');
  });

  it('TC-SA-MOD-04 终态字典序（相邻后缀升序）', () => {
    const order = last(steps()).suffixArray!.order;
    for (let i = 1; i < order.length; i++) {
      expect(SA_STR.slice(order[i - 1]) <= SA_STR.slice(order[i])).toBe(true);
    }
  });

  it('TC-SA-MOD-05 order 恒为 0..n-1 的排列', () => {
    for (const s of steps()) {
      const o = s.suffixArray!.order;
      expect([...o].sort((a, b) => a - b)).toEqual([...Array(N).keys()]);
    }
  });

  it('TC-SA-MOD-06 rank 值域合法；末步 rank 全不同', () => {
    for (const s of steps()) {
      for (const r of s.suffixArray!.rank) {
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThanOrEqual(N - 1);
      }
    }
    const lastRank = last(steps()).suffixArray!.rank;
    expect(new Set(lastRank).size).toBe(N); // 全不同
  });

  it('TC-SA-MOD-07 rank 步之间 k 依次翻倍 1,2,…', () => {
    const ks = steps()
      .filter((s) => s.point === 'rank')
      .map((s) => s.suffixArray!.k);
    // 每个 rank 步记录的是「本轮排序用的 k」，应为 1,2,4,...
    for (let i = 0; i < ks.length; i++) expect(ks[i]).toBe(1 << i);
  });

  it('TC-SA-MOD-08 sort 步 phase=sort；rank 步 phase=rank', () => {
    for (const s of steps().filter((x) => x.point === 'sort'))
      expect(s.suffixArray!.phase).toBe('sort');
    for (const s of steps().filter((x) => x.point === 'rank'))
      expect(s.suffixArray!.phase).toBe('rank');
  });

  it('TC-SA-MOD-09 收敛即止（末步 k ≤ n）', () => {
    expect(last(steps()).suffixArray!.k).toBeLessThanOrEqual(N);
  });

  it('TC-SA-MOD-10 vars 展示原串/sa', () => {
    const text = steps()
      .flatMap((s) => s.vars.map((v) => `${v.name}${v.value}`))
      .join(' ');
    expect(text).toContain('banana');
  });

  it('TC-SA-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = suffixArrayModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of suffixArrayModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-SA-MOD-12 module 元信息', () => {
    expect(suffixArrayModule.title).toMatch(/后缀数组/);
    expect(suffixArrayModule.initialInput()).toEqual([]);
  });
});
