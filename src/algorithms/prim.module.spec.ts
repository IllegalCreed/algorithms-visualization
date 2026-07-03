// src/algorithms/prim.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildPrimSteps, primModule } from './prim.module';
import { primTrace } from './prim';
import { kruskalTrace } from './kruskal';
import type { PrimExecPoint, Step } from '@/components/player/types';

const steps = () => buildPrimSteps();
const cnt = (ss: Step<PrimExecPoint>[], p: PrimExecPoint) => ss.filter((s) => s.point === p).length;
const mstKeys = (s: Step<PrimExecPoint>) =>
  Object.entries(s.graph!.edgeClass ?? {})
    .filter(([, c]) => c === 'mst')
    .map(([k]) => k)
    .sort();

describe('prim.module', () => {
  it('TC-PRIM-MOD-01 末步 mst 边 = oracle primTrace().mstEdges', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    expect(mstKeys(last)).toEqual([...primTrace().mstEdges].sort());
    expect(mstKeys(last)).toEqual(['AC', 'BC', 'BD', 'DE', 'DF']);
  });

  it('TC-PRIM-MOD-02 与 Kruskal 同一张图 → 同 MST 集（序可不同）', () => {
    const primSet = new Set(primTrace().mstEdges);
    const kruSet = new Set(kruskalTrace().mstEdges);
    expect(primSet).toEqual(kruSet);
  });

  it('TC-PRIM-MOD-03 每步执行点合法且携带无向图轨（array 空）', () => {
    const ok = new Set<PrimExecPoint>(['init', 'selectEdge', 'addVertex', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.graph).toBeDefined();
      expect(s.array).toEqual([]);
      expect(s.graph!.directed).toBe(false);
    }
  });

  it('TC-PRIM-MOD-04 生长 5 边：#selectEdge==5、#addVertex==5', () => {
    const ss = steps();
    expect(cnt(ss, 'selectEdge')).toBe(5);
    expect(cnt(ss, 'addVertex')).toBe(5);
  });

  it('TC-PRIM-MOD-05 init 步 doneNodes=[0]（仅起点 A）、无 mst 边', () => {
    const init = steps().find((s) => s.point === 'init')!;
    expect(init.graph!.doneNodes).toEqual([0]);
    expect(Object.values(init.graph!.edgeClass ?? {}).filter((c) => c === 'mst')).toHaveLength(0);
  });

  it('TC-PRIM-MOD-06 每个 selectEdge 步：唯一 1 条 current 边且为横切边', () => {
    for (const s of steps().filter((x) => x.point === 'selectEdge')) {
      const curKeys = Object.entries(s.graph!.edgeClass ?? {})
        .filter(([, c]) => c === 'current')
        .map(([k]) => k);
      expect(curKeys).toHaveLength(1);
      // 横切：该边恰一端在 doneNodes 内
      const edge = s.graph!.edges.find((e) => e.key === curKeys[0])!;
      const done = new Set(s.graph!.doneNodes ?? []);
      expect(done.has(edge.from) !== done.has(edge.to)).toBe(true);
    }
  });

  it('TC-PRIM-MOD-07 首个 addVertex 后并入 C(2)、edgeClass[AC]=mst、权重=1', () => {
    const firstAdd = steps().find((s) => s.point === 'addVertex')!;
    expect(firstAdd.graph!.doneNodes).toContain(2);
    expect(firstAdd.graph!.edgeClass!['AC']).toBe('mst');
    const wRow = firstAdd.vars.find((v) => String(v.name).includes('权重'))!;
    expect(Number(wRow.value)).toBe(1);
  });

  it('TC-PRIM-MOD-08 生长顺序：addVertex 新增点序列 = [C,B,D,E,F]（[2,1,3,4,5]）', () => {
    expect(addSequence(steps())).toEqual([2, 1, 3, 4, 5]);
  });

  it('TC-PRIM-MOD-09 done 步 mst 恰 5', () => {
    const done = steps().find((s) => s.point === 'done')!;
    expect(Object.values(done.graph!.edgeClass ?? {}).filter((c) => c === 'mst')).toHaveLength(5);
  });

  it('TC-PRIM-MOD-10 done 步总权 18、doneNodes 含全 6 点', () => {
    const done = steps().find((s) => s.point === 'done')!;
    const wRow = done.vars.find((v) => String(v.name).includes('权重'))!;
    expect(Number(wRow.value)).toBe(18);
    expect([...(done.graph!.doneNodes ?? [])].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('TC-PRIM-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = primModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of primModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-PRIM-MOD-12 module 元信息', () => {
    expect(primModule.title).toContain('Prim');
    expect(primModule.initialInput()).toEqual([]);
  });
});

// —— 辅助：从各 addVertex 步的 doneNodes 增量还原加入顺序 ——
function addSequence(ss: Step<PrimExecPoint>[]): number[] {
  const seq: number[] = [];
  let prev = new Set<number>();
  for (const s of ss) {
    if (s.point === 'init') prev = new Set(s.graph!.doneNodes ?? []);
    if (s.point === 'addVertex') {
      const cur = new Set(s.graph!.doneNodes ?? []);
      for (const x of cur) if (!prev.has(x)) seq.push(x);
      prev = cur;
    }
  }
  return seq;
}
