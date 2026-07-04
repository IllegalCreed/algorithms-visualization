// src/algorithms/bitonic.module.spec.ts —— 双调排序 module 对拍 oracle（C-085）
import { describe, it, expect } from 'vitest';
import { buildBitonicSteps, bitonicModule } from './bitonic.module';
import { BS_INPUT, buildComparators, runNetwork, networkSortsAll } from './bitonic';
import { bitonicSources } from './bitonic.sources';

const POINTS = new Set(['init', 'column', 'done']);

describe('bitonic.module', () => {
  const steps = buildBitonicSteps();
  const last = steps[steps.length - 1];
  const { comparators, cols } = buildComparators(8);
  const snapshots = runNetwork(BS_INPUT);

  it('TC-BN-MOD-01 末步 done + 有序', () => {
    expect(last.point).toBe('done');
    expect(last.network!.wires).toEqual([...BS_INPUT].sort((a, b) => a - b));
  });

  it('TC-BN-MOD-02 每步执行点合法且带 network（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.network).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-BN-MOD-03 网络结构：6 列 24 比较器、每列 4 个', () => {
    expect(cols).toBe(6);
    expect(comparators).toHaveLength(24);
    for (let c = 0; c < cols; c++) {
      expect(comparators.filter((cp) => cp.col === c)).toHaveLength(4);
    }
  });

  it('TC-BN-MOD-04 列 0 方向交替 ↑↓↑↓', () => {
    const c0 = comparators.filter((cp) => cp.col === 0);
    expect(c0.map((cp) => [cp.a, cp.b, cp.dir])).toEqual([
      [0, 1, 'asc'],
      [2, 3, 'desc'],
      [4, 5, 'asc'],
      [6, 7, 'desc'],
    ]);
  });

  it('TC-BN-MOD-05 合并段列 3-5 全 asc、距离 4/2/1', () => {
    for (const [c, dist] of [
      [3, 4],
      [4, 2],
      [5, 1],
    ] as const) {
      const g = comparators.filter((cp) => cp.col === c);
      expect(g.every((cp) => cp.dir === 'asc')).toBe(true);
      expect(g.every((cp) => cp.b - cp.a === dist)).toBe(true);
    }
  });

  it('TC-BN-MOD-06 column 6 步，currentCol 依次 0..5', () => {
    const colSteps = steps.filter((s) => s.point === 'column');
    expect(colSteps).toHaveLength(6);
    colSteps.forEach((s, i) => expect(s.network!.currentCol).toBe(i));
  });

  it('TC-BN-MOD-07 列 2 后完美双调 + caption 提双调', () => {
    const col2 = steps.filter((s) => s.point === 'column')[2];
    expect(col2.network!.wires).toEqual([1, 2, 5, 7, 8, 6, 4, 3]);
    expect(col2.caption).toContain('双调');
  });

  it('TC-BN-MOD-08 逐列快照对拍 runNetwork', () => {
    const colSteps = steps.filter((s) => s.point === 'column');
    colSteps.forEach((s, i) => expect(s.network!.wires).toEqual(snapshots[i + 1]));
  });

  it('TC-BN-MOD-09 200 随机对拍：网络对任意输入排序', () => {
    expect(networkSortsAll(200)).toBe(true);
  });

  it('TC-BN-MOD-10 done caption 含 6 拍与并行语义', () => {
    expect(last.caption).toContain('6');
    expect(last.caption).toContain('并行');
  });

  it('TC-BN-MOD-11 四语言 + 行号 + 三执行点', () => {
    expect(bitonicSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of bitonicSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['column', 'done', 'init'].sort());
    }
  });

  it('TC-BN-MOD-12 module 元信息 title 含双调；initialInput()=BS_INPUT', () => {
    expect(bitonicModule.title).toContain('双调');
    expect(bitonicModule.initialInput()).toEqual(BS_INPUT);
  });
});
