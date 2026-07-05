// src/algorithms/digitdp.module.spec.ts —— 数位 DP module 对拍 oracle（C-101）
import { describe, it, expect } from 'vitest';
import { buildDigitDpSteps, digitDpModule } from './digitdp.module';
import { digitWalk, bruteCount } from './digitdp';
import { digitDpSources } from './digitdp.sources';

const POINTS = new Set(['init', 'free', 'tight', 'broken', 'sum', 'done']);

describe('digitdp.module', () => {
  const steps = buildDigitDpSteps();
  const last = steps[steps.length - 1];
  const { rows, total, ans } = digitWalk();

  it('TC-DD-MOD-01 对拍：ans=197=bruteCount', () => {
    expect(ans).toBe(197);
    expect(ans).toBe(bruteCount());
    expect(total).toBe(198);
  });

  it('TC-DD-MOD-02 走位行全等', () => {
    expect(rows.map((r) => [r.d, r.cnt, r.pow, r.sub, r.tightOk])).toEqual([
      [2, 2, 81, 162, true],
      [4, 4, 9, 36, false],
      [5, null, null, null, null],
    ]);
  });

  it('TC-DD-MOD-03 步合法：point + matrix + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-DD-MOD-04 步数结构：8 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'free',
      'tight',
      'free',
      'tight',
      'broken',
      'sum',
      'done',
    ]);
  });

  it('TC-DD-MOD-05 init 表：4×4 全 null + 标签', () => {
    const init = steps[0];
    expect(init.matrix!.cells).toHaveLength(4);
    for (const row of init.matrix!.cells) {
      expect(row).toHaveLength(4);
      for (const c of row) expect(c).toBeNull();
    }
    expect(init.matrix!.rowLabels).toEqual(['百位 2', '十位 4', '个位 5', '合计']);
    expect(init.matrix!.colLabels).toEqual(['位上', '可选数', '后缀 9^k', '小计']);
  });

  it('TC-DD-MOD-06 free 步：行填齐 + 小计格 + caption', () => {
    const frees = steps.filter((s) => s.point === 'free');
    expect(frees[0].matrix!.cells[0]).toEqual([2, 2, 81, 162]);
    expect(frees[0].matrix!.updatedCell).toEqual([0, 3]);
    expect(frees[0].caption).toContain('162');
    expect(frees[1].matrix!.cells[1]).toEqual([4, 4, 9, 36]);
    expect(frees[1].caption).toContain('36');
  });

  it('TC-DD-MOD-07 tight 步：位上格 + 断裂 caption', () => {
    const tights = steps.filter((s) => s.point === 'tight');
    expect(tights[0].matrix!.active).toEqual([0, 0]);
    expect(tights[0].caption).toContain('贴着');
    expect(tights[1].caption).toContain('断裂');
  });

  it('TC-DD-MOD-08 broken 步：个位行仅位上 + 跳过语义', () => {
    const b = steps.find((s) => s.point === 'broken')!;
    expect(b.matrix!.cells[2]).toEqual([5, null, null, null]);
    expect(b.caption).toContain('跳过');
  });

  it('TC-DD-MOD-09 sum 步：合计 198 + sources 两小计 + 197', () => {
    const s = steps.find((st) => st.point === 'sum')!;
    expect(s.matrix!.cells[3][3]).toBe(198);
    expect(s.matrix!.sources).toEqual([
      [0, 3],
      [1, 3],
    ]);
    expect(s.caption).toContain('197');
  });

  it('TC-DD-MOD-10 done caption 含 197 与位数语义', () => {
    expect(last.caption).toContain('197');
    expect(last.caption).toContain('位数');
  });

  it('TC-DD-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(digitDpSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of digitDpSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['broken', 'done', 'free', 'init', 'sum', 'tight'].sort(),
      );
    }
  });

  it('TC-DD-MOD-12 元信息：title 含数位；initialInput=[]', () => {
    expect(digitDpModule.title).toContain('数位');
    expect(digitDpModule.initialInput()).toEqual([]);
  });
});
