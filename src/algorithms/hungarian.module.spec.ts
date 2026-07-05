// src/algorithms/hungarian.module.spec.ts —— 匈牙利算法 module 对拍 oracle（C-097）
import { describe, it, expect } from 'vitest';
import { buildHungarianSteps, hungarianModule } from './hungarian.module';
import { hungarianTrace, bruteMaxMatching } from './hungarian';
import { hungarianSources } from './hungarian.sources';

const POINTS = new Set(['init', 'try', 'match', 'fail', 'done']);

describe('hungarian.module', () => {
  const steps = buildHungarianSteps();
  const last = steps[steps.length - 1];
  const tr = hungarianTrace();

  it('TC-HG-MOD-01 对拍：匹配数 3 = 暴力枚举；matchR=[1,0,2]', () => {
    expect(tr.count).toBe(3);
    expect(tr.count).toBe(bruteMaxMatching());
    expect(tr.matchR).toEqual([1, 0, 2]);
  });

  it('TC-HG-MOD-02 事件流全等（含增广双 match 与死路双 fail）', () => {
    expect(tr.events.map((e) => [e.type, e.u, e.v ?? -1])).toEqual(
      [
        ['round', 0, -1],
        ['try', 0, 0],
        ['match', 0, 0],
        ['round', 1, -1],
        ['try', 1, 0],
        ['try', 0, 1],
        ['match', 0, 1],
        ['match', 1, 0],
        ['round', 2, -1],
        ['try', 2, 1],
        ['try', 0, 0],
        ['fail', 1, -1],
        ['fail', 0, -1],
        ['try', 2, 2],
        ['match', 2, 2],
      ].map((e) => [e[0], e[1], e[2] ?? -1]),
    );
  });

  it('TC-HG-MOD-03 步合法：point + graph + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.graph).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-HG-MOD-04 步数结构：12 步 point 序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'try',
      'match',
      'try',
      'try',
      'match',
      'try',
      'try',
      'fail',
      'try',
      'match',
      'done',
    ]);
  });

  it('TC-HG-MOD-05 try 步：试探边 current + activeNode + 冲突让路语义', () => {
    const tries = steps.filter((s) => s.point === 'try');
    expect(tries[0].graph!.edgeClass!['0-3']).toBe('current');
    expect(tries[0].graph!.activeNode).toBe(0);
    expect(tries[1].caption).toContain('让路'); // L2 撞 R1
  });

  it('TC-HG-MOD-06 match 步：匹配边 mst；增广步双边同时绿', () => {
    const matches = steps.filter((s) => s.point === 'match');
    expect(matches[0].graph!.edgeClass!['0-3']).toBe('mst');
    // 增广步：L1-R2 与 L2-R1 同时 mst
    expect(matches[1].graph!.edgeClass!['0-4']).toBe('mst');
    expect(matches[1].graph!.edgeClass!['1-3']).toBe('mst');
    expect(matches[1].caption).toContain('增广');
  });

  it('TC-HG-MOD-07 fail 步：死路链 rejected + 回退语义', () => {
    const fail = steps.find((s) => s.point === 'fail')!;
    expect(fail.caption).toContain('死路');
    const classes = Object.values(fail.graph!.edgeClass!);
    expect(classes).toContain('rejected');
  });

  it('TC-HG-MOD-08 badge：match 后右点显示配对、翻转后更新', () => {
    const matches = steps.filter((s) => s.point === 'match');
    expect(matches[0].graph!.nodeBadge![3]).toBe('←L1');
    expect(matches[1].graph!.nodeBadge![3]).toBe('←L2'); // 翻转后 R1 归 L2
    expect(matches[1].graph!.nodeBadge![4]).toBe('←L1');
  });

  it('TC-HG-MOD-09 doneNodes：终局 6 点全 done、中途递增', () => {
    const matches = steps.filter((s) => s.point === 'match');
    expect(matches[0].graph!.doneNodes).toHaveLength(2);
    expect(matches[1].graph!.doneNodes).toHaveLength(4);
    expect(matches[2].graph!.doneNodes).toHaveLength(6);
  });

  it('TC-HG-MOD-10 done caption 含 3 与 König/最大流语义', () => {
    expect(last.caption).toContain('3');
    expect(last.caption).toContain('最大流');
  });

  it('TC-HG-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(hungarianSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of hungarianSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'fail', 'init', 'match', 'try'].sort(),
      );
    }
  });

  it('TC-HG-MOD-12 元信息：title 含匈牙利；两列布局', () => {
    expect(hungarianModule.title).toContain('匈牙利');
    expect(hungarianModule.initialInput()).toEqual([]);
    const g = steps[0].graph!;
    for (let i = 0; i < 3; i++) {
      expect(g.vertices[i].x).toBeLessThan(g.vertices[i + 3].x);
    }
  });
});
