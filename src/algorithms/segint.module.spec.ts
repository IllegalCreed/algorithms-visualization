// src/algorithms/segint.module.spec.ts —— 线段相交 module 对拍 oracle（C-084）
import { describe, it, expect } from 'vitest';
import { buildSegIntSteps, segIntModule } from './segint.module';
import { SI_POINTS, SI_PAIRS, segIntersect, onSeg } from './segint';
import { segIntSources } from './segint.sources';

const POINTS = new Set(['init', 'test', 'verdict', 'done']);

const pairResult = (k: number) => {
  const [e1, e2] = SI_PAIRS[k];
  return segIntersect(SI_POINTS[e1[0]], SI_POINTS[e1[1]], SI_POINTS[e2[0]], SI_POINTS[e2[1]]);
};

describe('segint.module', () => {
  const steps = buildSegIntSteps();
  const last = steps[steps.length - 1];

  it('TC-SI-MOD-01 末步 done + 三对结论 [proper, none, touch]', () => {
    expect(last.point).toBe('done');
    expect([pairResult(0).kind, pairResult(1).kind, pairResult(2).kind]).toEqual([
      'proper',
      'none',
      'touch',
    ]);
  });

  it('TC-SI-MOD-02 每步执行点合法且带 hull（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.hull).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-SI-MOD-03 对 1 规范相交：ds=(-4,4,4,-4) 两两异号', () => {
    const r = pairResult(0);
    expect(r.ds).toEqual([-4, 4, 4, -4]);
    expect(r.ds[0] * r.ds[1]).toBeLessThan(0);
    expect(r.ds[2] * r.ds[3]).toBeLessThan(0);
  });

  it('TC-SI-MOD-04 对 2 同侧判否：D1、D2 同为负', () => {
    const r = pairResult(1);
    expect(r.ds[0]).toBeLessThan(0);
    expect(r.ds[1]).toBeLessThan(0);
    expect(r.hit).toBe(false);
  });

  it('TC-SI-MOD-05 对 3 相触：D3=0 且 (7,1) 在 (6,0)-(8,2) 框上', () => {
    const r = pairResult(2);
    expect(r.ds[2]).toBe(0);
    expect(onSeg(SI_POINTS[8], SI_POINTS[9], SI_POINTS[10])).toBe(true);
    expect(r.kind).toBe('touch');
  });

  it('TC-SI-MOD-06 结构：test 3 + verdict 3；init 6 边全默认', () => {
    expect(steps.filter((s) => s.point === 'test')).toHaveLength(3);
    expect(steps.filter((s) => s.point === 'verdict')).toHaveLength(3);
    expect(steps[0].hull!.edgeClasses!.every((c) => c === null)).toBe(true);
  });

  it('TC-SI-MOD-07 test 步该对两边 seg-test', () => {
    const tests = steps.filter((s) => s.point === 'test');
    tests.forEach((s, k) => {
      expect(s.hull!.edgeClasses![2 * k]).toBe('seg-test');
      expect(s.hull!.edgeClasses![2 * k + 1]).toBe('seg-test');
    });
  });

  it('TC-SI-MOD-08 verdict 定色累积到 done：[yes,yes,no,no,yes,yes]', () => {
    expect(last.hull!.edgeClasses).toEqual([
      'seg-yes',
      'seg-yes',
      'seg-no',
      'seg-no',
      'seg-yes',
      'seg-yes',
    ]);
  });

  it('TC-SI-MOD-09 每步 12 点 6 边', () => {
    for (const s of steps) {
      expect(s.hull!.points).toHaveLength(12);
      expect(s.hull!.edges).toHaveLength(6);
    }
  });

  it('TC-SI-MOD-10 done caption 含 2 相交 1 不相交', () => {
    expect(last.caption).toContain('2');
    expect(last.caption).toContain('1');
    expect(last.caption).toContain('不相交');
  });

  it('TC-SI-MOD-11 四语言 + 行号 + 四执行点', () => {
    expect(segIntSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of segIntSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'test', 'verdict'].sort());
    }
  });

  it('TC-SI-MOD-12 module 元信息 title 含线段相交；initialInput()=[]', () => {
    expect(segIntModule.title).toContain('线段相交');
    expect(segIntModule.initialInput()).toEqual([]);
  });
});
