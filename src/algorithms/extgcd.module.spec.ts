// src/algorithms/extgcd.module.spec.ts —— 扩展欧几里得 module 对拍 oracle（C-086）
import { describe, it, expect } from 'vitest';
import { buildExtGcdSteps, extGcdModule } from './extgcd.module';
import { EG_A, EG_B, extGcd, egRows } from './extgcd';
import { extGcdSources } from './extgcd.sources';

const POINTS = new Set(['init', 'down', 'base', 'up', 'done']);

describe('extgcd.module', () => {
  const steps = buildExtGcdSteps();
  const last = steps[steps.length - 1];
  const rows = egRows();

  it('TC-EG-MOD-01 末步 done + Bézout {6,−1,2} 且行 0 x/y 正确', () => {
    expect(last.point).toBe('done');
    expect(extGcd(EG_A, EG_B)).toEqual({ g: 6, x: -1, y: 2 });
    expect(EG_A * -1 + EG_B * 2).toBe(6);
    expect(last.matrix!.cells[0][3]).toBe(-1);
    expect(last.matrix!.cells[0][4]).toBe(2);
  });

  it('TC-EG-MOD-02 每步执行点合法且带 matrix（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-EG-MOD-03 表结构 5 列 × 4 行 + 标签', () => {
    expect(last.matrix!.cells).toHaveLength(4);
    expect(last.matrix!.cells[0]).toHaveLength(5);
    expect(last.matrix!.colLabels).toEqual(['a', 'b', 'q', 'x', 'y']);
    expect(last.matrix!.rowLabels).toEqual(['第0层', '第1层', '第2层', '基例']);
  });

  it('TC-EG-MOD-04 下行 3 步后 a,b,q 就位、x,y 未填', () => {
    const afterDown = steps.filter((s) => s.point === 'down').at(-1)!;
    const c = afterDown.matrix!.cells;
    expect([c[0][0], c[0][1], c[0][2]]).toEqual([30, 18, 1]);
    expect([c[1][0], c[1][1], c[1][2]]).toEqual([18, 12, 1]);
    expect([c[2][0], c[2][1], c[2][2]]).toEqual([12, 6, 2]);
    expect(c[0][3]).toBeNull();
    expect(c[2][4]).toBeNull();
  });

  it('TC-EG-MOD-05 基例行 [6,0,null,1,0] + caption 恒等', () => {
    const base = steps.find((s) => s.point === 'base')!;
    expect(base.matrix!.cells[3]).toEqual([6, 0, null, 1, 0]);
    expect(base.caption).toContain('1, 0');
  });

  it('TC-EG-MOD-06 回代依次填 (0,1)/(1,−1)/(−1,2)', () => {
    const ups = steps.filter((s) => s.point === 'up');
    expect(ups).toHaveLength(3);
    expect([ups[0].matrix!.cells[2][3], ups[0].matrix!.cells[2][4]]).toEqual([0, 1]);
    expect([ups[1].matrix!.cells[1][3], ups[1].matrix!.cells[1][4]]).toEqual([1, -1]);
    expect([ups[2].matrix!.cells[0][3], ups[2].matrix!.cells[0][4]]).toEqual([-1, 2]);
  });

  it('TC-EG-MOD-07 up 步 sources 指向下一行 x/y', () => {
    const ups = steps.filter((s) => s.point === 'up');
    ups.forEach((s, k) => {
      const i = 2 - k;
      expect(s.matrix!.sources).toEqual([
        [i + 1, 3],
        [i + 1, 4],
      ]);
    });
  });

  it('TC-EG-MOD-08 每层恒等 a·x+b·y=6', () => {
    for (const r of rows) {
      expect(r.a * r.x + r.b * r.y).toBe(6);
    }
  });

  it('TC-EG-MOD-09 结构计数 down3/base1/up3 + 高亮落当前行', () => {
    expect(steps.filter((s) => s.point === 'down')).toHaveLength(3);
    expect(steps.filter((s) => s.point === 'base')).toHaveLength(1);
    expect(steps.filter((s) => s.point === 'up')).toHaveLength(3);
    for (const s of steps) {
      if (s.matrix!.active) expect(s.matrix!.active[0]).toBeLessThan(4);
    }
  });

  it('TC-EG-MOD-10 done caption 含 −1、2 与模逆元语义', () => {
    expect(last.caption).toContain('-1');
    expect(last.caption).toContain('2');
    expect(last.caption).toContain('模逆元');
  });

  it('TC-EG-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(extGcdSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of extGcdSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['base', 'done', 'down', 'init', 'up'].sort(),
      );
    }
  });

  it('TC-EG-MOD-12 module 元信息 title 含扩展欧几里得；initialInput()=[]', () => {
    expect(extGcdModule.title).toContain('扩展欧几里得');
    expect(extGcdModule.initialInput()).toEqual([]);
  });
});
