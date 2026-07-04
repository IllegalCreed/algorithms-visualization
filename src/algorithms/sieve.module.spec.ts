// src/algorithms/sieve.module.spec.ts —— 埃氏筛 module 对拍 oracle（C-077，数学与数论大类首发）
import { describe, it, expect } from 'vitest';
import { buildSieveSteps, sieveModule } from './sieve.module';
import { SIEVE_N, sievePrimes, isPrimeTrial } from './sieve';
import { sieveSources } from './sieve.sources';
import type { SieveCellState } from '@/components/player/types';

const POINTS = new Set(['init', 'prime', 'mark', 'rest', 'done']);

describe('sieve.module', () => {
  const steps = buildSieveSteps();
  const last = steps[steps.length - 1];
  const primesOracle = sievePrimes();

  // 从末步 states 提取素数（index 1..n）
  const primesFrom = (states: SieveCellState[]): number[] => {
    const r: number[] = [];
    for (let v = 1; v <= SIEVE_N; v++) if (states[v] === 'prime') r.push(v);
    return r;
  };

  it('TC-SIEVE-MOD-01 末步 done + 素数 = sievePrimes() = [2,3,5,7,11,13,17,19,23,29]', () => {
    expect(last.point).toBe('done');
    expect(primesOracle).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(primesFrom(last.sieve!.states)).toEqual(primesOracle);
  });

  it('TC-SIEVE-MOD-02 每步执行点合法且带筛轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.sieve).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-SIEVE-MOD-03 init 全未定 + 1 特殊', () => {
    const init = steps[0];
    expect(init.point).toBe('init');
    expect(init.sieve!.states[1]).toBe('special');
    for (let v = 2; v <= SIEVE_N; v++) expect(init.sieve!.states[v]).toBe('unknown');
  });

  it('TC-SIEVE-MOD-04 主动筛的素数：prime 步 3 个（2,3,5）、rest 步 1 个', () => {
    expect(steps.filter((s) => s.point === 'prime')).toHaveLength(3);
    expect(steps.filter((s) => s.point === 'rest')).toHaveLength(1);
  });

  it('TC-SIEVE-MOD-05 从 p² 起标记：各 mark 步 marking 最小值 = p²', () => {
    const marks = steps.filter((s) => s.point === 'mark');
    // p=2→4、p=3→9、p=5→25
    expect(marks.map((s) => Math.min(...s.sieve!.marking!))).toEqual([4, 9, 25]);
  });

  it('TC-SIEVE-MOD-06 终态计数：prime=10、composite=19、special=1', () => {
    const st = last.sieve!.states;
    const count = (t: SieveCellState) => st.slice(1, SIEVE_N + 1).filter((x) => x === t).length;
    expect(count('prime')).toBe(10);
    expect(count('composite')).toBe(19);
    expect(count('special')).toBe(1);
  });

  it('TC-SIEVE-MOD-07 试除法对拍', () => {
    const ref: number[] = [];
    for (let x = 1; x <= SIEVE_N; x++) if (isPrimeTrial(x)) ref.push(x);
    expect(primesOracle).toEqual(ref);
  });

  it('TC-SIEVE-MOD-08 筛到 √N 即停：只对 p²≤N 的 p 主动 mark；7..29 经 rest 确认', () => {
    const markPs = steps.filter((s) => s.point === 'mark').map((s) => s.sieve!.current);
    expect(markPs).toEqual([2, 3, 5]); // 只有 p²≤30 的素数主动划倍数
    const rest = steps.find((s) => s.point === 'rest')!;
    // rest 步后新确认的素数含 7,11,...,29
    expect(rest.caption).toContain('7');
    expect(rest.caption).toContain('29');
  });

  it('TC-SIEVE-MOD-09 合数单调累加', () => {
    const comp = steps.map((s) => s.sieve!.states.slice(1).filter((x) => x === 'composite').length);
    for (let i = 1; i < comp.length; i++) expect(comp[i]).toBeGreaterThanOrEqual(comp[i - 1]);
  });

  it('TC-SIEVE-MOD-10 done 步 caption 含 10 与素数 29', () => {
    expect(last.caption).toContain('10');
    expect(last.caption).toContain('29');
  });

  it('TC-SIEVE-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(sieveSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of sieveSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'init', 'mark', 'prime', 'rest'].sort(),
      );
    }
  });

  it('TC-SIEVE-MOD-12 module 元信息 title 含筛/埃氏；initialInput()=[]', () => {
    expect(sieveModule.title).toMatch(/筛|埃氏/);
    expect(sieveModule.initialInput()).toEqual([]);
  });
});
