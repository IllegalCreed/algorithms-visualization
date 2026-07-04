// src/algorithms/mr.module.spec.ts —— 米勒-拉宾 module 对拍 oracle（C-090）
import { describe, it, expect } from 'vitest';
import { buildMrSteps, mrModule } from './mr.module';
import { MR_CASES, isPrimeBrute, powMod, decompose, mrChain } from './mr';
import { mrSources } from './mr.sources';

const POINTS = new Set(['init', 'decomp', 'pow', 'square', 'verdict', 'done']);

describe('mr.module', () => {
  const steps = buildMrSteps();
  const last = steps[steps.length - 1];

  it('TC-MR-MOD-01 真值对拍：41 通过=试除质数；561 合数=试除', () => {
    const r41 = mrChain(41, 2);
    const r561 = mrChain(561, 2);
    expect(r41.verdict).toBe('probable-prime');
    expect(isPrimeBrute(41)).toBe(true);
    expect(r561.verdict).toBe('composite');
    expect(isPrimeBrute(561)).toBe(false);
    expect(561).toBe(3 * 11 * 17);
  });

  it('TC-MR-MOD-02 费马被骗：2^560 ≡ 1 (mod 561) 而 MR 判合数', () => {
    expect(powMod(2, 560, 561)).toBe(1);
    expect(mrChain(561, 2).verdict).toBe('composite');
  });

  it('TC-MR-MOD-03 分解：40=2³·5、560=2⁴·35', () => {
    expect(decompose(41)).toEqual({ s: 3, d: 5 });
    expect(decompose(561)).toEqual({ s: 4, d: 35 });
  });

  it('TC-MR-MOD-04 链值：41 [32,40]；561 [263,166,67,1]', () => {
    expect(mrChain(41, 2).chain).toEqual([32, 40]);
    expect(mrChain(41, 2).reason).toBe('hit-minus-1');
    expect(mrChain(561, 2).chain).toEqual([263, 166, 67, 1]);
    expect(mrChain(561, 2).reason).toBe('nontrivial-sqrt');
  });

  it('TC-MR-MOD-05 每步执行点合法且带 matrix（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-MR-MOD-06 表结构 2×4 + 标签；init 全 null', () => {
    const init = steps[0];
    expect(init.matrix!.cells).toHaveLength(2);
    expect(init.matrix!.cells[0]).toHaveLength(4);
    expect(init.matrix!.colLabels).toEqual(['a^d', '平方¹', '平方²', '平方³']);
    expect(init.matrix!.rowLabels).toEqual(['41（真质数）', '561（伪装者）']);
    for (const row of init.matrix!.cells) for (const c of row) expect(c).toBeNull();
  });

  it('TC-MR-MOD-07 填格顺序与值 = 平方链', () => {
    const fills = steps.filter((s) => s.point === 'pow' || s.point === 'square');
    expect(fills.map((s) => s.matrix!.updatedCell)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ]);
    const vals = fills.map((s) => {
      const [r, c] = s.matrix!.updatedCell!;
      return s.matrix!.cells[r][c];
    });
    expect(vals).toEqual([32, 40, 263, 166, 67, 1]);
  });

  it('TC-MR-MOD-08 verdict sources：① [[0,1]]；② [[1,2],[1,3]]', () => {
    const verdicts = steps.filter((s) => s.point === 'verdict');
    expect(verdicts).toHaveLength(2);
    expect(verdicts[0].matrix!.sources).toEqual([[0, 1]]);
    expect(verdicts[1].matrix!.sources).toEqual([
      [1, 2],
      [1, 3],
    ]);
  });

  it('TC-MR-MOD-09 步数结构：12 步', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'decomp',
      'pow',
      'square',
      'verdict',
      'decomp',
      'pow',
      'square',
      'square',
      'square',
      'verdict',
      'done',
    ]);
  });

  it('TC-MR-MOD-10 caption：① 含 −1 通过；② 含非平凡与合数；done 含 1/4', () => {
    const verdicts = steps.filter((s) => s.point === 'verdict');
    expect(verdicts[0].caption).toContain('-1');
    expect(verdicts[0].caption).toContain('通过');
    expect(verdicts[1].caption).toContain('非平凡');
    expect(verdicts[1].caption).toContain('合数');
    expect(last.caption).toContain('1/4');
  });

  it('TC-MR-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(mrSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of mrSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['decomp', 'done', 'init', 'pow', 'square', 'verdict'].sort(),
      );
    }
  });

  it('TC-MR-MOD-12 module 元信息 title 含米勒-拉宾；initialInput()=[]', () => {
    expect(mrModule.title).toContain('米勒-拉宾');
    expect(mrModule.initialInput()).toEqual([]);
    expect(MR_CASES.map((c) => c.n)).toEqual([41, 561]);
  });
});
