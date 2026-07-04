// src/algorithms/fastpower.module.spec.ts —— 快速幂 module 对拍 oracle（C-080，数学与数论第 4 页）
import { describe, it, expect } from 'vitest';
import { buildFastPowSteps, fastPowModule } from './fastpower.module';
import { FP_A, FP_N, fastPow, powBlocks } from './fastpower';
import { fastPowerSources } from './fastpower.sources';

const POINTS = new Set(['init', 'mul', 'skip', 'done']);

describe('fastpower.module', () => {
  const steps = buildFastPowSteps();
  const last = steps[steps.length - 1];

  it('TC-FP-MOD-01 末步 done + fastPow(3,13)=1594323=3**13', () => {
    expect(last.point).toBe('done');
    expect(fastPow(FP_A, FP_N)).toBe(1594323);
    expect(fastPow(FP_A, FP_N)).toBe(3 ** 13);
    expect(last.power!.result).toBe(1594323);
  });

  it('TC-FP-MOD-02 每步执行点合法且带 power 轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.power).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-FP-MOD-03 幂块平方链：末步 blocks 值 = [3,9,81,6561]', () => {
    expect(last.power!.blocks.map((b) => b.value)).toEqual([3, 9, 81, 6561]);
    // 每块 = 前块平方
    const vals = last.power!.blocks.map((b) => b.value);
    for (let i = 1; i < vals.length; i++) expect(vals[i]).toBe(vals[i - 1] * vals[i - 1]);
  });

  it('TC-FP-MOD-04 二进制位：blocks bit = [1,0,1,1]（13=1101 low→high）', () => {
    expect(last.power!.blocks.map((b) => b.bit)).toEqual([1, 0, 1, 1]);
  });

  it('TC-FP-MOD-05 选中 = 位 1；指数和 1+4+8=13', () => {
    const sel = last.power!.blocks.filter((b) => b.selected);
    expect(sel.map((b) => b.k)).toEqual([0, 2, 3]);
    expect(sel.reduce((acc, b) => acc + b.exp, 0)).toBe(FP_N);
  });

  it('TC-FP-MOD-06 mul 步 3 个（位 1）、skip 步 1 个（位 0）', () => {
    expect(steps.filter((s) => s.point === 'mul')).toHaveLength(3);
    expect(steps.filter((s) => s.point === 'skip')).toHaveLength(1);
  });

  it('TC-FP-MOD-07 结果累乘：mul 步乘入当前块；末步 = 选中连乘', () => {
    const muls = steps.filter((s) => s.point === 'mul');
    expect(muls.map((s) => s.power!.result)).toEqual([3, 243, 1594323]);
    // 选中块连乘 = 结果
    const prod = last.power!.blocks.filter((b) => b.selected).reduce((acc, b) => acc * b.value, 1);
    expect(prod).toBe(1594323);
  });

  it('TC-FP-MOD-08 result 非减；末步 = a**n', () => {
    const rs = steps.map((s) => s.power!.result);
    for (let i = 1; i < rs.length; i++) expect(rs[i]).toBeGreaterThanOrEqual(rs[i - 1]);
    expect(rs[rs.length - 1]).toBe(FP_A ** FP_N);
  });

  it('TC-FP-MOD-09 幂块对拍 oracle powBlocks()', () => {
    expect(last.power!.blocks).toEqual(powBlocks());
  });

  it('TC-FP-MOD-10 done 步 caption 含 1594323 与幂拆分（1+4+8）', () => {
    expect(last.caption).toContain('1594323');
    expect(last.caption).toContain('1+4+8');
  });

  it('TC-FP-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(fastPowerSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of fastPowerSources) {
      const nn = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(nn);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'mul', 'skip'].sort());
    }
  });

  it('TC-FP-MOD-12 module 元信息 title 含快速幂；initialInput()=[]', () => {
    expect(fastPowModule.title).toContain('快速幂');
    expect(fastPowModule.initialInput()).toEqual([]);
  });
});
