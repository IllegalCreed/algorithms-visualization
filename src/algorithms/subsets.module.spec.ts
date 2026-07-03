// src/algorithms/subsets.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildSubsetsSteps, subsetsModule } from './subsets.module';
import { subsetsAll } from './subsets';
import type { SubsetsExecPoint, Step } from '@/components/player/types';

const steps = () => buildSubsetsSteps();
const cnt = (ss: Step<SubsetsExecPoint>[], p: SubsetsExecPoint) =>
  ss.filter((s) => s.point === p).length;
// 出边集合（父→子），用于判定叶子/路径连贯
const outFrom = (ss: Step<SubsetsExecPoint>[]) => {
  const edges = ss[0].decisionTree!.edges;
  return edges;
};
const labelOfSubset = (sub: number[]) => (sub.length ? `{${sub.join(',')}}` : '∅');

describe('subsets.module', () => {
  it('TC-SUBSETS-MOD-01 末步 done，solutionIds 覆盖全部 8 叶', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    const dt = last.decisionTree!;
    const parents = new Set(dt.edges.map((e) => e.from));
    const leaves = dt.nodes.filter((n) => !parents.has(n.id)).map((n) => n.id);
    expect(leaves).toHaveLength(8);
    for (const leaf of leaves) expect(dt.solutionIds).toContain(leaf);
  });

  it('TC-SUBSETS-MOD-02 每步执行点合法且携带决策树轨（array 空）', () => {
    const ok = new Set<SubsetsExecPoint>([
      'start',
      'include',
      'exclude',
      'record',
      'backtrack',
      'done',
    ]);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.decisionTree).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-SUBSETS-MOD-03 决策树 15 节点、14 边、8 叶', () => {
    const dt = steps()[0].decisionTree!;
    expect(dt.nodes).toHaveLength(15);
    expect(dt.edges).toHaveLength(14);
    const parents = new Set(dt.edges.map((e) => e.from));
    expect(dt.nodes.filter((n) => !parents.has(n.id))).toHaveLength(8);
  });

  it('TC-SUBSETS-MOD-04 8 个 record 步按序 = subsetsAll()', () => {
    const ss = steps();
    const recordedLabels = ss
      .filter((s) => s.point === 'record')
      .map((s) => {
        const dt = s.decisionTree!;
        return dt.nodes.find((n) => n.id === dt.activeId)!.label;
      });
    const expected = subsetsAll().map(labelOfSubset);
    expect(subsetsAll()).toEqual([[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]);
    expect(recordedLabels).toEqual(expected);
  });

  it('TC-SUBSETS-MOD-05 首步 start：根空集、pathIds=[根]、solutionIds 空', () => {
    const first = steps()[0];
    expect(first.point).toBe('start');
    const dt = first.decisionTree!;
    expect(dt.activeId).toBe(0);
    expect(dt.pathIds).toEqual([0]);
    expect(dt.solutionIds ?? []).toEqual([]);
  });

  it('TC-SUBSETS-MOD-06 恰 8 个 record（= 2^3）', () => {
    expect(cnt(steps(), 'record')).toBe(8);
  });

  it('TC-SUBSETS-MOD-07 存在回溯，且 backtrack 步 active 为内部节点（有出边）', () => {
    const ss = steps();
    expect(cnt(ss, 'backtrack')).toBeGreaterThanOrEqual(1);
    const parents = new Set(outFrom(ss).map((e) => e.from));
    for (const s of ss.filter((x) => x.point === 'backtrack')) {
      expect(parents.has(s.decisionTree!.activeId as number)).toBe(true);
    }
  });

  it('TC-SUBSETS-MOD-08 每步 pathIds 从根到 active 连贯（相邻为父子边）', () => {
    const ss = steps();
    const edgeSet = new Set(outFrom(ss).map((e) => `${e.from}->${e.to}`));
    for (const s of ss) {
      const p = s.decisionTree!.pathIds!;
      expect(p[0]).toBe(0); // 根
      expect(p[p.length - 1]).toBe(s.decisionTree!.activeId); // 末=当前
      for (let i = 0; i + 1 < p.length; i++) {
        expect(edgeSet.has(`${p[i]}->${p[i + 1]}`)).toBe(true);
      }
    }
  });

  it('TC-SUBSETS-MOD-09 solutionIds 长度单调不减，末步 = 8', () => {
    const ss = steps();
    let prev = 0;
    for (const s of ss) {
      const len = (s.decisionTree!.solutionIds ?? []).length;
      expect(len).toBeGreaterThanOrEqual(prev);
      prev = len;
    }
    expect((ss[ss.length - 1].decisionTree!.solutionIds ?? []).length).toBe(8);
  });

  it('TC-SUBSETS-MOD-10 首个 include 步 active = 根的「选 1」子、边 label 含「选 1」', () => {
    const ss = steps();
    const inc1 = ss[0].decisionTree!.edges.find(
      (e) => e.from === 0 && (e.label ?? '').includes('选 1'),
    )!;
    expect(inc1).toBeDefined();
    const firstInc = ss.find((s) => s.point === 'include')!;
    expect(firstInc.decisionTree!.activeId).toBe(inc1.to);
  });

  it('TC-SUBSETS-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = subsetsModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of subsetsModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-SUBSETS-MOD-12 module 元信息', () => {
    expect(subsetsModule.title).toContain('子集');
    expect(subsetsModule.initialInput()).toEqual([]);
  });
});
