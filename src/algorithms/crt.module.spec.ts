// src/algorithms/crt.module.spec.ts —— 中国剩余定理 module 对拍 oracle（C-087）
import { describe, it, expect } from 'vitest';
import { buildCrtSteps, crtModule } from './crt.module';
import { CRT_RS, CRT_MS, crtBrute, crtRows, crtSolve } from './crt';
import { crtSources } from './crt.sources';

const POINTS = new Set(['init', 'mi', 'inv', 'term', 'sum', 'done']);

describe('crt.module', () => {
  const steps = buildCrtSteps();
  const last = steps[steps.length - 1];
  const rows = crtRows();

  it('TC-CRT-MOD-01 末步 done + 构造解 = 暴力真值 23', () => {
    expect(last.point).toBe('done');
    expect(crtBrute(CRT_RS, CRT_MS)).toBe(23);
    expect(crtSolve()).toEqual({ M: 105, sum: 233, x: 23 });
    expect(last.matrix!.cells[3][4]).toBe(233);
  });

  it('TC-CRT-MOD-02 每步执行点合法且带 matrix（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.matrix).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-CRT-MOD-03 表结构 5 列 × 4 行 + 标签', () => {
    expect(last.matrix!.cells).toHaveLength(4);
    expect(last.matrix!.cells[0]).toHaveLength(5);
    expect(last.matrix!.colLabels).toEqual(['r', 'm', 'Mᵢ', 'tᵢ', '项']);
    expect(last.matrix!.rowLabels).toEqual(['同余①', '同余②', '同余③', '合计']);
  });

  it('TC-CRT-MOD-04 init 后 r/m 两列就位、其余 null；合计行全 null', () => {
    const c = steps[0].matrix!.cells;
    expect([c[0][0], c[0][1]]).toEqual([2, 3]);
    expect([c[1][0], c[1][1]]).toEqual([3, 5]);
    expect([c[2][0], c[2][1]]).toEqual([2, 7]);
    for (let i = 0; i < 3; i++) {
      expect(c[i][2]).toBeNull();
      expect(c[i][3]).toBeNull();
      expect(c[i][4]).toBeNull();
    }
    expect(c[3]).toEqual([null, null, null, null, null]);
  });

  it('TC-CRT-MOD-05 mi 三步依次填 35/21/15', () => {
    const mis = steps.filter((s) => s.point === 'mi');
    expect(mis).toHaveLength(3);
    mis.forEach((s, i) => {
      expect(s.matrix!.cells[i][2]).toBe([35, 21, 15][i]);
      expect(s.matrix!.updatedCell).toEqual([i, 2]);
    });
  });

  it('TC-CRT-MOD-06 tᵢ 依次 2/1/1 且逆元对拍 (Mᵢ mod mᵢ)·tᵢ ≡ 1', () => {
    const invs = steps.filter((s) => s.point === 'inv');
    expect(invs).toHaveLength(3);
    invs.forEach((s, i) => {
      expect(s.matrix!.cells[i][3]).toBe([2, 1, 1][i]);
    });
    for (const row of rows) {
      expect(((row.Mi % row.m) * row.ti) % row.m).toBe(1);
    }
  });

  it('TC-CRT-MOD-07 专属项 140/63/30：本模 ≡rᵢ、异模 ≡0（3×3 全验）', () => {
    const terms = steps.filter((s) => s.point === 'term');
    expect(terms).toHaveLength(3);
    terms.forEach((s, i) => {
      expect(s.matrix!.cells[i][4]).toBe([140, 63, 30][i]);
    });
    rows.forEach((row, i) => {
      CRT_MS.forEach((m, j) => {
        expect(row.term % m).toBe(i === j ? CRT_RS[i] : 0);
      });
    });
  });

  it('TC-CRT-MOD-08 sum 步合计 233 = 140+63+30，233 mod 105 = 23', () => {
    const sum = steps.find((s) => s.point === 'sum')!;
    expect(sum.matrix!.cells[3][4]).toBe(233);
    expect(140 + 63 + 30).toBe(233);
    expect(233 % 105).toBe(crtBrute(CRT_RS, CRT_MS));
  });

  it('TC-CRT-MOD-09 sources：inv 引 Mᵢ/mᵢ、term 引 r/Mᵢ/tᵢ、sum 引三项', () => {
    steps
      .filter((s) => s.point === 'inv')
      .forEach((s, i) => {
        expect(s.matrix!.sources).toEqual([
          [i, 2],
          [i, 1],
        ]);
      });
    steps
      .filter((s) => s.point === 'term')
      .forEach((s, i) => {
        expect(s.matrix!.sources).toEqual([
          [i, 0],
          [i, 2],
          [i, 3],
        ]);
      });
    const sum = steps.find((s) => s.point === 'sum')!;
    expect(sum.matrix!.sources).toEqual([
      [0, 4],
      [1, 4],
      [2, 4],
    ]);
  });

  it('TC-CRT-MOD-10 done caption 含 23 与 105', () => {
    expect(last.caption).toContain('23');
    expect(last.caption).toContain('105');
  });

  it('TC-CRT-MOD-11 四语言 + 行号 + 六执行点', () => {
    expect(crtSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of crtSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['done', 'init', 'inv', 'mi', 'sum', 'term'].sort(),
      );
    }
  });

  it('TC-CRT-MOD-12 module 元信息 title 含中国剩余定理；initialInput()=[]', () => {
    expect(crtModule.title).toContain('中国剩余定理');
    expect(crtModule.initialInput()).toEqual([]);
  });
});
