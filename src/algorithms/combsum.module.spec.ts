// src/algorithms/combsum.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildCombSumSteps, combsumModule } from './combsum.module';
import { buildCombSumTree, combSumAll, COMBSUM_TARGET } from './combsum';
import type { CombSumExecPoint, Step } from '@/components/player/types';

const steps = () => buildCombSumSteps();
const cnt = (ss: Step<CombSumExecPoint>[], p: CombSumExecPoint) =>
  ss.filter((s) => s.point === p).length;
const nodeById = Object.fromEntries(buildCombSumTree().map((n) => [n.id, n]));
const sumOf = (id: number) => (nodeById[id].chosen as number[]).reduce((a, b) => a + b, 0);
const last = (ss: Step<CombSumExecPoint>[]) => ss[ss.length - 1];

describe('combsum.module', () => {
  it('TC-COMBSUM-MOD-01 末步 done，solutionIds = 全部解叶（2 个）', () => {
    const ss = steps();
    expect(last(ss).point).toBe('done');
    expect(last(ss).decisionTree!.solutionIds).toHaveLength(2);
  });

  it('TC-COMBSUM-MOD-02 每步执行点合法且携带决策树轨（array 空）', () => {
    const ok = new Set<CombSumExecPoint>([
      'start',
      'include',
      'prune',
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

  it('TC-COMBSUM-MOD-03 决策树 14 节点；解 2、剪枝 5', () => {
    const dt = last(steps()).decisionTree!;
    expect(dt.nodes).toHaveLength(14);
    expect(dt.solutionIds).toHaveLength(2);
    expect(dt.prunedIds).toHaveLength(5);
  });

  it('TC-COMBSUM-MOD-04 record 步组合按序 = combSumAll()，每个和 = 5', () => {
    const ss = steps();
    const recorded = ss
      .filter((s) => s.point === 'record')
      .map((s) => nodeById[s.decisionTree!.activeId as number].chosen);
    expect(combSumAll()).toEqual([
      [1, 4],
      [2, 3],
    ]);
    expect(recorded).toEqual(combSumAll());
    for (const combo of recorded) {
      expect((combo as number[]).reduce((a, b) => a + b, 0)).toBe(COMBSUM_TARGET);
    }
  });

  it('TC-COMBSUM-MOD-05 首步 start：根空组合、pathIds=[根]、solutionIds/prunedIds 空', () => {
    const first = steps()[0];
    expect(first.point).toBe('start');
    const dt = first.decisionTree!;
    expect(dt.activeId).toBe(0);
    expect(dt.pathIds).toEqual([0]);
    expect(dt.solutionIds ?? []).toEqual([]);
    expect(dt.prunedIds ?? []).toEqual([]);
  });

  it('TC-COMBSUM-MOD-06 存在剪枝：#prune>=1，末步 prunedIds 覆盖全部剪枝节点（5）', () => {
    const ss = steps();
    expect(cnt(ss, 'prune')).toBeGreaterThanOrEqual(1);
    expect(last(ss).decisionTree!.prunedIds).toHaveLength(5);
  });

  it('TC-COMBSUM-MOD-07 每个剪枝节点其组合之和 > 目标 5', () => {
    for (const id of last(steps()).decisionTree!.prunedIds!) {
      expect(sumOf(id)).toBeGreaterThan(COMBSUM_TARGET);
    }
  });

  it('TC-COMBSUM-MOD-08 每个解节点其组合之和 = 目标 5', () => {
    for (const id of last(steps()).decisionTree!.solutionIds!) {
      expect(sumOf(id)).toBe(COMBSUM_TARGET);
    }
  });

  it('TC-COMBSUM-MOD-09 每步 pathIds 从根到 active 连贯（相邻为父子边）', () => {
    const ss = steps();
    const edgeSet = new Set(ss[0].decisionTree!.edges.map((e) => `${e.from}->${e.to}`));
    for (const s of ss) {
      const p = s.decisionTree!.pathIds!;
      expect(p[0]).toBe(0);
      expect(p[p.length - 1]).toBe(s.decisionTree!.activeId);
      for (let i = 0; i + 1 < p.length; i++) {
        expect(edgeSet.has(`${p[i]}->${p[i + 1]}`)).toBe(true);
      }
    }
  });

  it('TC-COMBSUM-MOD-10 每个剪枝节点在决策树中无出边（不展开）', () => {
    const dt = last(steps()).decisionTree!;
    const parents = new Set(dt.edges.map((e) => e.from));
    for (const id of dt.prunedIds!) expect(parents.has(id)).toBe(false);
  });

  it('TC-COMBSUM-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = combsumModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of combsumModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-COMBSUM-MOD-12 module 元信息', () => {
    expect(combsumModule.title).toContain('组合');
    expect(combsumModule.initialInput()).toEqual([]);
  });
});
