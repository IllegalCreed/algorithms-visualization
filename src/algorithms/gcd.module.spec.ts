// src/algorithms/gcd.module.spec.ts —— 欧几里得 GCD module 对拍 oracle（C-079，数学与数论第 3 页）
import { describe, it, expect } from 'vitest';
import { buildGcdSteps, gcdModule } from './gcd.module';
import { GCD_A, GCD_B, gcd, gcdSteps } from './gcd';
import { gcdSources } from './gcd.sources';

const POINTS = new Set(['init', 'cut', 'done']);

describe('gcd.module', () => {
  const steps = buildGcdSteps();
  const last = steps[steps.length - 1];
  const g = gcd(GCD_A, GCD_B);

  it('TC-GCD-MOD-01 末步 done + gcd(30,18)=6', () => {
    expect(last.point).toBe('done');
    expect(g).toBe(6);
  });

  it('TC-GCD-MOD-02 每步执行点合法且带 gcd 轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.gcd).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-GCD-MOD-03 除法步对拍', () => {
    expect(gcdSteps()).toEqual([
      { a: 30, b: 18, q: 1, r: 12 },
      { a: 18, b: 12, q: 1, r: 6 },
      { a: 12, b: 6, q: 2, r: 0 },
    ]);
  });

  it('TC-GCD-MOD-04 cut 步恰 3 个（3 个除法步）', () => {
    expect(steps.filter((s) => s.point === 'cut')).toHaveLength(3);
  });

  it('TC-GCD-MOD-05 方块恰好铺满：Σsize² = 30×18 = 540', () => {
    const sq = last.gcd!.squares;
    const area = sq.reduce((acc, s) => acc + s.size * s.size, 0);
    expect(area).toBe(GCD_A * GCD_B);
    expect(area).toBe(540);
  });

  it('TC-GCD-MOD-06 最小方块 = gcd = 6', () => {
    const minSize = Math.min(...last.gcd!.squares.map((s) => s.size));
    expect(minSize).toBe(g);
    expect(minSize).toBe(6);
  });

  it('TC-GCD-MOD-07 末步 4 方块，尺寸 {18,12,6}，step2 两个 6', () => {
    const sq = last.gcd!.squares;
    expect(sq).toHaveLength(4);
    expect([...new Set(sq.map((s) => s.size))].sort((a, b) => a - b)).toEqual([6, 12, 18]);
    expect(sq.filter((s) => s.step === 2 && s.size === 6)).toHaveLength(2);
  });

  it('TC-GCD-MOD-08 每方块在 30×18 矩形内', () => {
    for (const s of last.gcd!.squares) {
      expect(s.x).toBeGreaterThanOrEqual(0);
      expect(s.y).toBeGreaterThanOrEqual(0);
      expect(s.x + s.size).toBeLessThanOrEqual(GCD_A);
      expect(s.y + s.size).toBeLessThanOrEqual(GCD_B);
    }
  });

  it('TC-GCD-MOD-09 剩余面积递减 + 末步 done remaining 为 null', () => {
    const cutRems = steps
      .filter((s) => s.point === 'cut')
      .map((s) => s.gcd!.remaining)
      .filter((r): r is { x: number; y: number; w: number; h: number } => r != null)
      .map((r) => r.w * r.h);
    for (let i = 1; i < cutRems.length; i++) expect(cutRems[i]).toBeLessThan(cutRems[i - 1]);
    expect(last.gcd!.remaining).toBeNull();
  });

  it('TC-GCD-MOD-10 done 步 caption 含 gcd=6', () => {
    expect(last.caption).toContain('6');
    expect(last.caption).toMatch(/gcd|公约数|铺满/);
  });

  it('TC-GCD-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(gcdSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of gcdSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['cut', 'done', 'init'].sort());
    }
  });

  it('TC-GCD-MOD-12 module 元信息 title 含欧几里得/公约数；initialInput()=[]', () => {
    expect(gcdModule.title).toMatch(/欧几里得|公约数/);
    expect(gcdModule.initialInput()).toEqual([]);
  });
});
