// src/algorithms/closestpair.module.spec.ts —— 最近点对 module 对拍 oracle（C-083）
import { describe, it, expect } from 'vitest';
import { buildClosestPairSteps, closestPairModule } from './closestpair.module';
import { CP_POINTS, bruteClosest, closestPair, dist } from './closestpair';
import { closestPairSources } from './closestpair.sources';

const POINTS = new Set(['init', 'divide', 'half', 'strip', 'merge', 'done']);

describe('closestpair.module', () => {
  const steps = buildClosestPairSteps();
  const last = steps[steps.length - 1];
  const oracle = closestPair();

  it('TC-CP-MOD-01 末步 done + 最近对 [3,5]、d≈1.118', () => {
    expect(last.point).toBe('done');
    expect(oracle.pair).toEqual([3, 5]);
    expect(oracle.d).toBeCloseTo(Math.sqrt(1.25), 9);
    expect(last.hull!.best).toEqual([3, 5]);
  });

  it('TC-CP-MOD-02 每步执行点合法且带 hull（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.hull).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-CP-MOD-03 暴力对拍：d/无序对一致', () => {
    const all = bruteClosest(Array.from({ length: CP_POINTS.length }, (_, i) => i));
    expect(oracle.d).toBeCloseTo(all.d, 9);
    expect([...oracle.pair].sort()).toEqual([...all.pair].sort());
  });

  it('TC-CP-MOD-04 分治结构：divide 1、half 2、strip 1、merge 4', () => {
    const count = (p: string) => steps.filter((s) => s.point === p).length;
    expect(count('divide')).toBe(1);
    expect(count('half')).toBe(2);
    expect(count('strip')).toBe(1);
    expect(count('merge')).toBe(4);
  });

  it('TC-CP-MOD-05 δ = 右半最近（更小）', () => {
    const left = bruteClosest([0, 1, 2, 3]);
    const right = bruteClosest([4, 5, 6, 7]);
    expect(right.d).toBeLessThan(left.d);
    expect(Math.min(left.d, right.d)).toBeCloseTo(right.d, 9);
  });

  it('TC-CP-MOD-06 带范围 [mid−δ, mid+δ] 且带内 5 点', () => {
    const stripStep = steps.find((s) => s.point === 'strip')!;
    const right = bruteClosest([4, 5, 6, 7]);
    expect(stripStep.hull!.strip![0]).toBeCloseTo(oracle.midX - right.d, 9);
    expect(stripStep.hull!.strip![1]).toBeCloseTo(oracle.midX + right.d, 9);
    const inStrip = CP_POINTS.filter((p) => Math.abs(p.x - oracle.midX) < right.d);
    expect(inStrip).toHaveLength(5);
  });

  it('TC-CP-MOD-07 merge 两次刷新（1.581 → 1.118）', () => {
    const merges = steps.filter((s) => s.point === 'merge');
    const refreshed = merges.filter((s) => s.caption?.includes('刷新'));
    expect(refreshed).toHaveLength(2);
    expect(refreshed[0].caption).toContain('1.581');
    expect(refreshed[1].caption).toContain('1.118');
  });

  it('TC-CP-MOD-08 best 距离单调不增，末步≈1.118', () => {
    const ds = steps
      .filter((s) => s.hull!.best)
      .map((s) => dist(s.hull!.best![0], s.hull!.best![1]));
    for (let i = 1; i < ds.length; i++) expect(ds[i]).toBeLessThanOrEqual(ds[i - 1] + 1e-12);
    expect(ds[ds.length - 1]).toBeCloseTo(Math.sqrt(1.25), 9);
  });

  it('TC-CP-MOD-09 最终答案跨中线', () => {
    const [a, b] = last.hull!.best!;
    const xs = [CP_POINTS[a].x, CP_POINTS[b].x];
    expect(Math.min(...xs)).toBeLessThan(oracle.midX);
    expect(Math.max(...xs)).toBeGreaterThan(oracle.midX);
  });

  it('TC-CP-MOD-10 done caption 含 1.118 与「最近」', () => {
    expect(last.caption).toContain('1.118');
    expect(last.caption).toContain('最近');
  });

  it('TC-CP-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(closestPairSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of closestPairSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['divide', 'done', 'half', 'init', 'merge', 'strip'].sort(),
      );
    }
  });

  it('TC-CP-MOD-12 module 元信息 title 含最近点对；initialInput()=[]', () => {
    expect(closestPairModule.title).toContain('最近点对');
    expect(closestPairModule.initialInput()).toEqual([]);
  });
});
