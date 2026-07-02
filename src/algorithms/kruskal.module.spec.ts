// src/algorithms/kruskal.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildKruskalSteps, kruskalModule } from './kruskal.module';
import { kruskalTrace } from './kruskal';
import type { KruskalExecPoint, Step } from '@/components/player/types';

const steps = () => buildKruskalSteps();
const cnt = (ss: Step<KruskalExecPoint>[], p: KruskalExecPoint) =>
  ss.filter((s) => s.point === p).length;
const mstKeys = (s: Step<KruskalExecPoint>) =>
  Object.entries(s.graph!.edgeClass ?? {})
    .filter(([, c]) => c === 'mst')
    .map(([k]) => k)
    .sort();

describe('kruskal.module', () => {
  it('TC-KRUSKAL-MOD-01 末步 mst 边 = oracle mstEdges [AC,BC,DE,BD,DF]', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    expect(mstKeys(last)).toEqual([...kruskalTrace().mstEdges].sort());
    expect(mstKeys(last)).toEqual(['AC', 'BC', 'BD', 'DE', 'DF']);
  });

  it('TC-KRUSKAL-MOD-02 每步执行点合法且携带图轨（array 空）', () => {
    const ok = new Set<KruskalExecPoint>(['init', 'consider', 'accept', 'reject', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.graph).toBeDefined();
      expect(s.array).toEqual([]);
      expect(s.graph!.directed).toBe(false); // 无向图
    }
  });

  it('TC-KRUSKAL-MOD-03 考虑 9 边：#consider == 9', () => {
    expect(cnt(steps(), 'consider')).toBe(9);
  });

  it('TC-KRUSKAL-MOD-04 接受/拒绝守恒：#accept==5、#reject==4、和==9', () => {
    const ss = steps();
    expect(cnt(ss, 'accept')).toBe(5);
    expect(cnt(ss, 'reject')).toBe(4);
    expect(cnt(ss, 'accept') + cnt(ss, 'reject')).toBe(9);
  });

  it('TC-KRUSKAL-MOD-05 init 步 edgeClass 全空、doneNodes 空', () => {
    const init = steps().find((s) => s.point === 'init')!;
    expect(Object.keys(init.graph!.edgeClass ?? {})).toHaveLength(0);
    expect(init.graph!.doneNodes ?? []).toHaveLength(0);
  });

  it('TC-KRUSKAL-MOD-06 首个 accept（AC，权 1）后 edgeClass[AC]=mst、权重=1', () => {
    const firstAcc = steps().find((s) => s.point === 'accept')!;
    expect(firstAcc.graph!.edgeClass!['AC']).toBe('mst');
    const wRow = firstAcc.vars.find((v) => String(v.name).includes('权重'))!;
    expect(Number(wRow.value)).toBe(1);
  });

  it('TC-KRUSKAL-MOD-07 首个 reject（AB，权 4）后 edgeClass[AB]=rejected', () => {
    const firstRej = steps().find((s) => s.point === 'reject')!;
    expect(firstRej.graph!.edgeClass!['AB']).toBe('rejected');
  });

  it('TC-KRUSKAL-MOD-08 每个 consider 步当前边 edgeClass 为 current', () => {
    const considers = steps().filter((s) => s.point === 'consider');
    expect(considers).toHaveLength(9);
    for (const s of considers) {
      const currentKeys = Object.entries(s.graph!.edgeClass ?? {})
        .filter(([, c]) => c === 'current')
        .map(([k]) => k);
      expect(currentKeys).toHaveLength(1);
    }
  });

  it('TC-KRUSKAL-MOD-09 done 步边分类：mst 恰 5、rejected 恰 4', () => {
    const done = steps().find((s) => s.point === 'done')!;
    const cls = Object.values(done.graph!.edgeClass ?? {});
    expect(cls.filter((c) => c === 'mst')).toHaveLength(5);
    expect(cls.filter((c) => c === 'rejected')).toHaveLength(4);
  });

  it('TC-KRUSKAL-MOD-10 done 步总权 18、doneNodes 含全 6 点', () => {
    const done = steps().find((s) => s.point === 'done')!;
    const wRow = done.vars.find((v) => String(v.name).includes('权重'))!;
    expect(Number(wRow.value)).toBe(18);
    expect([...(done.graph!.doneNodes ?? [])].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('TC-KRUSKAL-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = kruskalModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of kruskalModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-KRUSKAL-MOD-12 module 元信息', () => {
    expect(kruskalModule.title).toContain('Kruskal');
    expect(kruskalModule.initialInput()).toEqual([]);
  });
});
