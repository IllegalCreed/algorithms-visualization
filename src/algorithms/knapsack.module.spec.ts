// src/algorithms/knapsack.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildKnapsackSteps, knapsackModule } from './knapsack.module';
import { knapsackTrace } from './knapsack';
import type { KnapsackExecPoint, Step } from '@/components/player/types';

const steps = () => buildKnapsackSteps();
const cnt = (ss: Step<KnapsackExecPoint>[], p: KnapsackExecPoint) =>
  ss.filter((s) => s.point === p).length;

describe('knapsack.module', () => {
  it('TC-KNAP-MOD-01 末步 cells = oracle knapsackTrace()，右下角 = 7', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    expect(last.matrix!.cells).toEqual(knapsackTrace());
    expect(last.matrix!.cells[4][5]).toBe(7);
  });

  it('TC-KNAP-MOD-02 每步执行点合法且携带矩阵轨（array 空）', () => {
    const ok = new Set<KnapsackExecPoint>(['init', 'cellSkip', 'cellChoose', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.matrix).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-KNAP-MOD-03 取舍统计：#cellSkip==10、#cellChoose==10（共 20 内部格）', () => {
    const ss = steps();
    expect(cnt(ss, 'cellSkip')).toBe(10);
    expect(cnt(ss, 'cellChoose')).toBe(10);
  });

  it('TC-KNAP-MOD-04 init 步边界：第 0 行/列全 0，内部 null', () => {
    const init = steps().find((s) => s.point === 'init')!;
    const c = init.matrix!.cells;
    expect(c[0]).toEqual([0, 0, 0, 0, 0, 0]);
    expect([c[0][0], c[1][0], c[2][0], c[3][0], c[4][0]]).toEqual([0, 0, 0, 0, 0]);
    expect(c[1][1]).toBeNull(); // 内部格未填
  });

  it('TC-KNAP-MOD-05 首个 cellSkip（A 容量1，重2>1）：cells[1][1]=0、sources 上格 [[0,1]]', () => {
    const firstSkip = steps().find((s) => s.point === 'cellSkip')!;
    expect(firstSkip.matrix!.cells[1][1]).toBe(0);
    expect(firstSkip.matrix!.sources).toEqual([[0, 1]]);
  });

  it('TC-KNAP-MOD-06 每个 cellChoose 步 sources 长度 2（上格 + 左上偏移格）', () => {
    for (const s of steps().filter((x) => x.point === 'cellChoose')) {
      expect(s.matrix!.sources).toHaveLength(2);
    }
  });

  it('TC-KNAP-MOD-07 每步行列标签 + emptyText 空白', () => {
    for (const s of steps()) {
      expect(s.matrix!.rowLabels).toEqual(['∅', 'A', 'B', 'C', 'D']);
      expect(s.matrix!.colLabels).toEqual(['0', '1', '2', '3', '4', '5']);
      expect(s.matrix!.emptyText).toBe('');
    }
  });

  it('TC-KNAP-MOD-08 最优值 = 7（选 A+B）', () => {
    const done = steps().find((s) => s.point === 'done')!;
    expect(done.matrix!.cells[4][5]).toBe(7);
    expect(knapsackTrace()[4][5]).toBe(7);
  });

  it('TC-KNAP-MOD-09 单元写入一次不变（DP 不变量）', () => {
    const ss = steps();
    const rows = 5;
    const cols = 6;
    const seen: (number | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (const s of ss) {
      const c = s.matrix!.cells;
      for (let i = 0; i < rows; i++)
        for (let w = 0; w < cols; w++) {
          if (seen[i][w] !== null) expect(c[i][w]).toBe(seen[i][w]);
          if (c[i][w] !== null) seen[i][w] = c[i][w];
        }
    }
  });

  it('TC-KNAP-MOD-10 每个填格步 active 为当前格', () => {
    for (const s of steps().filter((x) => x.point === 'cellSkip' || x.point === 'cellChoose')) {
      expect(s.matrix!.active).toBeTruthy();
      expect(s.matrix!.active).toHaveLength(2);
    }
  });

  it('TC-KNAP-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = knapsackModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of knapsackModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-KNAP-MOD-12 module 元信息', () => {
    expect(knapsackModule.title).toContain('背包');
    expect(knapsackModule.initialInput()).toEqual([]);
  });
});
