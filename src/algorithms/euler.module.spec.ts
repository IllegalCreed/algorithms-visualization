// src/algorithms/euler.module.spec.ts —— 欧拉路径 Hierholzer module 对拍 oracle（C-105）
import { describe, it, expect } from 'vitest';
import { buildEulerSteps, eulerModule } from './euler.module';
import { EULER_EDGES, eulerTrace, bruteEulerPath, isValidEulerPath } from './euler';
import { eulerSources } from './euler.sources';

const POINTS = new Set(['init', 'check', 'walk', 'back', 'done']);

describe('euler.module', () => {
  const steps = buildEulerSteps();
  const last = steps[steps.length - 1];
  const tr = eulerTrace();

  it('TC-EU-MOD-01 对拍：栈法路径与暴力搜路都合法且起终=奇度点', () => {
    expect(tr.path).toEqual([1, 3, 4, 2, 1, 0, 2, 3]);
    expect(isValidEulerPath(tr.path)).toBe(true);
    const brute = bruteEulerPath();
    expect(isValidEulerPath(brute)).toBe(true);
    expect(new Set([brute[0], brute[brute.length - 1]])).toEqual(new Set(tr.odd));
  });

  it('TC-EU-MOD-02 判定：度数/奇度点/起点', () => {
    expect(tr.deg).toEqual([2, 3, 4, 3, 2]);
    expect(tr.odd).toEqual([1, 3]);
    expect(tr.start).toBe(1);
  });

  it('TC-EU-MOD-03 事件流：walk×4 → back → walk×3 → back×7；首 back 后栈顶 2 有余边', () => {
    expect(tr.events.map((e) => e.type)).toEqual([
      'walk',
      'walk',
      'walk',
      'walk',
      'back',
      'walk',
      'walk',
      'walk',
      'back',
      'back',
      'back',
      'back',
      'back',
      'back',
      'back',
    ]);
    const firstBack = tr.events[4];
    expect(firstBack.type).toBe('back');
    if (firstBack.type === 'back') {
      expect(firstBack.node).toBe(3);
      expect(firstBack.stack[firstBack.stack.length - 1]).toBe(2);
    }
  });

  it('TC-EU-MOD-04 步合法：point + graph + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.graph).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-EU-MOD-05 步数结构：12 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'check',
      'walk',
      'walk',
      'walk',
      'walk',
      'back',
      'walk',
      'walk',
      'walk',
      'back',
      'done',
    ]);
  });

  it('TC-EU-MOD-06 check 步：徽标=度数 + 奇度定理', () => {
    const c = steps[1];
    expect(c.graph!.nodeBadge).toEqual(['2', '3', '4', '3', '2']);
    expect(c.caption).toContain('奇度');
    expect(c.graph!.checkPair).toEqual([1, 3]);
  });

  it('TC-EU-MOD-07 walk 步：消边渐增 + 徽标递减 + 第 4 walk 后 3 号清零', () => {
    const w4 = steps[5];
    expect(w4.graph!.nodeBadge![3]).toBe('0');
    const cls = Object.values(w4.graph!.edgeClass!);
    expect(cls.filter((c) => c === 'mst' || c === 'current')).toHaveLength(4);
    const w1 = steps[2];
    expect(Object.values(w1.graph!.edgeClass!)).toHaveLength(1);
  });

  it('TC-EU-MOD-08 back 步①：卡住 + 栈顶余边 + 路径收下 3', () => {
    const b = steps[6];
    expect(b.caption).toContain('卡住');
    expect(b.caption).toContain('余边');
    expect(b.graph!.activeNode).toBe(2);
    const pathVar = b.vars.find((v) => v.name.includes('路径'));
    expect(pathVar!.value).toContain('3');
  });

  it('TC-EU-MOD-09 back 步②：清栈 + 全消边 + 反转', () => {
    const b = steps[10];
    expect(Object.values(b.graph!.edgeClass!)).toHaveLength(EULER_EDGES.length);
    expect(Object.values(b.graph!.edgeClass!).every((c) => c === 'mst')).toBe(true);
    expect(b.graph!.stackNodes).toEqual([]);
    expect(b.caption).toContain('反转');
  });

  it('TC-EU-MOD-10 done：O(E) + 一笔画 + 全路径', () => {
    expect(last.caption).toContain('O(E)');
    expect(last.caption).toContain('一笔画');
    expect(last.caption).toContain('1 → 3 → 4 → 2 → 1 → 0 → 2 → 3');
  });

  it('TC-EU-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(eulerSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of eulerSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['back', 'check', 'done', 'init', 'walk'].sort(),
      );
    }
  });

  it('TC-EU-MOD-12 元信息：title 含欧拉；initialInput=[]', () => {
    expect(eulerModule.title).toContain('欧拉');
    expect(eulerModule.initialInput()).toEqual([]);
  });
});
