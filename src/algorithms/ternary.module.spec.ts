// src/algorithms/ternary.module.spec.ts —— 三分查找 module 对拍 oracle（C-095）
import { describe, it, expect } from 'vitest';
import { buildTernarySteps, ternaryModule } from './ternary.module';
import { TER_ARRAY, brutePeak, isUnimodal, terTrace } from './ternary';
import { ternarySources } from './ternary.sources';

const POINTS = new Set(['init', 'probe', 'peak', 'done']);

describe('ternary.module', () => {
  const steps = buildTernarySteps(TER_ARRAY);
  const last = steps[steps.length - 1];
  const tr = terTrace(TER_ARRAY);

  it('TC-TER-MOD-01 对拍：result=4=argmax；峰值 12', () => {
    expect(tr.result).toBe(4);
    expect(tr.result).toBe(brutePeak(TER_ARRAY));
    expect(TER_ARRAY[tr.result]).toBe(12);
  });

  it('TC-TER-MOD-02 单峰断言：严格先升后降', () => {
    expect(isUnimodal(TER_ARRAY)).toBe(true);
    expect(isUnimodal([1, 3, 3, 2])).toBe(false);
    expect(isUnimodal([1, 2, 3, 2, 3])).toBe(false);
  });

  it('TC-TER-MOD-03 轨迹：四探丢右/丢左/丢左/丢右', () => {
    expect(tr.probes.map((p) => [p.lo, p.hi, p.m1, p.m2, p.v1, p.v2, p.dropRight])).toEqual([
      [0, 8, 2, 6, 7, 6, true],
      [0, 5, 1, 4, 4, 12, false],
      [2, 5, 3, 4, 9, 12, false],
      [4, 5, 4, 5, 12, 10, true],
    ]);
  });

  it('TC-TER-MOD-04 步合法：9 柱山形恒序', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.array.map((a) => a[1])).toEqual(TER_ARRAY);
    }
  });

  it('TC-TER-MOD-05 步数结构：7 步 point 序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'probe',
      'probe',
      'probe',
      'probe',
      'peak',
      'done',
    ]);
  });

  it('TC-TER-MOD-06 四指针：probe 步 lo/m1/m2/hi 全出场', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    for (const [k, s] of probes.entries()) {
      const ids = s.pointers.map((p) => p.id).sort();
      expect(ids).toEqual(['0', '1', '2', '3']);
      const m1 = s.pointers.find((p) => p.id === '1')!;
      const m2 = s.pointers.find((p) => p.id === '2')!;
      expect([m1.index, m2.index]).toEqual([tr.probes[k].m1, tr.probes[k].m2]);
    }
  });

  it('TC-TER-MOD-07 对决高亮：comparing=[m1,m2] + 区间收缩', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    probes.forEach((s, k) => {
      expect(s.emphasis.comparing).toEqual([tr.probes[k].m1, tr.probes[k].m2]);
    });
    // 首探后候选 [0..5]，次探后 [2..5]
    expect(probes[0].emphasis.groupMembers).toEqual([0, 1, 2, 3, 4, 5]);
    expect(probes[1].emphasis.groupMembers).toEqual([2, 3, 4, 5]);
  });

  it('TC-TER-MOD-08 peak 步：sortedIndices=[4] + 峰顶 12', () => {
    const peak = steps.find((s) => s.point === 'peak')!;
    expect(peak.emphasis.sortedIndices).toEqual([4]);
    expect(peak.caption).toContain('峰');
    expect(peak.caption).toContain('12');
  });

  it('TC-TER-MOD-09 丢弃语义：丢右/丢左各至少一次', () => {
    const caps = steps
      .filter((s) => s.point === 'probe')
      .map((s) => s.caption ?? '')
      .join('|');
    expect(caps).toContain('右侧 1/3');
    expect(caps).toContain('左侧 1/3');
  });

  it('TC-TER-MOD-10 done caption 含 log 与坡度变体', () => {
    expect(last.caption).toContain('log');
    expect(last.caption).toContain('坡度');
  });

  it('TC-TER-MOD-11 四语言 + 行号 + 四执行点', () => {
    expect(ternarySources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of ternarySources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'peak', 'probe'].sort());
    }
  });

  it('TC-TER-MOD-12 元信息：title 含三分；initialInput 单峰', () => {
    expect(ternaryModule.title).toContain('三分');
    expect(ternaryModule.initialInput()).toEqual(TER_ARRAY);
    expect(isUnimodal(ternaryModule.initialInput())).toBe(true);
  });
});
