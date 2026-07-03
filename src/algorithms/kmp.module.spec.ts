// src/algorithms/kmp.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildKmpSteps, kmpModule } from './kmp.module';
import { kmpLps, kmpMatches, KMP_TEXT, KMP_PATTERN } from './kmp';
import type { KmpExecPoint, Step } from '@/components/player/types';

const steps = () => buildKmpSteps();
const cnt = (ss: Step<KmpExecPoint>[], p: KmpExecPoint) => ss.filter((s) => s.point === p).length;
const last = (ss: Step<KmpExecPoint>[]) => ss[ss.length - 1];
const m = KMP_PATTERN.length;

describe('kmp.module', () => {
  it('TC-KMP-MOD-01 末步 done，found = kmpMatches() = [2]', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.kmp!.found).toEqual(kmpMatches());
    expect(kmpMatches()).toEqual([2]);
  });

  it('TC-KMP-MOD-02 每步执行点合法且携带匹配轨（array 空）', () => {
    const ok = new Set<KmpExecPoint>(['start', 'match', 'jump', 'advance', 'found', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.kmp).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-KMP-MOD-03 每步 lps = kmpLps() = [0,0,1,2,0]', () => {
    for (const s of steps()) expect(s.kmp!.lps).toEqual(kmpLps());
    expect(kmpLps()).toEqual([0, 0, 1, 2, 0]);
  });

  it('TC-KMP-MOD-04 存在关键跳转：#jump>=1、jump 步 lpsActive = comparePat-1', () => {
    const ss = steps();
    expect(cnt(ss, 'jump')).toBeGreaterThanOrEqual(1);
    for (const s of ss.filter((x) => x.point === 'jump')) {
      expect(s.kmp!.lpsActive).not.toBeNull();
      expect(s.kmp!.lpsActive).toBe((s.kmp!.comparePat as number) - 1);
    }
  });

  it('TC-KMP-MOD-05 恰一 found，命中起点 = 2', () => {
    const ss = steps();
    expect(cnt(ss, 'found')).toBe(1);
    const f = ss.find((s) => s.point === 'found')!;
    expect(f.kmp!.found).toContain(2);
  });

  it('TC-KMP-MOD-06 match 步字符相等', () => {
    for (const s of steps().filter((x) => x.point === 'match')) {
      const ct = s.kmp!.compareText as number;
      const cp = s.kmp!.comparePat as number;
      expect(KMP_TEXT[ct]).toBe(KMP_PATTERN[cp]);
    }
  });

  it('TC-KMP-MOD-07 文本指针不回退：compareText 单调不减', () => {
    let prev = -1;
    for (const s of steps()) {
      const ct = s.kmp!.compareText as number;
      expect(ct).toBeGreaterThanOrEqual(prev);
      prev = ct;
    }
  });

  it('TC-KMP-MOD-08 offset = compareText - comparePat（≥0）', () => {
    for (const s of steps()) {
      const ct = s.kmp!.compareText as number;
      const cp = s.kmp!.comparePat as number;
      expect(s.kmp!.offset).toBe(ct - cp);
      expect(s.kmp!.offset).toBeGreaterThanOrEqual(0);
    }
  });

  it('TC-KMP-MOD-09 matchedLen = comparePat', () => {
    for (const s of steps()) {
      expect(s.kmp!.matchedLen).toBe(s.kmp!.comparePat);
    }
  });

  it('TC-KMP-MOD-10 命中区间不越界：T.substr(s,m) === P', () => {
    for (const s of last(steps()).kmp!.found) {
      expect(KMP_TEXT.substr(s, m)).toBe(KMP_PATTERN);
    }
  });

  it('TC-KMP-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = kmpModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of kmpModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-KMP-MOD-12 module 元信息', () => {
    expect(kmpModule.title).toMatch(/KMP|字符串/);
    expect(kmpModule.initialInput()).toEqual([]);
  });
});
