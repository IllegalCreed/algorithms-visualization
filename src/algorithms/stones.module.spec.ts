// src/algorithms/stones.module.spec.ts —— 石子合并 module 对拍 oracle（C-098）
import { describe, it, expect } from 'vitest';
import { buildStoneSteps, stoneModule } from './stones.module';
import { ST_PILES, stonesDp, bruteMerge } from './stones';
import { stoneSources } from './stones.sources';

const POINTS = new Set(['init', 'pair', 'split', 'done']);

describe('stones.module', () => {
  const steps = buildStoneSteps(ST_PILES);
  const last = steps[steps.length - 1];
  const { dp, fills } = stonesDp();

  it('TC-ST-MOD-01 对拍：dp[0][3]=20=暴力枚举', () => {
    expect(dp[0][3]).toBe(20);
    expect(dp[0][3]).toBe(bruteMerge());
  });

  it('TC-ST-MOD-02 填表序六项全等', () => {
    expect(fills.map((f) => [f.i, f.j, f.len, f.val])).toEqual([
      [0, 1, 2, 5],
      [1, 2, 2, 4],
      [2, 3, 2, 5],
      [0, 2, 3, 12],
      [1, 3, 3, 10],
      [0, 3, 4, 20],
    ]);
  });

  it('TC-ST-MOD-03 拆分候选与胜者', () => {
    expect(fills[3].cands).toEqual([
      { k: 0, cost: 4 },
      { k: 1, cost: 5 },
    ]);
    expect(fills[3].bestK).toBe(0);
    expect(fills[4].cands).toEqual([
      { k: 1, cost: 5 },
      { k: 2, cost: 4 },
    ]);
    expect(fills[4].bestK).toBe(2);
    expect(fills[5].cands).toEqual([
      { k: 0, cost: 10 },
      { k: 1, cost: 10 },
      { k: 2, cost: 12 },
    ]);
    expect(fills[5].bestK).toBe(0);
  });

  it('TC-ST-MOD-04 步合法：point + matrix + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-ST-MOD-05 步数结构：8 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'pair',
      'pair',
      'pair',
      'split',
      'split',
      'split',
      'done',
    ]);
  });

  it('TC-ST-MOD-06 init 表：对角 0 其余 null；labels=堆值', () => {
    const init = steps[0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i === j) expect(init.matrix!.cells[i][j]).toBe(0);
        else expect(init.matrix!.cells[i][j]).toBeNull();
      }
    }
    expect(init.matrix!.colLabels).toEqual(['4', '1', '3', '2']);
  });

  it('TC-ST-MOD-07 pair 步：updatedCell 与值', () => {
    const pairs = steps.filter((s) => s.point === 'pair');
    expect(pairs.map((s) => s.matrix!.updatedCell)).toEqual([
      [0, 1],
      [1, 2],
      [2, 3],
    ]);
    expect(
      pairs.map((s) => {
        const [r, c] = s.matrix!.updatedCell!;
        return s.matrix!.cells[r][c];
      }),
    ).toEqual([5, 4, 5]);
  });

  it('TC-ST-MOD-08 split sources：最优拆分对', () => {
    const splits = steps.filter((s) => s.point === 'split');
    expect(splits[0].matrix!.sources).toEqual([
      [0, 0],
      [1, 2],
    ]);
    expect(splits[1].matrix!.sources).toEqual([
      [1, 2],
      [3, 3],
    ]);
    expect(splits[2].matrix!.sources).toEqual([
      [0, 0],
      [1, 3],
    ]);
  });

  it('TC-ST-MOD-09 split caption：候选枚举与取小', () => {
    const splits = steps.filter((s) => s.point === 'split');
    expect(splits[2].caption).toContain('k=0');
    expect(splits[2].caption).toContain('k=1');
    expect(splits[2].caption).toContain('k=2');
    expect(splits[0].caption).toContain('取小');
  });

  it('TC-ST-MOD-10 done caption 含 20 与 O(n³)', () => {
    expect(last.caption).toContain('20');
    expect(last.caption).toContain('O(n³)');
  });

  it('TC-ST-MOD-11 四语言 + 行号 + 四执行点', () => {
    expect(stoneSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of stoneSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'pair', 'split'].sort());
    }
  });

  it('TC-ST-MOD-12 元信息：title 含石子；initialInput=ST_PILES', () => {
    expect(stoneModule.title).toContain('石子');
    expect(stoneModule.initialInput()).toEqual(ST_PILES);
  });
});
