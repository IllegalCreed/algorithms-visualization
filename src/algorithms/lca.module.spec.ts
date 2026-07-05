// src/algorithms/lca.module.spec.ts —— LCA 倍增 module 对拍 oracle（C-104）
import { describe, it, expect } from 'vitest';
import { buildLcaSteps, lcaModule } from './lca.module';
import { LCA_N, buildUp, lcaTrace, bruteLca } from './lca';
import { lcaSources } from './lca.sources';

const POINTS = new Set(['init', 'build', 'align', 'jump', 'answer', 'done']);

describe('lca.module', () => {
  const steps = buildLcaSteps();
  const last = steps[steps.length - 1];
  const { depth, up } = buildUp();

  it('TC-LCA-MOD-01 对拍：两查询 + 64 全对 = 暴力爬父链', () => {
    expect(lcaTrace(7, 4).answer).toBe(1);
    expect(lcaTrace(6, 5).answer).toBe(0);
    for (let u = 0; u < LCA_N; u++)
      for (let v = 0; v < LCA_N; v++) expect(lcaTrace(u, v).answer).toBe(bruteLca(u, v));
  });

  it('TC-LCA-MOD-02 倍增表：depth/up⁰/up¹/up² 全等', () => {
    expect(depth).toEqual([0, 1, 1, 2, 2, 2, 3, 4]);
    expect(up[0]).toEqual([-1, 0, 0, 1, 1, 2, 3, 6]);
    expect(up[1]).toEqual([-1, -1, -1, 0, 0, 0, 1, 3]);
    expect(up[2]).toEqual([-1, -1, -1, -1, -1, -1, -1, 0]);
  });

  it('TC-LCA-MOD-03 查询轨迹：(7,4) 对齐后全 same；(6,5) k=0 双跳', () => {
    const t1 = lcaTrace(7, 4);
    expect(t1.aligns).toEqual([{ from: 7, to: 3, k: 1 }]);
    expect(t1.checks.map((c) => [c.k, c.same])).toEqual([
      [2, true],
      [1, true],
      [0, true],
    ]);
    const t2 = lcaTrace(6, 5);
    expect(t2.aligns).toEqual([{ from: 6, to: 3, k: 0 }]);
    const c0 = t2.checks[t2.checks.length - 1];
    expect([c0.k, c0.same, c0.uTo, c0.vTo]).toEqual([0, false, 1, 2]);
  });

  it('TC-LCA-MOD-04 步合法：point + matrix + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-LCA-MOD-05 步数结构：11 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'build',
      'build',
      'build',
      'align',
      'jump',
      'answer',
      'align',
      'jump',
      'answer',
      'done',
    ]);
  });

  it('TC-LCA-MOD-06 init 表：8×4 全 null + 标签', () => {
    const init = steps[0];
    expect(init.matrix!.cells).toHaveLength(8);
    for (const row of init.matrix!.cells) {
      expect(row).toHaveLength(4);
      for (const c of row) expect(c).toBeNull();
    }
    expect(init.matrix!.rowLabels).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    expect(init.matrix!.colLabels).toEqual(['depth', 'up⁰', 'up¹', 'up²']);
  });

  it('TC-LCA-MOD-07 build 步：三列逐填 + 递推示例 sources', () => {
    const builds = steps.filter((s) => s.point === 'build');
    expect(builds[0].matrix!.cells[7]).toEqual([4, 6, null, null]);
    expect(builds[0].matrix!.cells[0]).toEqual([0, null, null, null]);
    expect(builds[1].matrix!.cells[7][2]).toBe(3);
    expect(builds[1].matrix!.cells[3][2]).toBe(0);
    expect(builds[1].matrix!.sources).toEqual([
      [7, 1],
      [6, 1],
    ]);
    expect(builds[2].matrix!.cells[7][3]).toBe(0);
    expect(builds[2].matrix!.sources).toEqual([
      [7, 2],
      [3, 2],
    ]);
  });

  it('TC-LCA-MOD-08 align 步：sources 指被用跳表格 + 二进制拆解', () => {
    const aligns = steps.filter((s) => s.point === 'align');
    expect(aligns[0].matrix!.sources).toEqual([[7, 2]]);
    expect(aligns[0].caption).toContain('二进制');
    expect(aligns[1].matrix!.sources).toEqual([[6, 1]]);
    expect(aligns[1].caption).toContain('深度差');
  });

  it('TC-LCA-MOD-09 jump 步：①全程不跳 + 越过语义；②双跳 sources', () => {
    const jumps = steps.filter((s) => s.point === 'jump');
    expect(jumps[0].caption).toContain('不跳');
    expect(jumps[0].caption).toContain('越过');
    expect(jumps[1].matrix!.sources).toEqual([
      [3, 1],
      [5, 1],
    ]);
    expect(jumps[1].caption).toContain('双跳');
  });

  it('TC-LCA-MOD-10 answer/done：父格 sources + 复杂度与树上距离', () => {
    const answers = steps.filter((s) => s.point === 'answer');
    expect(answers[0].matrix!.sources).toEqual([[3, 1]]);
    expect(answers[0].caption).toContain('LCA(7, 4) = 1');
    expect(answers[1].matrix!.sources).toEqual([[1, 1]]);
    expect(answers[1].caption).toContain('LCA(6, 5) = 0');
    expect(last.caption).toContain('O(log n)');
    expect(last.caption).toContain('树上距离');
  });

  it('TC-LCA-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(lcaSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of lcaSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['align', 'answer', 'build', 'done', 'init', 'jump'].sort(),
      );
    }
  });

  it('TC-LCA-MOD-12 元信息：title 含 LCA；initialInput=[]', () => {
    expect(lcaModule.title).toContain('LCA');
    expect(lcaModule.initialInput()).toEqual([]);
  });
});
