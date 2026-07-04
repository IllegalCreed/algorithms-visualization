// src/algorithms/rotsearch.module.spec.ts —— 旋转数组搜索 module 对拍 oracle（C-093）
import { describe, it, expect } from 'vitest';
import { buildRotSearchSteps, rotSearchModule } from './rotsearch.module';
import { ROT_ARRAY, RS_T1, RS_T2, linearIndex, rotTrace } from './rotsearch';
import { rotSearchSources } from './rotsearch.sources';

const POINTS = new Set(['init', 'probe', 'found', 'done']);

describe('rotsearch.module', () => {
  const steps = buildRotSearchSteps(ROT_ARRAY);
  const last = steps[steps.length - 1];
  const t1 = rotTrace(ROT_ARRAY, RS_T1);
  const t2 = rotTrace(ROT_ARRAY, RS_T2);

  it('TC-RS-MOD-01 对拍：5→idx5、15→idx1 = 线性扫', () => {
    expect(t1.index).toBe(5);
    expect(t2.index).toBe(1);
    expect(t1.index).toBe(linearIndex(ROT_ARRAY, RS_T1));
    expect(t2.index).toBe(linearIndex(ROT_ARRAY, RS_T2));
  });

  it('TC-RS-MOD-02 t=5 轨迹：right/in → left/in → HIT(5,5,5)', () => {
    expect(t1.probes.map((p) => [p.lo, p.hi, p.mid, p.sortedHalf, p.inSorted])).toEqual([
      [0, 8, 4, 'right', true],
      [5, 8, 6, 'left', true],
    ]);
    expect(t1.hit).toEqual({ lo: 5, hi: 5, mid: 5 });
  });

  it('TC-RS-MOD-03 t=15 轨迹：right/not-in → HIT(0,3,1)', () => {
    expect(t2.probes.map((p) => [p.lo, p.hi, p.mid, p.sortedHalf, p.inSorted])).toEqual([
      [0, 8, 4, 'right', false],
    ]);
    expect(t2.hit).toEqual({ lo: 0, hi: 3, mid: 1 });
  });

  it('TC-RS-MOD-04 步合法：9 柱断崖恒序', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.array.map((a) => a[1])).toEqual(ROT_ARRAY);
    }
  });

  it('TC-RS-MOD-05 步数结构：8 步 point 序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'probe',
      'probe',
      'found',
      'init',
      'probe',
      'found',
      'done',
    ]);
  });

  it('TC-RS-MOD-06 probe 步：pivotIndex 与闭区间收缩', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    expect(probes.map((s) => s.emphasis.pivotIndex)).toEqual([4, 6, 4]);
    expect(probes[0].emphasis.groupMembers).toEqual([5, 6, 7, 8]);
    expect(probes[1].emphasis.groupMembers).toEqual([5]);
    expect(probes[2].emphasis.groupMembers).toEqual([0, 1, 2, 3]);
  });

  it('TC-RS-MOD-07 判半 caption：左半/右半有序都出现', () => {
    const caps = steps
      .filter((s) => s.point === 'probe')
      .map((s) => s.caption ?? '')
      .join('|');
    expect(caps).toContain('右半');
    expect(caps).toContain('左半');
    expect(caps).toContain('有序');
  });

  it('TC-RS-MOD-08 found 步：sortedIndices=[5]、[1] + 命中', () => {
    const founds = steps.filter((s) => s.point === 'found');
    expect(founds.map((s) => s.emphasis.sortedIndices)).toEqual([[5], [1]]);
    for (const s of founds) expect(s.caption).toContain('命中');
  });

  it('TC-RS-MOD-09 vars：probe 步含有序半标注', () => {
    const probes = steps.filter((s) => s.point === 'probe');
    for (const s of probes) {
      expect(s.vars.some((v) => `${v.value}`.includes('有序'))).toBe(true);
    }
  });

  it('TC-RS-MOD-10 done caption 含 O(log n) 与一半引理', () => {
    expect(last.caption).toContain('O(log n)');
    expect(last.caption).toContain('一半');
  });

  it('TC-RS-MOD-11 四语言 + 行号 + 四执行点', () => {
    expect(rotSearchSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of rotSearchSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'found', 'init', 'probe'].sort());
    }
  });

  it('TC-RS-MOD-12 元信息：title 含旋转；initialInput 断崖形状', () => {
    expect(rotSearchModule.title).toContain('旋转');
    const inp = rotSearchModule.initialInput();
    expect(inp).toEqual(ROT_ARRAY);
    // 断崖：恰有一处相邻下降
    let drops = 0;
    for (let i = 1; i < inp.length; i++) if (inp[i] < inp[i - 1]) drops++;
    expect(drops).toBe(1);
  });
});
