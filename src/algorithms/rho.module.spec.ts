// src/algorithms/rho.module.spec.ts —— Pollard's Rho module 对拍 oracle（C-108）
import { describe, it, expect } from 'vitest';
import { buildRhoSteps, rhoModule } from './rho.module';
import { RHO_N, rhoTrace, isPrimeBrute } from './rho';
import { rhoSources } from './rho.sources';

const POINTS = new Set(['init', 'seed', 'race', 'hit', 'reveal', 'done']);

describe('rho.module', () => {
  const steps = buildRhoSteps();
  const last = steps[steps.length - 1];
  const tr = rhoTrace();

  it('TC-RHO-MOD-01 对拍：97×83=8051 且双素性', () => {
    expect(tr.factor).toBe(97);
    expect(tr.cofactor).toBe(83);
    expect(tr.factor * tr.cofactor).toBe(RHO_N);
    expect(isPrimeBrute(tr.factor)).toBe(true);
    expect(isPrimeBrute(tr.cofactor)).toBe(true);
    expect(isPrimeBrute(RHO_N)).toBe(false);
  });

  it('TC-RHO-MOD-02 序列与 ρ：xs 全等 + mod 97 尾 1 环 3', () => {
    expect(tr.xs).toEqual([2, 5, 26, 677, 7474, 2839, 871, 1848]);
    const m = tr.xs.map((x) => x % 97);
    expect(m).toEqual([2, 5, 26, 95, 5, 26, 95, 5]);
    expect(m[1]).toBe(m[4]); // 尾 1 环 3：位置 1 与 4 首次重复
  });

  it('TC-RHO-MOD-03 龟兔轨迹：两次未中 + 第三步 gcd(194)=97', () => {
    expect(tr.races.map((r) => [r.slow, r.fast, r.g])).toEqual([
      [5, 26, 1],
      [26, 7474, 1],
      [677, 871, 97],
    ]);
    expect(tr.races[2].diff).toBe(194);
    expect(tr.races[2].slowIdx).toBe(3);
    expect(tr.races[2].fastIdx).toBe(6);
  });

  it('TC-RHO-MOD-04 步合法：point + graph + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.graph).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-RHO-MOD-05 步数结构：7 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'seed',
      'race',
      'race',
      'hit',
      'reveal',
      'done',
    ]);
  });

  it('TC-RHO-MOD-06 seed 步：x₀ 高亮 + 伪随机语义', () => {
    const s = steps[1];
    expect(s.graph!.activeNode).toBe(0);
    expect(s.caption).toContain('x² + 1');
  });

  it('TC-RHO-MOD-07 race 步：龟兔蓝环 + 链边渐绿 + gcd=1', () => {
    const r1 = steps[2];
    expect(r1.graph!.checkPair).toEqual([1, 2]);
    const r2 = steps[3];
    expect(r2.graph!.checkPair).toEqual([2, 4]);
    const mst1 = Object.values(r1.graph!.edgeClass!).filter((c) => c === 'mst').length;
    const mst2 = Object.values(r2.graph!.edgeClass!).filter((c) => c === 'mst').length;
    expect(mst1).toBe(2);
    expect(mst2).toBe(4);
    expect(r1.caption).toContain('gcd');
    expect(r1.caption).toContain('1');
  });

  it('TC-RHO-MOD-08 hit 步：checkPair=[3,6] + 194/97 + 分解式', () => {
    const h = steps[4];
    expect(h.graph!.checkPair).toEqual([3, 6]);
    expect(h.caption).toContain('194');
    expect(h.caption).toContain('97');
    expect(h.caption).toContain('83');
  });

  it('TC-RHO-MOD-09 reveal 步：nodeGroup 四组 + mod 97 语义', () => {
    const rv = steps[5];
    expect(rv.graph!.nodeGroup).toEqual([0, 1, 2, 3, 1, 2, 3, 1]);
    expect(rv.caption).toContain('97');
    expect(rv.caption).toContain('环');
  });

  it('TC-RHO-MOD-10 done：O(n^¼) + 流水线', () => {
    expect(last.caption).toMatch(/n\^¼|n\^\{1\/4\}|四次方根/);
    expect(last.caption).toMatch(/米勒-拉宾|判素/);
  });

  it('TC-RHO-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(rhoSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of rhoSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'hit', 'init', 'race', 'reveal', 'seed'].sort(),
      );
    }
  });

  it('TC-RHO-MOD-12 元信息：title 含 Pollard；initialInput=[]', () => {
    expect(rhoModule.title).toContain('Pollard');
    expect(rhoModule.initialInput()).toEqual([]);
  });
});
