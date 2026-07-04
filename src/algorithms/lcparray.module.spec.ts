// src/algorithms/lcparray.module.spec.ts
import { describe, it, expect } from 'vitest';
import { buildLcpSteps, lcpArrayModule } from './lcparray.module';
import { kasaiLcp } from './lcparray';
import { suffixArray, SA_STR } from './suffixarray';
import type { LcpExecPoint, Step } from '@/components/player/types';

const steps = () => buildLcpSteps();
const last = (ss: Step<LcpExecPoint>[]) => ss[ss.length - 1];
const cnt = (ss: Step<LcpExecPoint>[], p: LcpExecPoint) => ss.filter((s) => s.point === p).length;
const N = SA_STR.length;
// 直接比较相邻后缀前缀长度
const lcpDirect = (a: string, b: string) => {
  let k = 0;
  while (k < a.length && k < b.length && a[k] === b[k]) k++;
  return k;
};

describe('lcparray.module', () => {
  it('TC-LCP-MOD-01 末步 done + lcp = kasaiLcp() = [0,1,3,0,0,2]', () => {
    const l = last(steps());
    expect(l.point).toBe('done');
    expect(l.suffixArray!.done).toBe(true);
    expect(l.suffixArray!.lcp).toEqual(kasaiLcp());
    expect(kasaiLcp()).toEqual([0, 1, 3, 0, 0, 2]);
  });

  it('TC-LCP-MOD-02 每步执行点合法且带后缀轨（array 空）', () => {
    const ok = new Set<LcpExecPoint>(['init', 'fill', 'skip', 'done']);
    for (const s of steps()) {
      expect(ok.has(s.point)).toBe(true);
      expect(s.suffixArray).toBeDefined();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-LCP-MOD-03 order = sa 恒定（LCP 阶段不重排）', () => {
    for (const s of steps()) expect(s.suffixArray!.order).toEqual(suffixArray());
  });

  it('TC-LCP-MOD-04 末步 lcp 与直接比较一致', () => {
    const sa = suffixArray();
    const lcp = last(steps()).suffixArray!.lcp!;
    expect(lcp[0]).toBe(0);
    for (let i = 1; i < N; i++) {
      expect(lcp[i]).toBe(lcpDirect(SA_STR.slice(sa[i - 1]), SA_STR.slice(sa[i])));
    }
  });

  it('TC-LCP-MOD-05 fill 步 current 与 compareRow=current-1 成对且 current≥1', () => {
    for (const s of steps().filter((x) => x.point === 'fill')) {
      const cur = s.suffixArray!.current as number;
      expect(cur).toBeGreaterThanOrEqual(1);
      expect(s.suffixArray!.compareRow).toBe(cur - 1);
    }
  });

  it('TC-LCP-MOD-06 skip 步 current=0（rank 0，无前驱）', () => {
    for (const s of steps().filter((x) => x.point === 'skip')) {
      expect(s.suffixArray!.current).toBe(0);
    }
  });

  it('TC-LCP-MOD-07 fill 恰 n-1 次、skip 恰 1 次', () => {
    expect(cnt(steps(), 'fill')).toBe(N - 1);
    expect(cnt(steps(), 'skip')).toBe(1);
  });

  it('TC-LCP-MOD-08 LCP 列非顺序填充（Kasai 按原始下标）', () => {
    // 处理事件按 current 的顺序不是 1,2,3,4,5（否则就是顺序填），banana → [3,2,5,1,4,(skip0)]
    const currents = steps()
      .filter((s) => s.point === 'fill' || s.point === 'skip')
      .map((s) => s.suffixArray!.current);
    expect(currents).not.toEqual([1, 2, 3, 4, 5, 0]);
  });

  it('TC-LCP-MOD-09 已填 lcp 非空格数单调不减', () => {
    const ss = steps();
    const filled = (arr: (number | null)[]) => arr.filter((v) => v != null).length;
    for (let k = 1; k < ss.length; k++) {
      expect(filled(ss[k].suffixArray!.lcp!)).toBeGreaterThanOrEqual(
        filled(ss[k - 1].suffixArray!.lcp!),
      );
    }
  });

  it('TC-LCP-MOD-10 done 应用值：最长重复 3、不同子串 15', () => {
    const cap = last(steps()).caption ?? '';
    expect(cap).toContain('3'); // max lcp = 3
    expect(cap).toContain('15'); // 不同子串数 = n(n+1)/2 - Σlcp
  });

  it('TC-LCP-MOD-11 四语言 sources 且行号在源码行数内', () => {
    const langs = lcpArrayModule.sources.map((s) => s.lang);
    expect(langs).toEqual(['ts', 'python', 'go', 'rust']);
    for (const src of lcpArrayModule.sources) {
      const lines = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(lines);
      }
    }
  });

  it('TC-LCP-MOD-12 module 元信息', () => {
    expect(lcpArrayModule.title).toMatch(/LCP|height/);
    expect(lcpArrayModule.initialInput()).toEqual([]);
  });
});
