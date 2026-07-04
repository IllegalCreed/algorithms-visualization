// src/algorithms/manacher.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildManacherSteps, manacherModule } from './manacher.module';
import { manacherTransform, manacherRadii, longestPalindrome } from './manacher';
import type { ManacherExecPoint, Step } from '@/components/player/types';

const steps = () => buildManacherSteps();
const last = (ss: Step<ManacherExecPoint>[]) => ss[ss.length - 1];
const centers = (ss: Step<ManacherExecPoint>[]) =>
  ss.filter((s) => s.point === 'mirror' || s.point === 'expand');

describe('manacher.module', () => {
  it('TC-MAN-MOD-01 末步 done + 最长回文 bab', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(longestPalindrome()).toBe('bab');
    // best 区间对应转换串上的 "bab" = #b#a#b#（长 7）
    const [bl, br] = l.manacher!.best as [number, number];
    expect(br - bl).toBe(6); // 2*p=6
    const text = l.vars.map((v) => `${v.name}${v.value}`).join(' ') + ' ' + l.caption;
    expect(text).toContain('bab');
  });

  it('TC-MAN-MOD-02 每步执行点合法且带回文轨（array 空）', () => {
    const ok = new Set<ManacherExecPoint>(['init', 'mirror', 'expand', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.manacher).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-MAN-MOD-03 转换串正确 #b#a#b#a#d#', () => {
    for (const s of steps()) expect(s.manacher!.s).toBe(manacherTransform());
    expect(manacherTransform()).toBe('#b#a#b#a#d#');
  });

  it('TC-MAN-MOD-04 末步半径 = oracle [0,1,0,3,0,3,0,1,0,1,0]', () => {
    expect(last(steps()).manacher!.p).toEqual(manacherRadii());
    expect(manacherRadii()).toEqual([0, 1, 0, 3, 0, 3, 0, 1, 0, 1, 0]);
  });

  it('TC-MAN-MOD-05 init 步 p 全空（null）', () => {
    const init = steps().find((s) => s.point === 'init')!;
    for (const v of init.manacher!.p) expect(v).toBeNull();
  });

  it('TC-MAN-MOD-06 中心逐一递增 0..10', () => {
    const cs = centers(steps()).map((s) => s.manacher!.center);
    expect(cs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('TC-MAN-MOD-07 mirror 步镜像合法（center < boxR，mirror = 2C - center）', () => {
    for (const s of steps().filter((x) => x.point === 'mirror')) {
      const i = s.manacher!.center as number;
      const boxR = s.manacher!.boxR as number;
      const boxL = s.manacher!.boxL as number;
      const c = (boxL + boxR) / 2; // 最右回文中心
      expect(i).toBeLessThan(boxR);
      expect(s.manacher!.mirror).toBe(2 * c - i);
    }
  });

  it('TC-MAN-MOD-08 expand 步无镜像（mirror = null）', () => {
    for (const s of steps().filter((x) => x.point === 'expand')) {
      expect(s.manacher!.mirror ?? null).toBeNull();
    }
  });

  it('TC-MAN-MOD-09 每个中心步 p[center] 由 null 变为 oracle 对应值', () => {
    const oracle = manacherRadii();
    for (const s of centers(steps())) {
      const i = s.manacher!.center as number;
      expect(s.manacher!.p[i]).toBe(oracle[i]);
      expect(s.manacher!.p[i]).not.toBeNull();
    }
  });

  it('TC-MAN-MOD-10 最长回文长度单调不减', () => {
    const ss = steps();
    for (let k = 1; k < ss.length; k++) {
      const a = ss[k - 1].manacher!.best;
      const b = ss[k].manacher!.best;
      const la = a ? a[1] - a[0] : 0;
      const lb = b ? b[1] - b[0] : 0;
      expect(lb).toBeGreaterThanOrEqual(la);
    }
  });

  it('TC-MAN-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = manacherModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of manacherModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-MAN-MOD-12 module 元信息', () => {
    expect(manacherModule.title).toMatch(/Manacher|回文/);
    expect(manacherModule.initialInput()).toEqual([]);
  });
});
