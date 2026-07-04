// src/algorithms/linearsieve.module.spec.ts —— 线性筛 module 对拍 oracle（C-078，数学与数论第 2 页）
import { describe, it, expect } from 'vitest';
import { buildLinearSieveSteps, linearSieveModule } from './linearsieve.module';
import { LS_N, linearSieve, smallestPrimeFactor } from './linearsieve';
import { linearSieveSources } from './linearsieve.sources';
import type { SieveCellState } from '@/components/player/types';

const POINTS = new Set(['init', 'mark', 'rest', 'done']);

describe('linearsieve.module', () => {
  const steps = buildLinearSieveSteps();
  const last = steps[steps.length - 1];
  const oracle = linearSieve();

  const primesFrom = (states: SieveCellState[]): number[] => {
    const r: number[] = [];
    for (let v = 1; v <= LS_N; v++) if (states[v] === 'prime') r.push(v);
    return r;
  };

  it('TC-LS-MOD-01 末步 done + 素数 = linearSieve().primes = [2,3,5,7,11,13,17,19,23,29]', () => {
    expect(last.point).toBe('done');
    expect(oracle.primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(primesFrom(last.sieve!.states)).toEqual(oracle.primes);
  });

  it('TC-LS-MOD-02 每步执行点合法且带筛轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.sieve).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-LS-MOD-03 init 全未定 + 1 特殊 + spf 全 null', () => {
    const init = steps[0];
    expect(init.point).toBe('init');
    expect(init.sieve!.states[1]).toBe('special');
    for (let v = 2; v <= LS_N; v++) expect(init.sieve!.states[v]).toBe('unknown');
    expect(init.sieve!.spf!.every((x) => x == null)).toBe(true);
  });

  it('TC-LS-MOD-04 外层遍历所有数：存在 mark 步 current 是合数（如 i=4）', () => {
    const marks = steps.filter((s) => s.point === 'mark');
    const hasCompositeCurrent = marks.some(
      (s) => s.sieve!.current != null && s.sieve!.states[s.sieve!.current] === 'composite',
    );
    expect(hasCompositeCurrent).toBe(true); // 区别于埃氏筛只处理素数
  });

  it('TC-LS-MOD-05 spf = 最小质因子（各合数）', () => {
    const spf = last.sieve!.spf!;
    for (let v = 2; v <= LS_N; v++) {
      if (last.sieve!.states[v] === 'composite') expect(spf[v]).toBe(smallestPrimeFactor(v));
    }
    expect(spf).toEqual(oracle.spf.map((x) => (x === 0 ? null : x)));
  });

  it('TC-LS-MOD-06 每合数只划一次：所有 marking 并集无重复 = 全部合数', () => {
    const all: number[] = [];
    for (const s of steps) all.push(...(s.sieve!.marking ?? []));
    expect(new Set(all).size).toBe(all.length); // 无重复 → 每合数只划一次
    const composites: number[] = [];
    for (let v = 2; v <= LS_N; v++) if (last.sieve!.states[v] === 'composite') composites.push(v);
    expect([...all].sort((a, b) => a - b)).toEqual(composites);
  });

  it('TC-LS-MOD-07 终态计数：prime=10、composite=19、special=1；spf 非 null=19', () => {
    const st = last.sieve!.states;
    const count = (t: SieveCellState) => st.slice(1, LS_N + 1).filter((x) => x === t).length;
    expect(count('prime')).toBe(10);
    expect(count('composite')).toBe(19);
    expect(count('special')).toBe(1);
    expect(last.sieve!.spf!.filter((x) => x != null).length).toBe(19);
  });

  it('TC-LS-MOD-08 试除法对拍', () => {
    const ref: number[] = [];
    for (let x = 2; x <= LS_N; x++) if (smallestPrimeFactor(x) === x) ref.push(x);
    expect(oracle.primes).toEqual(ref);
  });

  it('TC-LS-MOD-09 合数单调累加', () => {
    const comp = steps.map((s) => s.sieve!.states.slice(1).filter((x) => x === 'composite').length);
    for (let i = 1; i < comp.length; i++) expect(comp[i]).toBeGreaterThanOrEqual(comp[i - 1]);
  });

  it('TC-LS-MOD-10 done 步 caption 含 10 与「最小质因子」「一次」', () => {
    expect(last.caption).toContain('10');
    expect(last.caption).toContain('最小质因子');
    expect(last.caption).toContain('一次');
  });

  it('TC-LS-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(linearSieveSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of linearSieveSources) {
      const nn = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(nn);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'mark', 'rest'].sort());
    }
  });

  it('TC-LS-MOD-12 module 元信息 title 含线性筛/欧拉；initialInput()=[]', () => {
    expect(linearSieveModule.title).toMatch(/线性筛|欧拉/);
    expect(linearSieveModule.initialInput()).toEqual([]);
  });
});
