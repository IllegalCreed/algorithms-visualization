// src/algorithms/calipers.module.spec.ts —— 旋转卡壳 module 对拍 oracle（C-082，计算几何第 2 页）
import { describe, it, expect } from 'vitest';
import { buildCalipersSteps, calipersModule } from './calipers.module';
import { diameter, bruteDiameter, dist2 } from './calipers';
import { convexHull } from './convexhull';
import { calipersSources } from './calipers.sources';

const POINTS = new Set(['init', 'spin', 'done']);

describe('calipers.module', () => {
  const steps = buildCalipersSteps();
  const last = steps[steps.length - 1];
  const hull = convexHull();

  it('TC-CAL-MOD-01 末步 done + 直径²=36、pair=[0,6]', () => {
    expect(last.point).toBe('done');
    expect(diameter()).toEqual({ d2: 36, pair: [0, 6] });
    expect(last.hull!.best).toEqual([0, 6]);
  });

  it('TC-CAL-MOD-02 每步执行点合法且带 hull 轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.hull).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-CAL-MOD-03 暴力对拍：d2 相同、点对（无序）相同', () => {
    const a = diameter();
    const b = bruteDiameter();
    expect(a.d2).toBe(b.d2);
    expect([...a.pair].sort()).toEqual([...b.pair].sort());
  });

  it('TC-CAL-MOD-04 spin 步恰 6 个（凸包 6 边）', () => {
    expect(steps.filter((s) => s.point === 'spin')).toHaveLength(6);
  });

  it('TC-CAL-MOD-05 凸包常显：每步 finalHull=[0,1,4,6,5,2] 且 phase=done', () => {
    for (const s of steps) {
      expect(s.hull!.finalHull).toEqual([0, 1, 4, 6, 5, 2]);
      expect(s.hull!.phase).toBe('done');
    }
  });

  it('TC-CAL-MOD-06 activeEdge 为凸包相邻顶点对且按序推进', () => {
    const spins = steps.filter((s) => s.point === 'spin');
    spins.forEach((s, k) => {
      expect(s.hull!.activeEdge).toEqual([hull[k], hull[(k + 1) % hull.length]]);
    });
  });

  it('TC-CAL-MOD-07 caliper 非空；best 从首个 spin 起非空', () => {
    const spins = steps.filter((s) => s.point === 'spin');
    for (const s of spins) {
      expect(s.hull!.caliper).toBeTruthy();
      expect(s.hull!.best).toBeTruthy();
    }
  });

  it('TC-CAL-MOD-08 best 距离²单调不减，末步=36', () => {
    const ds = steps
      .filter((s) => s.hull!.best)
      .map((s) => dist2(s.hull!.best![0], s.hull!.best![1]));
    for (let i = 1; i < ds.length; i++) expect(ds[i]).toBeGreaterThanOrEqual(ds[i - 1]);
    expect(ds[ds.length - 1]).toBe(36);
  });

  it('TC-CAL-MOD-09 best 两端都是凸包顶点', () => {
    for (const s of steps) {
      if (s.hull!.best) {
        expect(hull).toContain(s.hull!.best[0]);
        expect(hull).toContain(s.hull!.best[1]);
      }
    }
  });

  it('TC-CAL-MOD-10 done caption 含直径 6 与「最远」', () => {
    expect(last.caption).toContain('6');
    expect(last.caption).toContain('最远');
  });

  it('TC-CAL-MOD-11 四语言 sources + 行号在源码内', () => {
    expect(calipersSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of calipersSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'spin'].sort());
    }
  });

  it('TC-CAL-MOD-12 module 元信息 title 含卡壳；initialInput()=[]', () => {
    expect(calipersModule.title).toContain('卡壳');
    expect(calipersModule.initialInput()).toEqual([]);
  });
});
