// src/algorithms/cocktail.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildCocktailSortSteps, cocktailSortModule } from './cocktail.module';
import { cocktailSortTrace } from './cocktail';
import type { CocktailExecPoint, Step } from '@/components/player/types';

const BASE = [4, 2, 6, 3, 8, 5, 7, 1];
const vals = (s: Step<CocktailExecPoint>) => s.array.map((t) => t[1]);
const keys = (s: Step<CocktailExecPoint>) => s.array.map((t) => t[0]);
const cnt = (steps: Step<CocktailExecPoint>[], p: CocktailExecPoint) =>
  steps.filter((s) => s.point === p).length;

describe('cocktail.module', () => {
  it('TC-COCKTAIL-MOD-01 末步 done 且值序列 = oracle 结果（有序）', () => {
    const steps = buildCocktailSortSteps(BASE);
    const last = steps[steps.length - 1];
    expect(last.point).toBe('done');
    expect(vals(last)).toEqual(cocktailSortTrace(BASE).result);
    expect(vals(last)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('TC-COCKTAIL-MOD-02 不改入参', () => {
    buildCocktailSortSteps(BASE);
    expect(BASE).toEqual([4, 2, 6, 3, 8, 5, 7, 1]);
  });

  it('TC-COCKTAIL-MOD-03 每步 array 位置键集合恒为 0..7', () => {
    for (const s of buildCocktailSortSteps(BASE)) {
      expect([...keys(s)].sort()).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    }
  });

  it('TC-COCKTAIL-MOD-04 每步执行点合法（9 种）', () => {
    const ok = new Set<CocktailExecPoint>([
      'forwardPass',
      'fCompare',
      'fSwap',
      'fNoSwap',
      'backwardPass',
      'bCompare',
      'bSwap',
      'bNoSwap',
      'done',
    ]);
    for (const s of buildCocktailSortSteps(BASE)) {
      expect(ok.has(s.point)).toBe(true);
    }
  });

  it('TC-COCKTAIL-MOD-05 趟结构：#forwardPass=2、#backwardPass=2', () => {
    const steps = buildCocktailSortSteps(BASE);
    expect(cnt(steps, 'forwardPass')).toBe(2);
    expect(cnt(steps, 'backwardPass')).toBe(2);
  });

  it('TC-COCKTAIL-MOD-06 比较守恒（分向）：f 12=7+5、b 10=6+4', () => {
    const steps = buildCocktailSortSteps(BASE);
    expect(cnt(steps, 'fCompare')).toBe(12);
    expect(cnt(steps, 'bCompare')).toBe(10);
    expect(cnt(steps, 'fCompare')).toBe(cnt(steps, 'fSwap') + cnt(steps, 'fNoSwap'));
    expect(cnt(steps, 'bCompare')).toBe(cnt(steps, 'bSwap') + cnt(steps, 'bNoSwap'));
  });

  it('TC-COCKTAIL-MOD-07 交换总数：#fSwap=7、#bSwap=6', () => {
    const steps = buildCocktailSortSteps(BASE);
    expect(cnt(steps, 'fSwap')).toBe(7);
    expect(cnt(steps, 'bSwap')).toBe(6);
  });

  it('TC-COCKTAIL-MOD-08 乌龟一趟回头：bwd1 六个 bSwap 连发且趟后 1 位于下标 0', () => {
    const steps = buildCocktailSortSteps(BASE);
    const b1 = steps.findIndex((s) => s.point === 'backwardPass');
    const seg = steps.slice(b1 + 1, b1 + 13); // 6×(bCompare+bSwap)
    expect(seg.filter((s) => s.point === 'bCompare')).toHaveLength(6);
    expect(seg.filter((s) => s.point === 'bSwap')).toHaveLength(6);
    expect(seg.some((s) => s.point === 'bNoSwap')).toBe(false);
    expect(vals(seg[seg.length - 1])[0]).toBe(1); // 乌龟 1 已回头
  });

  it('TC-COCKTAIL-MOD-09 双端并存：存在步 sortedFrom=7 且 sortedUpTo=1', () => {
    const steps = buildCocktailSortSteps(BASE);
    expect(steps.some((s) => s.emphasis.sortedFrom === 7 && s.emphasis.sortedUpTo === 1)).toBe(
      true,
    );
  });

  it('TC-COCKTAIL-MOD-10 提前收工：末 4 比较全 bNoSwap 且其后直接 done', () => {
    const steps = buildCocktailSortSteps(BASE);
    const done = steps[steps.length - 1];
    expect(done.point).toBe('done');
    const tail = steps.slice(-9, -1); // bwd2 的 4×(bCompare+bNoSwap)
    expect(tail.filter((s) => s.point === 'bCompare')).toHaveLength(4);
    expect(tail.filter((s) => s.point === 'bNoSwap')).toHaveLength(4);
    expect(tail.some((s) => s.point === 'bSwap')).toBe(false);
  });

  it('TC-COCKTAIL-MOD-11 f/b compare 步均带 comparing 与双指针', () => {
    const steps = buildCocktailSortSteps(BASE);
    for (const s of steps.filter((x) => x.point === 'fCompare' || x.point === 'bCompare')) {
      expect(s.emphasis.comparing).toBeDefined();
      const ids = s.pointers.map((p) => p.id);
      expect(ids).toContain('0');
      expect(ids).toContain('1');
    }
  });

  it('TC-COCKTAIL-MOD-12 done 步 sortedFrom=0、无指针', () => {
    const steps = buildCocktailSortSteps(BASE);
    const done = steps[steps.length - 1];
    expect(done.emphasis.sortedFrom).toBe(0);
    expect(done.pointers).toEqual([]);
  });

  it('TC-COCKTAIL-MOD-13 四语言 sources 且行号在源码行数内', () => {
    const langs = cocktailSortModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of cocktailSortModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-COCKTAIL-MOD-14 module 元信息', () => {
    expect(cocktailSortModule.title).toBe('鸡尾酒排序');
    expect(cocktailSortModule.initialInput()).toEqual(BASE);
  });
});
