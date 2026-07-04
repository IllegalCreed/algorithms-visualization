// src/algorithms/maxflow.module.spec.ts —— 最大流 module 对拍 oracle（C-076，图算法第 9 页）
import { describe, it, expect } from 'vitest';
import { buildMaxFlowSteps, maxFlowModule } from './maxflow.module';
import { maxFlow } from './maxflow';
import { maxFlowSources } from './maxflow.sources';

const POINTS = new Set(['init', 'find', 'augment', 'done']);

describe('maxflow.module', () => {
  const steps = buildMaxFlowSteps();
  const last = steps[steps.length - 1];
  const oracle = maxFlow();

  it('TC-MF-MOD-01 末步 done + 最大流 = maxFlow().value = 6', () => {
    expect(last.point).toBe('done');
    expect(oracle.value).toBe(6);
  });

  it('TC-MF-MOD-02 每步执行点合法且带图轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.graph).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-MF-MOD-03 逐轮 find + augment：各恰 4 个（4 轮增广）', () => {
    expect(steps.filter((s) => s.point === 'find')).toHaveLength(4);
    expect(steps.filter((s) => s.point === 'augment')).toHaveLength(4);
  });

  it('TC-MF-MOD-04 增广路对拍：4 轮路径 = s→a→b→t / s→a→t / s→b→t / s→b→a→t', () => {
    expect(oracle.rounds.map((r) => r.path)).toEqual([
      [0, 1, 2, 3],
      [0, 1, 3],
      [0, 2, 3],
      [0, 2, 1, 3],
    ]);
    // find 步 caption 含对应路径串
    const finds = steps.filter((s) => s.point === 'find');
    expect(finds[0].caption).toContain('s→a→b→t');
    expect(finds[3].caption).toContain('s→b→a→t');
  });

  it('TC-MF-MOD-05 瓶颈序列 = [1,2,2,1]，累加 = 最大流 6', () => {
    const b = oracle.rounds.map((r) => r.bottleneck);
    expect(b).toEqual([1, 2, 2, 1]);
    expect(b.reduce((a, x) => a + x, 0)).toBe(6);
  });

  it('TC-MF-MOD-06 反向边反悔：第 4 轮 reverse 含原边 a→b（[1,2]）', () => {
    expect(oracle.rounds[3].reverse).toEqual([[1, 2]]);
  });

  it('TC-MF-MOD-07 流量守恒：末步 s 出边流量和 = 6 = t 入边流量和', () => {
    const lbl = last.graph!.edgeLabel!;
    const flowOf = (k: string) => Number(lbl[k].split('/')[0]);
    const outS = flowOf('0-1') + flowOf('0-2'); // s→a + s→b
    const inT = flowOf('1-3') + flowOf('2-3'); // a→t + b→t
    expect(outS).toBe(6);
    expect(inT).toBe(6);
    expect(lbl['1-2']).toBe('0/1'); // a→b 误走的流已全部退回
  });

  it('TC-MF-MOD-08 反向边高亮：第 4 轮 find 步 edgeClass 含一条 reverse', () => {
    const finds = steps.filter((s) => s.point === 'find');
    const ec = finds[3].graph!.edgeClass!;
    expect(Object.values(ec)).toContain('reverse');
    expect(ec['1-2']).toBe('reverse'); // a→b 被反向退流
  });

  it('TC-MF-MOD-09 最小割高亮：done 步标记割边 s→a、s→b', () => {
    expect(oracle.cutEdges).toEqual([
      [0, 1],
      [0, 2],
    ]);
    const ec = last.graph!.edgeClass!;
    expect(ec['0-1']).toBeTruthy();
    expect(ec['0-2']).toBeTruthy();
  });

  it('TC-MF-MOD-10 done 步 caption 含最大流 6 与「最小割」', () => {
    expect(last.caption).toContain('6');
    expect(last.caption).toMatch(/最小割|割/);
  });

  it('TC-MF-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(maxFlowSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of maxFlowSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['augment', 'done', 'find', 'init'].sort());
    }
  });

  it('TC-MF-MOD-12 module 元信息 title 含最大流/Ford；initialInput()=[]', () => {
    expect(maxFlowModule.title).toMatch(/最大流|Ford/);
    expect(maxFlowModule.initialInput()).toEqual([]);
  });
});
