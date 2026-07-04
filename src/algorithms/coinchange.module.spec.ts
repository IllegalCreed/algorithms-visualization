// src/algorithms/coinchange.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildCoinChangeSteps, coinChangeModule } from './coinchange.module';
import { coinChangeTrace, COINS, COIN_AMOUNT } from './coinchange';
import type { CoinChangeExecPoint, Step } from '@/components/player/types';

const steps = () => buildCoinChangeSteps();
const last = (ss: Step<CoinChangeExecPoint>[]) => ss[ss.length - 1];
const fills = (ss: Step<CoinChangeExecPoint>[]) =>
  ss.filter((s) => s.point === 'skip' || s.point === 'add');

describe('coinchange.module', () => {
  it('TC-CC-MOD-01 末步 done，右下角 = 4', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.matrix!.cells[3][5]).toBe(coinChangeTrace()[3][5]);
    expect(l.matrix!.cells[3][5]).toBe(4);
  });

  it('TC-CC-MOD-02 每步执行点合法且带矩阵轨（array 空）', () => {
    const ok = new Set<CoinChangeExecPoint>(['init', 'skip', 'add', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.matrix).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-CC-MOD-03 终态表深等 oracle', () => {
    expect(last(steps()).matrix!.cells).toEqual(coinChangeTrace());
  });

  it('TC-CC-MOD-04 init 边界 dp[0][0]=1、第 0 行其余 0', () => {
    const init = steps().find((s) => s.point === 'init')!;
    const cells = init.matrix!.cells;
    expect(cells[0][0]).toBe(1);
    for (let a = 1; a <= COIN_AMOUNT; a++) expect(cells[0][a]).toBe(0);
  });

  it('TC-CC-MOD-05 「用一枚」来源在本行：add 的 sources 含同行 [i, a-coin]', () => {
    for (const s of steps().filter((x) => x.point === 'add')) {
      const [i, a] = s.matrix!.active as [number, number];
      const coin = COINS[i - 1];
      expect(s.matrix!.sources).toContainEqual([i, a - coin]);
    }
  });

  it('TC-CC-MOD-06 「不用」来源在上一行：填格步 sources 含 [i-1, a]', () => {
    for (const s of fills(steps())) {
      const [i, a] = s.matrix!.active as [number, number];
      expect(s.matrix!.sources).toContainEqual([i - 1, a]);
    }
  });

  it('TC-CC-MOD-07 add 恰 2 源，值为两源之和', () => {
    for (const s of steps().filter((x) => x.point === 'add')) {
      const src = s.matrix!.sources!;
      expect(src.length).toBe(2);
      const [i, a] = s.matrix!.active as [number, number];
      const cells = s.matrix!.cells;
      const sum = src.reduce((acc, [r, c]) => acc + (cells[r][c] as number), 0);
      expect(cells[i][a]).toBe(sum);
    }
  });

  it('TC-CC-MOD-08 计数单调不减（随硬币增多方案数不减）', () => {
    const cells = last(steps()).matrix!.cells;
    for (let i = 1; i < cells.length; i++) {
      for (let a = 0; a <= COIN_AMOUNT; a++) {
        expect(cells[i][a] as number).toBeGreaterThanOrEqual(cells[i - 1][a] as number);
      }
    }
  });

  it('TC-CC-MOD-09 vars 展示硬币/金额', () => {
    const text = steps()
      .flatMap((s) => s.vars.map((v) => `${v.name}${v.value}`))
      .join(' ');
    expect(text).toContain('1,2,5');
    expect(text).toContain('5');
  });

  it('TC-CC-MOD-10 四语言 sources 且行号在源码行数内', () => {
    const langs = coinChangeModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of coinChangeModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-CC-MOD-11 module 元信息', () => {
    expect(coinChangeModule.title).toMatch(/硬币|找零/);
    expect(coinChangeModule.initialInput()).toEqual([]);
  });

  it('TC-CC-MOD-12 done 方案数 4', () => {
    expect(last(steps()).caption).toContain('4');
  });
});
