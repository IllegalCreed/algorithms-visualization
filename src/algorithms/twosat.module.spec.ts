// src/algorithms/twosat.module.spec.ts —— 2-SAT module 对拍 oracle（C-074，图算法第 8 页）
import { describe, it, expect } from 'vitest';
import { buildTwoSatSteps, twoSatModule } from './twosat.module';
import { TS_N, TS_NL, twoSatImplications, twoSatTarjan, twoSatSolve } from './twosat';
import { twoSatSources } from './twosat.sources';

const POINTS = new Set(['init', 'clause', 'scc', 'check', 'assign', 'done']);

describe('twosat.module', () => {
  const steps = buildTwoSatSteps();
  const last = steps[steps.length - 1];
  const { comp } = twoSatTarjan();
  const impl = twoSatImplications();

  it('TC-2SAT-MOD-01 末步 done + 赋值 = twoSatSolve().assign（A 真/B 假/C 真）', () => {
    expect(last.point).toBe('done');
    const { sat, assign } = twoSatSolve();
    expect(sat).toBe(true);
    expect(assign).toEqual([true, false, true]);
    // 末步 badge 在正文字节点上 = 各变量真值
    const badge = last.graph!.nodeBadge!;
    for (let v = 0; v < TS_N; v++) {
      expect(badge[2 * v]).toBe(assign[v] ? '真' : '假');
    }
  });

  it('TC-2SAT-MOD-02 每步执行点合法且带图轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.graph).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-2SAT-MOD-03 蕴含图成形：init 0 边、末步 8 边', () => {
    expect(steps[0].point).toBe('init');
    expect(steps[0].graph!.edges).toHaveLength(0);
    expect(last.graph!.edges).toHaveLength(impl.length);
    expect(impl).toHaveLength(8);
  });

  it('TC-2SAT-MOD-04 clause 步恰 4 个，边数累计 2,4,6,8（每子句 +2）', () => {
    const clauseSteps = steps.filter((s) => s.point === 'clause');
    expect(clauseSteps).toHaveLength(4);
    expect(clauseSteps.map((s) => s.graph!.edges.length)).toEqual([2, 4, 6, 8]);
    // 每 clause 步高亮恰 2 条 current 边
    for (const s of clauseSteps) {
      const cur = Object.values(s.graph!.edgeClass ?? {}).filter((c) => c === 'current');
      expect(cur).toHaveLength(2);
    }
  });

  it('TC-2SAT-MOD-05 scc 步恰 4 个，nodeGroup 已上色数单调不减', () => {
    const sccSteps = steps.filter((s) => s.point === 'scc');
    expect(sccSteps).toHaveLength(4);
    const colored = sccSteps.map((s) => s.graph!.nodeGroup!.filter((g) => g != null).length);
    for (let i = 1; i < colored.length; i++)
      expect(colored[i]).toBeGreaterThanOrEqual(colored[i - 1]);
    expect(colored[colored.length - 1]).toBe(TS_NL); // 末个 scc 步全部上色
  });

  it('TC-2SAT-MOD-06 末步 nodeGroup = comp = [0,2,2,0,1,3]', () => {
    expect(last.graph!.nodeGroup).toEqual(comp);
    expect(comp).toEqual([0, 2, 2, 0, 1, 3]);
  });

  it('TC-2SAT-MOD-07 check 步恰 3 个，第 i 个 checkPair=[2i,2i+1]', () => {
    const checkSteps = steps.filter((s) => s.point === 'check');
    expect(checkSteps).toHaveLength(TS_N);
    checkSteps.forEach((s, i) => {
      expect(s.graph!.checkPair).toEqual([2 * i, 2 * i + 1]);
    });
  });

  it('TC-2SAT-MOD-08 判定可满足：每对 x/¬x 不同组', () => {
    for (let v = 0; v < TS_N; v++) {
      expect(comp[2 * v]).not.toBe(comp[2 * v + 1]);
    }
  });

  it('TC-2SAT-MOD-09 assign 步恰 3 个，真值 = comp[2v] < comp[2v+1]', () => {
    const assignSteps = steps.filter((s) => s.point === 'assign');
    expect(assignSteps).toHaveLength(TS_N);
    const { assign } = twoSatSolve();
    for (let v = 0; v < TS_N; v++) {
      expect(assign[v]).toBe(comp[2 * v] < comp[2 * v + 1]);
    }
  });

  it('TC-2SAT-MOD-10 done 步 caption 含解值（可满足 + 变量真值）', () => {
    expect(last.caption).toContain('可满足');
    expect(last.caption).toContain('A=真');
    expect(last.caption).toContain('B=假');
    expect(last.caption).toContain('C=真');
  });

  it('TC-2SAT-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(twoSatSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of twoSatSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      // 六个执行点全覆盖
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['assign', 'check', 'clause', 'done', 'init', 'scc'].sort(),
      );
    }
  });

  it('TC-2SAT-MOD-12 module 元信息 title 含 2-SAT；initialInput()=[]', () => {
    expect(twoSatModule.title).toContain('2-SAT');
    expect(twoSatModule.initialInput()).toEqual([]);
  });
});
