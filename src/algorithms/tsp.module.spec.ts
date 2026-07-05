// src/algorithms/tsp.module.spec.ts —— 旅行商 TSP module 对拍 oracle（C-099）
import { describe, it, expect } from 'vitest';
import { buildTspSteps, tspModule } from './tsp.module';
import { tspDp, bruteTsp } from './tsp';
import { tspSources } from './tsp.sources';

const POINTS = new Set(['init', 'fill', 'close', 'done']);
const MASK_ROWS = [1, 3, 5, 7, 9, 11, 13, 15];
const rowOf = (mask: number): number => MASK_ROWS.indexOf(mask);

describe('tsp.module', () => {
  const steps = buildTspSteps();
  const last = steps[steps.length - 1];
  const { fills, close, best } = tspDp();

  it('TC-TSP-MOD-01 对拍：best=7=暴力全排列', () => {
    expect(best).toBe(7);
    expect(best).toBe(bruteTsp());
  });

  it('TC-TSP-MOD-02 fill 序 12 项全等', () => {
    expect(fills.map((f) => [f.mask, f.i, f.val])).toEqual([
      [3, 1, 4],
      [5, 2, 1],
      [7, 1, 3],
      [7, 2, 6],
      [9, 3, 3],
      [11, 1, 4],
      [11, 3, 5],
      [13, 2, 8],
      [13, 3, 6],
      [15, 1, 7],
      [15, 2, 6],
      [15, 3, 4],
    ]);
  });

  it('TC-TSP-MOD-03 候选与胜者', () => {
    const f151 = fills.find((f) => f.mask === 15 && f.i === 1)!;
    expect(f151.cands).toEqual([
      { j: 2, cost: 10 },
      { j: 3, cost: 7 },
    ]);
    expect(f151.bestJ).toBe(3);
    const f153 = fills.find((f) => f.mask === 15 && f.i === 3)!;
    expect(f153.cands).toEqual([
      { j: 1, cost: 4 },
      { j: 2, cost: 11 },
    ]);
    expect(f153.bestJ).toBe(1);
  });

  it('TC-TSP-MOD-04 步合法：point + matrix + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-TSP-MOD-05 步数结构：15 步 = init + fill×12 + close + done', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      ...new Array(12).fill('fill'),
      'close',
      'done',
    ]);
  });

  it('TC-TSP-MOD-06 表结构：8×4、二进制 rowLabels、init 仅起点格', () => {
    const init = steps[0];
    expect(init.matrix!.cells).toHaveLength(8);
    expect(init.matrix!.cells[0]).toHaveLength(4);
    expect(init.matrix!.rowLabels).toEqual([
      '0001',
      '0011',
      '0101',
      '0111',
      '1001',
      '1011',
      '1101',
      '1111',
    ]);
    expect(init.matrix!.cells[0][0]).toBe(0);
    let nonNull = 0;
    for (const row of init.matrix!.cells) for (const c of row) if (c !== null) nonNull++;
    expect(nonNull).toBe(1);
  });

  it('TC-TSP-MOD-07 fill 步：updatedCell 行列正确、无效格保持 null', () => {
    const fillSteps = steps.filter((s) => s.point === 'fill');
    fillSteps.forEach((s, k) => {
      expect(s.matrix!.updatedCell).toEqual([rowOf(fills[k].mask), fills[k].i]);
    });
    const lastFill = fillSteps[fillSteps.length - 1];
    expect(lastFill.matrix!.cells[1][2]).toBeNull(); // mask=0011 不含城 2
    expect(lastFill.matrix!.cells[1][3]).toBeNull();
  });

  it('TC-TSP-MOD-08 fill sources：胜出前置格', () => {
    const fillSteps = steps.filter((s) => s.point === 'fill');
    const s71 = fillSteps[2]; // (0111, 1) bestJ=2, prev=0101
    expect(s71.matrix!.sources).toEqual([[rowOf(5), 2]]);
    const s151 = fillSteps[9]; // (1111, 1) bestJ=3, prev=1101
    expect(s151.matrix!.sources).toEqual([[rowOf(13), 3]]);
  });

  it('TC-TSP-MOD-09 close 步：sources 全集行三格 + 三候选取 min', () => {
    const c = steps.find((s) => s.point === 'close')!;
    expect(c.matrix!.sources).toEqual([
      [rowOf(15), 1],
      [rowOf(15), 2],
      [rowOf(15), 3],
    ]);
    expect(c.caption).toContain('11');
    expect(c.caption).toContain('7');
    expect(close.map((x) => x.cost)).toEqual([11, 7, 7]);
  });

  it('TC-TSP-MOD-10 done caption 含 7 与 O(2ⁿ·n²)', () => {
    expect(last.caption).toContain('7');
    expect(last.caption).toContain('O(2ⁿ·n²)');
  });

  it('TC-TSP-MOD-11 四语言 + 行号 + 四执行点', () => {
    expect(tspSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of tspSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['close', 'done', 'fill', 'init'].sort());
    }
  });

  it('TC-TSP-MOD-12 元信息：title 含旅行商；initialInput=[]', () => {
    expect(tspModule.title).toContain('旅行商');
    expect(tspModule.initialInput()).toEqual([]);
  });
});
