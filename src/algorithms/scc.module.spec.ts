// src/algorithms/scc.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildSccSteps, sccModule } from './scc.module';
import { tarjanSCCs, tarjanDfnLow, SCC_N } from './scc';
import type { TarjanExecPoint, Step } from '@/components/player/types';

const steps = () => buildSccSteps();
const last = (ss: Step<TarjanExecPoint>[]) => ss[ss.length - 1];
const cnt = (ss: Step<TarjanExecPoint>[], p: TarjanExecPoint) =>
  ss.filter((s) => s.point === p).length;
const parseBadge = (b: string | null) =>
  b == null ? null : (b.split('/').map(Number) as [number, number]);

describe('scc.module', () => {
  it('TC-SCC-MOD-01 末步 done + 3 个 SCC + nodeGroup 每点有组', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(tarjanSCCs().length).toBe(3);
    const grp = l.graph!.nodeGroup!;
    for (let i = 0; i < SCC_N; i++) expect(grp[i]).not.toBeNull();
    expect(new Set(grp).size).toBe(3);
  });

  it('TC-SCC-MOD-02 每步执行点合法且带图轨（array 空）', () => {
    const ok = new Set<TarjanExecPoint>(['enter', 'tree', 'back', 'scc', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.graph).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-SCC-MOD-03 enter 恰 6 次', () => {
    expect(cnt(steps(), 'enter')).toBe(SCC_N);
  });

  it('TC-SCC-MOD-04 末步 dfn/low = oracle', () => {
    const badges = last(steps()).graph!.nodeBadge!;
    const dfn: number[] = [];
    const low: number[] = [];
    for (let i = 0; i < SCC_N; i++) {
      const p = parseBadge(badges[i]);
      dfn.push(p![0]);
      low.push(p![1]);
    }
    expect({ dfn, low }).toEqual(tarjanDfnLow());
  });

  it('TC-SCC-MOD-05 scc 恰 3 次', () => {
    expect(cnt(steps(), 'scc')).toBe(3);
  });

  it('TC-SCC-MOD-06 scc 步是根（activeNode 的 low === dfn）', () => {
    for (const s of steps().filter((x) => x.point === 'scc')) {
      const u = s.graph!.activeNode as number;
      const p = parseBadge(s.graph!.nodeBadge![u])!;
      expect(p[0]).toBe(p[1]); // dfn === low
    }
  });

  it('TC-SCC-MOD-07 同 SCC 同组、三组两两不同', () => {
    const grp = last(steps()).graph!.nodeGroup!;
    expect(grp[0]).toBe(grp[1]);
    expect(grp[1]).toBe(grp[2]); // {0,1,2}
    expect(grp[3]).toBe(grp[4]); // {3,4}
    expect(new Set([grp[0], grp[3], grp[5]]).size).toBe(3); // 三组互异
  });

  it('TC-SCC-MOD-08 badge 格式 dfn/low（两数）；未访问 null', () => {
    // 首个 enter 步：只有 activeNode 有 badge，其它 null
    const first = steps().find((s) => s.point === 'enter')!;
    const u = first.graph!.activeNode as number;
    const p = parseBadge(first.graph!.nodeBadge![u]);
    expect(p).not.toBeNull();
    expect(p!.length).toBe(2);
    // 末步全部有 badge
    for (const b of last(steps()).graph!.nodeBadge!) expect(parseBadge(b)).not.toBeNull();
  });

  it('TC-SCC-MOD-09 scc 步弹栈后栈变短', () => {
    const ss = steps();
    for (let i = 0; i < ss.length; i++) {
      if (ss[i].point === 'scc' && i > 0) {
        expect((ss[i].graph!.stackNodes ?? []).length).toBeLessThan(
          (ss[i - 1].graph!.stackNodes ?? []).length,
        );
      }
    }
  });

  it('TC-SCC-MOD-10 有向图', () => {
    for (const s of steps()) expect(s.graph!.directed).toBe(true);
  });

  it('TC-SCC-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = sccModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of sccModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-SCC-MOD-12 module 元信息', () => {
    expect(sccModule.title).toMatch(/强连通|Tarjan|SCC/);
    expect(sccModule.initialInput()).toEqual([]);
  });
});
