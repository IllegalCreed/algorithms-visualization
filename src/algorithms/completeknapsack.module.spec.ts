// src/algorithms/completeknapsack.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildCompleteKnapsackSteps, completeKnapsackModule } from './completeknapsack.module';
import { completeKnapsackTrace, WEIGHTS, CAPACITY } from './completeknapsack';
import type { KnapsackExecPoint, Step } from '@/components/player/types';

const steps = () => buildCompleteKnapsackSteps();
const last = (ss: Step<KnapsackExecPoint>[]) => ss[ss.length - 1];
const fills = (ss: Step<KnapsackExecPoint>[]) =>
  ss.filter((s) => s.point === 'cellSkip' || s.point === 'cellChoose');

describe('completeknapsack.module', () => {
  it('TC-CK-MOD-01 末步 done，右下角 = 15', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.matrix!.cells[3][6]).toBe(completeKnapsackTrace()[3][6]);
    expect(l.matrix!.cells[3][6]).toBe(15);
  });

  it('TC-CK-MOD-02 每步执行点合法且带矩阵轨（array 空）', () => {
    const ok = new Set<KnapsackExecPoint>(['init', 'cellSkip', 'cellChoose', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.matrix).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-CK-MOD-03 终态表深等 oracle', () => {
    expect(last(steps()).matrix!.cells).toEqual(completeKnapsackTrace());
  });

  it('TC-CK-MOD-04 init 步第 0 行/列全 0', () => {
    const init = steps().find((s) => s.point === 'init')!;
    const cells = init.matrix!.cells;
    for (let w = 0; w <= CAPACITY; w++) expect(cells[0][w]).toBe(0);
    for (let i = 0; i < cells.length; i++) expect(cells[i][0]).toBe(0);
  });

  it('TC-CK-MOD-05 「取」来源在本行：cellChoose 的 sources 含与 active 同行的格 [i, w-wt]', () => {
    for (const s of steps().filter((x) => x.point === 'cellChoose')) {
      const [i, w] = s.matrix!.active as [number, number];
      const wt = WEIGHTS[i - 1];
      const sources = s.matrix!.sources ?? [];
      // 完全背包关键差异：「取」来源在同一行 i（而非 0-1 的 i-1）
      expect(sources).toContainEqual([i, w - wt]);
    }
  });

  it('TC-CK-MOD-06 「不取」来源在上一行：填格步 sources 含 [i-1, w]', () => {
    for (const s of fills(steps())) {
      const [i, w] = s.matrix!.active as [number, number];
      expect(s.matrix!.sources ?? []).toContainEqual([i - 1, w]);
    }
  });

  it('TC-CK-MOD-07 cellChoose 恰 2 源（不取上一行 + 取本行）', () => {
    for (const s of steps().filter((x) => x.point === 'cellChoose')) {
      expect((s.matrix!.sources ?? []).length).toBe(2);
    }
  });

  it('TC-CK-MOD-08 active === updatedCell === [i,w]', () => {
    for (const s of fills(steps())) {
      expect(s.matrix!.active).toEqual(s.matrix!.updatedCell);
    }
  });

  it('TC-CK-MOD-09 可重复取：第 1 行末格 cells[1][6] = 15（物品 A 取 3 次）', () => {
    // 只用物品 A（重2值5）：容量 6 拿 3 个 A → 15，完全背包独有
    const lastFillRow1 = steps().filter((s) => (s.matrix!.active as [number, number])?.[0] === 1);
    const l = lastFillRow1[lastFillRow1.length - 1];
    expect(l.matrix!.cells[1][6]).toBe(15);
  });

  it('TC-CK-MOD-10 vars 展示物品清单', () => {
    const text = steps()
      .flatMap((s) => s.vars.map((v) => `${v.name}${v.value}`))
      .join(' ');
    for (const frag of ['A(重2,值5)', 'B(重3,值6)', 'C(重4,值7)']) expect(text).toContain(frag);
  });

  it('TC-CK-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = completeKnapsackModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of completeKnapsackModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-CK-MOD-12 module 元信息', () => {
    expect(completeKnapsackModule.title).toMatch(/完全背包|背包/);
    expect(completeKnapsackModule.initialInput()).toEqual([]);
  });
});
