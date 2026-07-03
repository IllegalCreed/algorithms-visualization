// src/algorithms/bellman-ford.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildBellmanFordSteps, bellmanFordModule } from './bellman-ford.module';
import { bellmanFordTrace, BF_EDGES } from './bellman-ford';
import type { BellmanFordExecPoint, Step } from '@/components/player/types';

const steps = () => buildBellmanFordSteps();
const cnt = (ss: Step<BellmanFordExecPoint>[], p: BellmanFordExecPoint) =>
  ss.filter((s) => s.point === p).length;
const numBadge = (b: string | null) => (b === '∞' || b === null ? Infinity : Number(b));

describe('bellman-ford.module', () => {
  it('TC-BELLMAN-MOD-01 末步 nodeBadge 数值 = oracle dist [0,4,1,3,1]', () => {
    const ss = steps();
    const last = ss[ss.length - 1];
    expect(last.point).toBe('done');
    const nums = last.graph!.nodeBadge!.map(numBadge);
    expect(nums).toEqual(bellmanFordTrace().dist);
    expect(nums).toEqual([0, 4, 1, 3, 1]);
  });

  it('TC-BELLMAN-MOD-02 每步执行点合法且携带有向图轨（array 空）', () => {
    const ok = new Set<BellmanFordExecPoint>([
      'init',
      'roundStart',
      'relaxUpdate',
      'relaxSkip',
      'done',
    ]);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.graph).toBeDefined();
      expect(s.array).toEqual([]);
      expect(s.graph!.directed).toBe(true);
    }
  });

  it('TC-BELLMAN-MOD-03 V−1 轮：#roundStart == 4', () => {
    expect(cnt(steps(), 'roundStart')).toBe(4);
  });

  it('TC-BELLMAN-MOD-04 松弛统计：#relaxUpdate==8、#relaxSkip==20、和==28', () => {
    const ss = steps();
    expect(cnt(ss, 'relaxUpdate')).toBe(8);
    expect(cnt(ss, 'relaxSkip')).toBe(20);
    expect(cnt(ss, 'relaxUpdate') + cnt(ss, 'relaxSkip')).toBe(28);
  });

  it('TC-BELLMAN-MOD-05 init 步 dist[A]=0、其余 ∞', () => {
    const init = steps().find((s) => s.point === 'init')!;
    expect(init.graph!.nodeBadge![0]).toBe('0');
    expect(init.graph!.nodeBadge!.slice(1)).toEqual(['∞', '∞', '∞', '∞']);
  });

  it('TC-BELLMAN-MOD-06 逐轮 dist：各 roundStart 步 nodeBadge = 进入该轮时 dist', () => {
    const rounds = steps()
      .filter((s) => s.point === 'roundStart')
      .map((s) => s.graph!.nodeBadge!.map(numBadge));
    expect(rounds).toEqual([
      [0, Infinity, Infinity, Infinity, Infinity], // R1 进入时 = 初始
      [0, 4, 5, Infinity, Infinity], // R2 进入时 = R1 末
      [0, 4, 1, 7, 9], // R3 进入时 = R2 末
      [0, 4, 1, 3, 5], // R4 进入时 = R3 末
    ]);
  });

  it('TC-BELLMAN-MOD-07 首个 relaxUpdate（B←A）后 nodeBadge[1]=4', () => {
    const firstUpd = steps().find((s) => s.point === 'relaxUpdate')!;
    expect(firstUpd.graph!.nodeBadge![1]).toBe('4');
  });

  it('TC-BELLMAN-MOD-08 dist 单调不增（松弛不变量）', () => {
    const ss = steps();
    const n = ss[0].graph!.nodeBadge!.length;
    const cur = Array.from({ length: n }, () => Infinity);
    for (const s of ss) {
      const b = s.graph!.nodeBadge!.map(numBadge);
      for (let i = 0; i < n; i++) {
        expect(b[i]).toBeLessThanOrEqual(cur[i]); // 从不增大
        cur[i] = b[i];
      }
    }
  });

  it('TC-BELLMAN-MOD-09 done 最短路树 edgeClass tree 恰 4：{0-1,1-2,2-3,3-4}', () => {
    const done = steps().find((s) => s.point === 'done')!;
    const tree = Object.entries(done.graph!.edgeClass ?? {})
      .filter(([, c]) => c === 'tree')
      .map(([k]) => k)
      .sort();
    expect(tree).toEqual(['0-1', '1-2', '2-3', '3-4']);
  });

  it('TC-BELLMAN-MOD-10 含负权边 B→C=-3、D→E=-2；done doneNodes 全 5 点', () => {
    const bc = BF_EDGES.find((e) => e.from === 1 && e.to === 2)!;
    const de = BF_EDGES.find((e) => e.from === 3 && e.to === 4)!;
    expect(bc.w).toBe(-3);
    expect(de.w).toBe(-2);
    const done = steps().find((s) => s.point === 'done')!;
    expect([...(done.graph!.doneNodes ?? [])].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });

  it('TC-BELLMAN-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = bellmanFordModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of bellmanFordModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-BELLMAN-MOD-12 module 元信息', () => {
    expect(bellmanFordModule.title).toContain('Bellman');
    expect(bellmanFordModule.initialInput()).toEqual([]);
  });
});
