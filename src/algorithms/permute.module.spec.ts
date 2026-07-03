// src/algorithms/permute.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildPermuteSteps, permuteModule } from './permute.module';
import { permutationsAll, PERMUTE_ELEMS } from './permute';
import type { PermuteExecPoint, Step } from '@/components/player/types';

const steps = () => buildPermuteSteps();
const cnt = (ss: Step<PermuteExecPoint>[], p: PermuteExecPoint) =>
  ss.filter((s) => s.point === p).length;
const edgesOf = (ss: Step<PermuteExecPoint>[]) => ss[0].decisionTree!.edges;
const permLabel = (p: number[]) => `[${p.join(',')}]`;

describe('permute.module', () => {
  it('TC-PERMUTE-MOD-01 末步 done，solutionIds 覆盖全部 6 叶', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    const dt = last.decisionTree!;
    const parents = new Set(dt.edges.map((e) => e.from));
    const leaves = dt.nodes.filter((n) => !parents.has(n.id)).map((n) => n.id);
    expect(leaves).toHaveLength(6);
    for (const leaf of leaves) expect(dt.solutionIds).toContain(leaf);
  });

  it('TC-PERMUTE-MOD-02 每步执行点合法且携带决策树轨（array 空）', () => {
    const ok = new Set<PermuteExecPoint>(['start', 'choose', 'record', 'backtrack', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.decisionTree).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-PERMUTE-MOD-03 决策树 16 节点、15 边、6 叶', () => {
    const dt = steps()[0].decisionTree!;
    expect(dt.nodes).toHaveLength(16);
    expect(dt.edges).toHaveLength(15);
    const parents = new Set(dt.edges.map((e) => e.from));
    expect(dt.nodes.filter((n) => !parents.has(n.id))).toHaveLength(6);
  });

  it('TC-PERMUTE-MOD-04 6 个 record 步按序 = permutationsAll()', () => {
    const ss = steps();
    const recordedLabels = ss
      .filter((s) => s.point === 'record')
      .map((s) => {
        const dt = s.decisionTree!;
        return dt.nodes.find((n) => n.id === dt.activeId)!.label;
      });
    expect(permutationsAll()).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ]);
    expect(recordedLabels).toEqual(permutationsAll().map(permLabel));
  });

  it('TC-PERMUTE-MOD-05 首步 start：根空排列、pathIds=[根]、solutionIds 空', () => {
    const first = steps()[0];
    expect(first.point).toBe('start');
    const dt = first.decisionTree!;
    expect(dt.activeId).toBe(0);
    expect(dt.pathIds).toEqual([0]);
    expect(dt.solutionIds ?? []).toEqual([]);
  });

  it('TC-PERMUTE-MOD-06 恰 6 个 record（= 3!）', () => {
    expect(cnt(steps(), 'record')).toBe(6);
  });

  it('TC-PERMUTE-MOD-07 存在回溯，且 backtrack 步 active 为内部节点（有出边）', () => {
    const ss = steps();
    expect(cnt(ss, 'backtrack')).toBeGreaterThanOrEqual(1);
    const parents = new Set(edgesOf(ss).map((e) => e.from));
    for (const s of ss.filter((x) => x.point === 'backtrack')) {
      expect(parents.has(s.decisionTree!.activeId as number)).toBe(true);
    }
  });

  it('TC-PERMUTE-MOD-08 每步 pathIds 从根到 active 连贯（相邻为父子边）', () => {
    const ss = steps();
    const edgeSet = new Set(edgesOf(ss).map((e) => `${e.from}->${e.to}`));
    for (const s of ss) {
      const p = s.decisionTree!.pathIds!;
      expect(p[0]).toBe(0);
      expect(p[p.length - 1]).toBe(s.decisionTree!.activeId);
      for (let i = 0; i + 1 < p.length; i++) {
        expect(edgeSet.has(`${p[i]}->${p[i + 1]}`)).toBe(true);
      }
    }
  });

  it('TC-PERMUTE-MOD-09 每个解是 [1,2,3] 的合法排列（长度 3、元素互异、值域正确）', () => {
    for (const p of permutationsAll()) {
      expect(p).toHaveLength(PERMUTE_ELEMS.length);
      expect(new Set(p).size).toBe(p.length);
      for (const x of p) expect(PERMUTE_ELEMS).toContain(x);
    }
  });

  it('TC-PERMUTE-MOD-10 首个 choose 步 active = 根首子（选 1）、边 label 含「选 1」', () => {
    const ss = steps();
    const firstEdge = edgesOf(ss).find((e) => e.from === 0)!;
    expect(firstEdge.label).toContain('选 1');
    const firstChoose = ss.find((s) => s.point === 'choose')!;
    expect(firstChoose.decisionTree!.activeId).toBe(firstEdge.to);
  });

  it('TC-PERMUTE-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = permuteModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of permuteModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-PERMUTE-MOD-12 module 元信息', () => {
    expect(permuteModule.title).toContain('排列');
    expect(permuteModule.initialInput()).toEqual([]);
  });
});
