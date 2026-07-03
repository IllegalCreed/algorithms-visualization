// src/algorithms/rabinkarp.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildRabinKarpSteps, rabinKarpModule } from './rabinkarp.module';
import { rkHash, rkWindowHashes, rkMatches, RK_TEXT, RK_PATTERN } from './rabinkarp';
import type { RabinKarpExecPoint, Step } from '@/components/player/types';

const steps = () => buildRabinKarpSteps();
const cnt = (ss: Step<RabinKarpExecPoint>[], p: RabinKarpExecPoint) =>
  ss.filter((s) => s.point === p).length;
const last = (ss: Step<RabinKarpExecPoint>[]) => ss[ss.length - 1];
const m = RK_PATTERN.length;
const ph = rkHash(RK_PATTERN);
const winHashes = rkWindowHashes();

describe('rabinkarp.module', () => {
  it('TC-RK-MOD-01 末步 done，found = rkMatches() = [2,5]', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.kmp!.found).toEqual(rkMatches());
    expect(rkMatches()).toEqual([2, 5]);
  });

  it('TC-RK-MOD-02 每步执行点合法且携带匹配轨（array 空）', () => {
    const ok = new Set<RabinKarpExecPoint>(['start', 'skip', 'hashHit', 'verify', 'found', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.kmp).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-RK-MOD-03 无 π 行：每步 lps = []', () => {
    for (const s of steps()) expect(s.kmp!.lps).toEqual([]);
  });

  it('TC-RK-MOD-04 窗口对齐：windowStart = offset', () => {
    for (const s of steps()) expect(s.kmp!.windowStart).toBe(s.kmp!.offset);
  });

  it('TC-RK-MOD-05 vars/caption 含模式哈希 312', () => {
    expect(ph).toBe(312);
    const s0 = steps()[0];
    const text = (s0.caption ?? '') + s0.vars.map((v) => `${v.name}${v.value}`).join('');
    expect(text).toContain('312');
  });

  it('TC-RK-MOD-06 存在跳过 + 恰 2 命中', () => {
    const ss = steps();
    expect(cnt(ss, 'skip')).toBeGreaterThanOrEqual(1);
    expect(cnt(ss, 'found')).toBe(2);
  });

  it('TC-RK-MOD-07 skip 步该窗口哈希 ≠ 模式哈希', () => {
    for (const s of steps().filter((x) => x.point === 'skip')) {
      const i = s.kmp!.windowStart as number;
      expect(winHashes[i]).not.toBe(ph);
    }
  });

  it('TC-RK-MOD-08 hashHit 步该窗口哈希 = 模式哈希', () => {
    for (const s of steps().filter((x) => x.point === 'hashHit')) {
      const i = s.kmp!.windowStart as number;
      expect(winHashes[i]).toBe(ph);
    }
  });

  it('TC-RK-MOD-09 found 步命中起点 ∈ {2,5}，末步 found=[2,5]', () => {
    for (const s of steps().filter((x) => x.point === 'found')) {
      const i = s.kmp!.windowStart as number;
      expect([2, 5]).toContain(i);
    }
    expect(last(steps()).kmp!.found).toEqual([2, 5]);
  });

  it('TC-RK-MOD-10 命中区间不越界：T.substr(s,m) === P', () => {
    for (const s of last(steps()).kmp!.found) {
      expect(RK_TEXT.substr(s, m)).toBe(RK_PATTERN);
    }
  });

  it('TC-RK-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = rabinKarpModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of rabinKarpModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-RK-MOD-12 module 元信息', () => {
    expect(rabinKarpModule.title).toMatch(/Rabin-Karp|哈希/);
    expect(rabinKarpModule.initialInput()).toEqual([]);
  });
});
