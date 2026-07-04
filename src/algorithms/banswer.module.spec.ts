// src/algorithms/banswer.module.spec.ts —— 二分答案 module 对拍 oracle（C-094）
import { describe, it, expect } from 'vitest';
import { buildBanswerSteps, banswerModule } from './banswer.module';
import { BA_MAX, BA_H, hoursAt, bruteMinSpeed, baTrace } from './banswer';
import { banswerSources } from './banswer.sources';

const POINTS = new Set(['init', 'probe', 'settle', 'done']);

describe('banswer.module', () => {
  const steps = buildBanswerSteps(banswerModule.initialInput());
  const last = steps[steps.length - 1];
  const tr = baTrace();

  it('TC-BA-MOD-01 对拍：result=4=线性首个可行；边界耗时 8/10', () => {
    expect(tr.result).toBe(4);
    expect(tr.result).toBe(bruteMinSpeed());
    expect(hoursAt(4)).toBe(8);
    expect(hoursAt(3)).toBe(10);
    expect(BA_H).toBe(8);
  });

  it('TC-BA-MOD-02 单调谓词：可行序列恰一次 ✗→✓ 翻转', () => {
    const feas = [];
    for (let k = 1; k <= BA_MAX; k++) feas.push(hoursAt(k) <= BA_H);
    expect(feas.slice(0, 3)).toEqual([false, false, false]);
    expect(feas.slice(3).every(Boolean)).toBe(true);
    let flips = 0;
    for (let i = 1; i < feas.length; i++) if (feas[i] !== feas[i - 1]) flips++;
    expect(flips).toBe(1);
  });

  it('TC-BA-MOD-03 轨迹：四探 6✓/3✗/5✓/4✓', () => {
    expect(tr.probes.map((p) => [p.lo, p.hi, p.mid, p.hours, p.ok])).toEqual([
      [1, 11, 6, 6, true],
      [1, 6, 3, 10, false],
      [4, 6, 5, 8, true],
      [4, 5, 4, 8, true],
    ]);
  });

  it('TC-BA-MOD-04 步合法：11 柱 = 答案空间 1..11 爬坡', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.array.map((a) => a[1])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    }
  });

  it('TC-BA-MOD-05 步数结构：7 步 point 序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'probe',
      'probe',
      'probe',
      'probe',
      'settle',
      'done',
    ]);
  });

  it('TC-BA-MOD-06 probe 步：pivotIndex=速度−1 依次 5,2,4,3', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    expect(probes.map((s) => s.emphasis.pivotIndex)).toEqual([5, 2, 4, 3]);
    // 首探后候选 [1..6] → 下标 [0..5]
    expect(probes[0].emphasis.groupMembers).toEqual([0, 1, 2, 3, 4, 5]);
    // 次探后候选 [4..6] → 下标 [3..5]
    expect(probes[1].emphasis.groupMembers).toEqual([3, 4, 5]);
  });

  it('TC-BA-MOD-07 可行性 caption：✓ 含还能更小、✗ 含加速', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    expect(probes[0].caption).toContain('还能更小');
    expect(probes[1].caption).toContain('加速');
  });

  it('TC-BA-MOD-08 settle 步：sortedIndices=[3]（速度 4）+ 最小', () => {
    const settle = steps.find((s) => s.point === 'settle')!;
    expect(settle.emphasis.sortedIndices).toEqual([3]);
    expect(settle.caption).toContain('最小');
    expect(settle.caption).toContain('4');
  });

  it('TC-BA-MOD-09 vars：probe 步含本次耗时', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    const hrs = probes.map((s) => s.vars.find((v) => v.name === '本次耗时')?.value);
    expect(hrs).toEqual(['6 小时', '10 小时', '8 小时', '8 小时']);
  });

  it('TC-BA-MOD-10 done caption 含答案空间与单调', () => {
    expect(last.caption).toContain('答案空间');
    expect(last.caption).toContain('单调');
  });

  it('TC-BA-MOD-11 四语言 + 行号 + 四执行点', () => {
    expect(banswerSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of banswerSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'probe', 'settle'].sort());
    }
  });

  it('TC-BA-MOD-12 元信息：title 含二分答案；initialInput=[1..11]', () => {
    expect(banswerModule.title).toContain('二分答案');
    expect(banswerModule.initialInput()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });
});
