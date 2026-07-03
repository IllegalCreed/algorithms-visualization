// src/algorithms/topo.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildTopoSteps, topoModule } from './topo.module';
import { topoTrace, TOPO_EDGES } from './topo';
import type { TopoExecPoint, Step } from '@/components/player/types';

const steps = () => buildTopoSteps();
const cnt = (ss: Step<TopoExecPoint>[], p: TopoExecPoint) => ss.filter((s) => s.point === p).length;

// 从 removeNode 步的 doneNodes 增量还原输出顺序
function outputOrder(ss: Step<TopoExecPoint>[]): number[] {
  const seq: number[] = [];
  let prev = new Set<number>();
  for (const s of ss) {
    if (s.point === 'removeNode') {
      const cur = new Set(s.graph!.doneNodes ?? []);
      for (const x of cur) if (!prev.has(x)) seq.push(x);
      prev = cur;
    }
  }
  return seq;
}

describe('topo.module', () => {
  it('TC-TOPO-MOD-01 末步输出序 = oracle order [2,0,4,1,3,5]', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    expect(outputOrder(ss)).toEqual(topoTrace().order);
    expect(outputOrder(ss)).toEqual([2, 0, 4, 1, 3, 5]);
  });

  it('TC-TOPO-MOD-02 每步执行点合法且携带有向图轨（array 空）', () => {
    const ok = new Set<TopoExecPoint>(['init', 'selectNode', 'removeNode', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.graph).toBeDefined();
      expect(s.array).toEqual([]);
      expect(s.graph!.directed).toBe(true);
    }
  });

  it('TC-TOPO-MOD-03 取/输出 6 点：#selectNode==6、#removeNode==6', () => {
    const ss = steps();
    expect(cnt(ss, 'selectNode')).toBe(6);
    expect(cnt(ss, 'removeNode')).toBe(6);
  });

  it('TC-TOPO-MOD-04 init 步 nodeBadge = 初始入度 [1,2,0,1,0,3]', () => {
    const init = steps().find((s) => s.point === 'init')!;
    expect(init.graph!.nodeBadge!.map(Number)).toEqual([1, 2, 0, 1, 0, 3]);
  });

  it('TC-TOPO-MOD-05 首个 selectNode 取 C（activeNode=2，入度 0 最小下标）', () => {
    const first = steps().find((s) => s.point === 'selectNode')!;
    expect(first.graph!.activeNode).toBe(2);
  });

  it('TC-TOPO-MOD-06 首个 removeNode 后 doneNodes=[2]、A 入度→0', () => {
    const firstRemove = steps().find((s) => s.point === 'removeNode')!;
    expect(firstRemove.graph!.doneNodes).toEqual([2]);
    expect(firstRemove.graph!.nodeBadge![0]).toBe('0'); // A 入度减到 0
  });

  it('TC-TOPO-MOD-07 输出序是合法拓扑序（每边 u→v，u 先于 v）', () => {
    const order = outputOrder(steps());
    const pos = new Map(order.map((v, i) => [v, i]));
    for (const e of TOPO_EDGES) {
      expect(pos.get(e.from)!).toBeLessThan(pos.get(e.to)!);
    }
  });

  it('TC-TOPO-MOD-08 入度徽标单调不增（减度不变量）', () => {
    const ss = steps();
    const n = ss[0].graph!.nodeBadge!.length;
    const cur = Array.from({ length: n }, () => Infinity);
    for (const s of ss) {
      const b = s.graph!.nodeBadge!.map(Number);
      for (let i = 0; i < n; i++) {
        expect(b[i]).toBeLessThanOrEqual(cur[i]);
        cur[i] = b[i];
      }
    }
  });

  it('TC-TOPO-MOD-09 removeNode 新增 doneNodes 序列 = [2,0,4,1,3,5]', () => {
    expect(outputOrder(steps())).toEqual([2, 0, 4, 1, 3, 5]);
  });

  it('TC-TOPO-MOD-10 done 步 doneNodes 全 6 点、nodeBadge 全 0', () => {
    const done = steps().find((s) => s.point === 'done')!;
    expect([...(done.graph!.doneNodes ?? [])].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(done.graph!.nodeBadge!.every((b) => b === '0')).toBe(true);
  });

  it('TC-TOPO-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = topoModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of topoModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-TOPO-MOD-12 module 元信息', () => {
    expect(topoModule.title).toContain('拓扑');
    expect(topoModule.initialInput()).toEqual([]);
  });
});
