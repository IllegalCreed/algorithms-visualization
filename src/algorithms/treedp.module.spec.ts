// src/algorithms/treedp.module.spec.ts —— 树形 DP module 对拍 oracle（C-100）
import { describe, it, expect } from 'vitest';
import { buildTreeDpSteps, treeDpModule } from './treedp.module';
import { TD_VALS, treeDpFills, bruteRob } from './treedp';
import { treeDpSources } from './treedp.sources';

const POINTS = new Set(['init', 'leaf', 'sel', 'not', 'best', 'done']);

describe('treedp.module', () => {
  const steps = buildTreeDpSteps(TD_VALS);
  const last = steps[steps.length - 1];
  const { order, fills, best } = treeDpFills();

  it('TC-TD-MOD-01 对拍：max(根两态)=14=bruteRob；根 (13,14)', () => {
    expect(best).toBe(14);
    expect(best).toBe(bruteRob());
    const root = fills.find((f) => f.i === 0)!;
    expect([root.sel, root.notv]).toEqual([13, 14]);
  });

  it('TC-TD-MOD-02 后序 fills 全等', () => {
    expect(order).toEqual([3, 4, 1, 2, 0]);
    expect(fills.map((f) => [f.i, f.sel, f.notv])).toEqual([
      [3, 3, 0],
      [4, 6, 0],
      [1, 1, 9],
      [2, 5, 0],
      [0, 13, 14],
    ]);
  });

  it('TC-TD-MOD-03 步合法：point + matrix + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-TD-MOD-04 步数结构：10 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'leaf',
      'leaf',
      'sel',
      'not',
      'leaf',
      'sel',
      'not',
      'best',
      'done',
    ]);
  });

  it('TC-TD-MOD-05 init 表：5×2 全 null + 树位置 rowLabels', () => {
    const init = steps[0];
    expect(init.matrix!.cells).toHaveLength(5);
    for (const row of init.matrix!.cells) {
      expect(row).toHaveLength(2);
      for (const c of row) expect(c).toBeNull();
    }
    expect(init.matrix!.rowLabels).toEqual(['根 4', 'L 1', 'R 5', 'LL 3', 'LR 6']);
    expect(init.matrix!.colLabels).toEqual(['选', '不选']);
  });

  it('TC-TD-MOD-06 leaf 步：一步双格 (v,0)、后序跳行', () => {
    const leaves = steps.filter((s) => s.point === 'leaf');
    expect(leaves.map((s) => s.matrix!.updatedCell![0])).toEqual([3, 4, 2]);
    expect(leaves[0].matrix!.cells[3]).toEqual([3, 0]);
    expect(leaves[2].matrix!.cells[2]).toEqual([5, 0]);
  });

  it('TC-TD-MOD-07 sel sources：孩子的不选格', () => {
    const sels = steps.filter((s) => s.point === 'sel');
    expect(sels[0].matrix!.sources).toEqual([
      [3, 1],
      [4, 1],
    ]);
    expect(sels[1].matrix!.sources).toEqual([
      [1, 1],
      [2, 1],
    ]);
  });

  it('TC-TD-MOD-08 not sources：孩子四格', () => {
    const nots = steps.filter((s) => s.point === 'not');
    expect(nots[0].matrix!.sources).toEqual([
      [3, 0],
      [3, 1],
      [4, 0],
      [4, 1],
    ]);
    expect(nots[1].matrix!.sources).toEqual([
      [1, 0],
      [1, 1],
      [2, 0],
      [2, 1],
    ]);
  });

  it('TC-TD-MOD-09 best 步：根两格 + max 14', () => {
    const b = steps.find((s) => s.point === 'best')!;
    expect(b.matrix!.sources).toEqual([
      [0, 0],
      [0, 1],
    ]);
    expect(b.caption).toContain('max');
    expect(b.caption).toContain('14');
  });

  it('TC-TD-MOD-10 done caption 含 14 与后序语义', () => {
    expect(last.caption).toContain('14');
    expect(last.caption).toContain('后序');
  });

  it('TC-TD-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(treeDpSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of treeDpSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['best', 'done', 'init', 'leaf', 'not', 'sel'].sort(),
      );
    }
  });

  it('TC-TD-MOD-12 元信息：title 含树形；initialInput=TD_VALS', () => {
    expect(treeDpModule.title).toContain('树形');
    expect(treeDpModule.initialInput()).toEqual(TD_VALS);
  });
});
