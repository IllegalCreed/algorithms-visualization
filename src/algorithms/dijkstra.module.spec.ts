// src/algorithms/dijkstra.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildDijkstraSteps, dijkstraModule } from './dijkstra.module';
import { dijkstraTrace } from './dijkstra';
import type { DijkstraExecPoint, Step } from '@/components/player/types';

const steps = () => buildDijkstraSteps();
const cnt = (ss: Step<DijkstraExecPoint>[], p: DijkstraExecPoint) =>
  ss.filter((s) => s.point === p).length;

describe('dijkstra.module', () => {
  it('TC-DIJKSTRA-MOD-01 末步 nodeBadge 数值 = oracle dist（有序确定）', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    const badgeNums = last.graph!.nodeBadge!.map((b) => Number(b));
    expect(badgeNums).toEqual(dijkstraTrace().dist);
    expect(badgeNums).toEqual([0, 3, 1, 4, 7, 9]);
  });

  it('TC-DIJKSTRA-MOD-02 每步执行点合法且携带图轨', () => {
    const ok = new Set<DijkstraExecPoint>([
      'init',
      'selectMin',
      'settle',
      'relaxEdge',
      'relaxUpdate',
      'relaxSkip',
      'done',
    ]);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.graph).toBeDefined();
      expect(s.array).toEqual([]); // 图算法无柱数组
    }
  });

  it('TC-DIJKSTRA-MOD-03 确定 6 点：#selectMin == #settle == 6', () => {
    const ss = steps();
    expect(cnt(ss, 'selectMin')).toBe(6);
    expect(cnt(ss, 'settle')).toBe(6);
  });

  it('TC-DIJKSTRA-MOD-04 松弛守恒：#relaxEdge == #relaxUpdate + #relaxSkip', () => {
    const ss = steps();
    expect(cnt(ss, 'relaxEdge')).toBe(cnt(ss, 'relaxUpdate') + cnt(ss, 'relaxSkip'));
  });

  it('TC-DIJKSTRA-MOD-05 init 步 dist[A]=0、其余 ∞', () => {
    const init = steps().find((s) => s.point === 'init')!;
    expect(init.graph!.nodeBadge![0]).toBe('0');
    expect(init.graph!.nodeBadge!.slice(1)).toEqual(['∞', '∞', '∞', '∞', '∞']);
  });

  it('TC-DIJKSTRA-MOD-06 确定顺序 A→C→B→D→E→F（settle activeNode 序列）', () => {
    const order = steps()
      .filter((s) => s.point === 'settle')
      .map((s) => s.graph!.activeNode);
    expect(order).toEqual([0, 2, 1, 3, 4, 5]);
  });

  it('TC-DIJKSTRA-MOD-07 首个 relaxUpdate（A 出边序 A→B 先）后 B 距离 = 4；A→C 后 C = 1', () => {
    const ss = steps();
    const firstUpd = ss.find((s) => s.point === 'relaxUpdate')!;
    expect(firstUpd.graph!.nodeBadge![1]).toBe('4'); // A→B(4)
    const cUpd = ss.find((s) => s.point === 'relaxUpdate' && s.graph!.nodeBadge![2] === '1')!;
    expect(cUpd).toBeDefined(); // A→C(1) 也松弛成功
  });

  it('TC-DIJKSTRA-MOD-08 done 步最短路树：edgeClass tree 恰 5 条（每非源点一条入树边）', () => {
    const done = steps().find((s) => s.point === 'done')!;
    const treeEdges = Object.entries(done.graph!.edgeClass ?? {}).filter(([, c]) => c === 'tree');
    expect(treeEdges).toHaveLength(5);
    const keys = treeEdges.map(([k]) => k).sort();
    expect(keys).toEqual(['0-2', '1-3', '2-1', '3-4', '4-5']);
  });

  it('TC-DIJKSTRA-MOD-09 done 步 doneNodes 全 6 点', () => {
    const done = steps().find((s) => s.point === 'done')!;
    expect(done.graph!.doneNodes).toHaveLength(6);
  });

  it('TC-DIJKSTRA-MOD-10 四语言 sources 且行号在源码行数内', () => {
    const langs = dijkstraModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of dijkstraModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-DIJKSTRA-MOD-11 module 元信息', () => {
    expect(dijkstraModule.title).toContain('Dijkstra');
    expect(dijkstraModule.initialInput()).toEqual([]);
  });
});
