// src/algorithms/islands.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildIslandsSteps, islandsModule } from './islands.module';
import { islandCount, ISLAND_GRID, ISLAND_DIRS } from './islands';
import type { IslandsExecPoint, Step } from '@/components/player/types';

const steps = () => buildIslandsSteps();
const last = (ss: Step<IslandsExecPoint>[]) => ss[ss.length - 1];
const cnt = (ss: Step<IslandsExecPoint>[], p: IslandsExecPoint) =>
  ss.filter((s) => s.point === p).length;
const landTotal = ISLAND_GRID.flat().filter((v) => v === 1).length; // 6
const keyf = (r: number, c: number) => r + ',' + c;

describe('islands.module', () => {
  it('TC-ISL-MOD-01 末步 done + 岛屿数 3 + filled 覆盖全部陆地', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    const text = l.vars.map((v) => `${v.name}${v.value}`).join(' ') + ' ' + l.caption;
    expect(text).toContain('3');
    expect(l.maze!.filled!.length).toBe(landTotal);
    expect(islandCount()).toBe(3);
  });

  it('TC-ISL-MOD-02 每步执行点合法且带网格轨（array 空）', () => {
    const ok = new Set<IslandsExecPoint>(['scan', 'found', 'flood', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.maze).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-ISL-MOD-03 found 恰 3 次（3 个岛）', () => {
    expect(cnt(steps(), 'found')).toBe(islandCount());
    expect(cnt(steps(), 'found')).toBe(3);
  });

  it('TC-ISL-MOD-04 found 命中新陆地（grid=1 且此前不在 filled）', () => {
    for (const s of steps().filter((x) => x.point === 'found')) {
      const [r, c] = s.maze!.current as [number, number];
      expect(ISLAND_GRID[r][c]).toBe(1);
      // 该 found 步的 filled 里，除自身外不含当前格（即刚发现）
      const before = (s.maze!.filled ?? []).filter(([fr, fc]) => keyf(fr, fc) !== keyf(r, c));
      expect(before.some(([fr, fc]) => fr === r && fc === c)).toBe(false);
    }
  });

  it('TC-ISL-MOD-05 水为墙：walls[r][c] === (grid===0)', () => {
    for (const s of steps()) {
      for (let r = 0; r < ISLAND_GRID.length; r++) {
        for (let c = 0; c < ISLAND_GRID[0].length; c++) {
          expect(s.maze!.walls[r][c]).toBe(ISLAND_GRID[r][c] === 0);
        }
      }
    }
  });

  it('TC-ISL-MOD-06 filled 单调不减', () => {
    const ss = steps();
    for (let i = 1; i < ss.length; i++) {
      expect((ss[i].maze!.filled ?? []).length).toBeGreaterThanOrEqual(
        (ss[i - 1].maze!.filled ?? []).length,
      );
    }
  });

  it('TC-ISL-MOD-07 末步 filled = 全部陆地（6 格、无重复、都是陆地）', () => {
    const filled = last(steps()).maze!.filled!;
    const uniq = new Set(filled.map(([r, c]) => keyf(r, c)));
    expect(uniq.size).toBe(filled.length);
    expect(filled.length).toBe(landTotal);
    for (const [r, c] of filled) expect(ISLAND_GRID[r][c]).toBe(1);
  });

  it('TC-ISL-MOD-08 flood 步陆地且四连通于同岛已 filled 格', () => {
    for (const s of steps().filter((x) => x.point === 'flood')) {
      const [r, c] = s.maze!.current as [number, number];
      expect(ISLAND_GRID[r][c]).toBe(1);
      const filledSet = new Set((s.maze!.filled ?? []).map(([fr, fc]) => keyf(fr, fc)));
      const adjFilled = ISLAND_DIRS.some(([dr, dc]) => filledSet.has(keyf(r + dr, c + dc)));
      expect(adjFilled).toBe(true);
    }
  });

  it('TC-ISL-MOD-09 岛屿无起终点：start/goal 均为 null', () => {
    for (const s of steps()) {
      expect(s.maze!.start ?? null).toBeNull();
      expect(s.maze!.goal ?? null).toBeNull();
    }
  });

  it('TC-ISL-MOD-10 非 done 步当前格图标存在且非 🐭', () => {
    for (const s of steps().filter((x) => x.point !== 'done')) {
      expect(s.maze!.mark).toBeTruthy();
      expect(s.maze!.mark).not.toBe('🐭');
    }
  });

  it('TC-ISL-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = islandsModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of islandsModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-ISL-MOD-12 module 元信息', () => {
    expect(islandsModule.title).toMatch(/岛屿/);
    expect(islandsModule.initialInput()).toEqual([]);
  });
});
