// src/algorithms/boyermoore.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildBoyerMooreSteps, boyerMooreModule } from './boyermoore.module';
import { bmLast, bmMatches, BM_TEXT, BM_PATTERN } from './boyermoore';
import type { BoyerMooreExecPoint, Step } from '@/components/player/types';

const steps = () => buildBoyerMooreSteps();
const cnt = (ss: Step<BoyerMooreExecPoint>[], p: BoyerMooreExecPoint) =>
  ss.filter((s) => s.point === p).length;
const last = (ss: Step<BoyerMooreExecPoint>[]) => ss[ss.length - 1];
const m = BM_PATTERN.length;

describe('boyermoore.module', () => {
  it('TC-BM-MOD-01 末步 done，found = bmMatches() = [0,6]', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.kmp!.found).toEqual(bmMatches());
    expect(bmMatches()).toEqual([0, 6]);
  });

  it('TC-BM-MOD-02 每步执行点合法且携带匹配轨（array 空）', () => {
    const ok = new Set<BoyerMooreExecPoint>(['start', 'match', 'badChar', 'found', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.kmp).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-BM-MOD-03 无 π 行：每步 lps = []', () => {
    for (const s of steps()) expect(s.kmp!.lps).toEqual([]);
  });

  it('TC-BM-MOD-04 窗口对齐：windowStart = offset', () => {
    for (const s of steps()) expect(s.kmp!.windowStart).toBe(s.kmp!.offset);
  });

  it('TC-BM-MOD-05 vars 含坏字符表 a:0/b:1/c:2', () => {
    expect(bmLast()).toEqual({ a: 0, b: 1, c: 2 });
    const text = steps()[0]
      .vars.map((v) => `${v.name}${v.value}`)
      .join(' ');
    for (const frag of ['a:0', 'b:1', 'c:2']) expect(text).toContain(frag);
  });

  it('TC-BM-MOD-06 存在两种跳（#badChar>=2）+ 恰 2 命中', () => {
    const ss = steps();
    expect(cnt(ss, 'badChar')).toBeGreaterThanOrEqual(2);
    expect(cnt(ss, 'found')).toBe(2);
  });

  it('TC-BM-MOD-07 match 步字符相等且 matchedFrom = comparePat（后缀含当前）', () => {
    for (const s of steps().filter((x) => x.point === 'match')) {
      const ct = s.kmp!.compareText as number;
      const cp = s.kmp!.comparePat as number;
      expect(BM_TEXT[ct]).toBe(BM_PATTERN[cp]);
      expect(s.kmp!.matchedFrom).toBe(cp);
    }
  });

  it('TC-BM-MOD-08 badChar 步字符不等', () => {
    for (const s of steps().filter((x) => x.point === 'badChar')) {
      const ct = s.kmp!.compareText as number;
      const cp = s.kmp!.comparePat as number;
      expect(BM_TEXT[ct]).not.toBe(BM_PATTERN[cp]);
    }
  });

  it('TC-BM-MOD-09 存在坏字符不在模式的大步跳（如 x）', () => {
    const bc = steps().filter((x) => x.point === 'badChar');
    const absent = bc.some((s) => BM_PATTERN.indexOf(BM_TEXT[s.kmp!.compareText as number]) === -1);
    expect(absent).toBe(true);
  });

  it('TC-BM-MOD-10 命中区间不越界：T.substr(s,m) === P', () => {
    for (const s of last(steps()).kmp!.found) {
      expect(BM_TEXT.substr(s, m)).toBe(BM_PATTERN);
    }
  });

  it('TC-BM-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = boyerMooreModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of boyerMooreModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-BM-MOD-12 module 元信息', () => {
    expect(boyerMooreModule.title).toMatch(/Boyer-Moore|坏字符/);
    expect(boyerMooreModule.initialInput()).toEqual([]);
  });
});
