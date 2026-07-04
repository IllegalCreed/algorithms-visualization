// src/algorithms/phi.module.spec.ts —— 欧拉函数 module 对拍 oracle（C-089）
import { describe, it, expect } from 'vitest';
import { buildPhiSteps, phiModule } from './phi.module';
import { PHI_N, phiBrute, phiBruteList, phiFormula, phiCrossSets } from './phi';
import { phiSources } from './phi.sources';

const POINTS = new Set(['init', 'find', 'cross', 'survive', 'done']);

describe('phi.module', () => {
  const steps = buildPhiSteps();
  const last = steps[steps.length - 1];
  const { crosses, survivors } = phiCrossSets();

  it('TC-PHI-MOD-01 真值对拍：phiBrute=4=phiFormula；factors=[2,3]', () => {
    expect(phiBrute(PHI_N)).toBe(4);
    expect(phiFormula(PHI_N).res).toBe(4);
    expect(phiFormula(PHI_N).factors).toEqual([2, 3]);
  });

  it('TC-PHI-MOD-02 每步执行点合法且带 sieve（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.sieve).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-PHI-MOD-03 网格造型 n=12 cols=6；init 全 unknown（1 也未定）', () => {
    const init = steps[0];
    expect(init.point).toBe('init');
    expect(init.sieve!.n).toBe(12);
    expect(init.sieve!.cols).toBe(6);
    for (let v = 1; v <= 12; v++) expect(init.sieve!.states[v]).toBe('unknown');
  });

  it('TC-PHI-MOD-04 find 步依次 current=2、3 + 试除语义', () => {
    const finds = steps.filter((s) => s.point === 'find');
    expect(finds).toHaveLength(2);
    expect(finds.map((s) => s.sieve!.current)).toEqual([2, 3]);
    for (const s of finds) expect(s.caption).toContain('质因子');
  });

  it('TC-PHI-MOD-05 cross 划格：p=2 全量、p=3 增量', () => {
    const cs = steps.filter((s) => s.point === 'cross');
    expect(cs).toHaveLength(2);
    expect(cs[0].sieve!.marking).toEqual([2, 4, 6, 8, 10, 12]);
    expect(cs[1].sieve!.marking).toEqual([3, 9]);
    expect(crosses.map((c) => c.newly)).toEqual([
      [2, 4, 6, 8, 10, 12],
      [3, 9],
    ]);
  });

  it('TC-PHI-MOD-06 res 记账链 12→6→4', () => {
    const cs = steps.filter((s) => s.point === 'cross');
    expect(crosses.map((c) => c.resAfter)).toEqual([6, 4]);
    expect(cs[0].vars.some((v) => `${v.value}`.includes('6'))).toBe(true);
    expect(cs[1].vars.some((v) => `${v.value}`.includes('4'))).toBe(true);
  });

  it('TC-PHI-MOD-07 survive：幸存者全绿、composite 恰 8 个', () => {
    const sv = steps.find((s) => s.point === 'survive')!;
    for (const v of [1, 5, 7, 11]) expect(sv.sieve!.states[v]).toBe('prime');
    const composites = sv.sieve!.states.filter((st) => st === 'composite');
    expect(composites).toHaveLength(8);
  });

  it('TC-PHI-MOD-08 幸存者 = gcd 暴力互质集合', () => {
    expect(survivors).toEqual(phiBruteList(PHI_N));
    expect(survivors).toEqual([1, 5, 7, 11]);
  });

  it('TC-PHI-MOD-09 步数结构：7 步 = init + 2×(find+cross) + survive + done', () => {
    expect(steps).toHaveLength(7);
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'find',
      'cross',
      'find',
      'cross',
      'survive',
      'done',
    ]);
  });

  it('TC-PHI-MOD-10 done caption 含 φ(12) = 4 与欧拉定理语义', () => {
    expect(last.caption).toContain('φ(12) = 4');
    expect(last.caption).toContain('欧拉定理');
  });

  it('TC-PHI-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(phiSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of phiSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['cross', 'done', 'find', 'init', 'survive'].sort(),
      );
    }
  });

  it('TC-PHI-MOD-12 module 元信息 title 含欧拉函数；initialInput()=[]', () => {
    expect(phiModule.title).toContain('欧拉函数');
    expect(phiModule.initialInput()).toEqual([]);
  });
});
