// src/algorithms/convexhull.module.spec.ts —— 凸包 module 对拍 oracle（C-081，计算几何大类首发）
import { describe, it, expect } from 'vitest';
import { buildHullSteps, convexHullModule } from './convexhull.module';
import { CH_POINTS, cross, convexHull } from './convexhull';
import { convexHullSources } from './convexhull.sources';

const POINTS = new Set(['init', 'lower', 'upper', 'done']);

describe('convexhull.module', () => {
  const steps = buildHullSteps();
  const last = steps[steps.length - 1];
  const hull = convexHull();

  it('TC-CH-MOD-01 末步 done + 凸包 [0,1,4,6,5,2]（6 点）', () => {
    expect(last.point).toBe('done');
    expect(hull).toEqual([0, 1, 4, 6, 5, 2]);
    expect(last.hull!.finalHull).toEqual([0, 1, 4, 6, 5, 2]);
  });

  it('TC-CH-MOD-02 每步执行点合法且带 hull 轨（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.hull).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-CH-MOD-03 排序点 7 个 + 含内部点 (3,3)', () => {
    expect(CH_POINTS).toHaveLength(7);
    // 已按 (x,y) 排序
    for (let i = 1; i < CH_POINTS.length; i++) {
      const a = CH_POINTS[i - 1];
      const b = CH_POINTS[i];
      expect(a.x < b.x || (a.x === b.x && a.y <= b.y)).toBe(true);
    }
    expect(CH_POINTS[3]).toEqual({ x: 3, y: 3 });
  });

  it('TC-CH-MOD-04 下 + 上凸壳：lower 7 步、upper 7 步', () => {
    expect(steps.filter((s) => s.point === 'lower')).toHaveLength(7);
    expect(steps.filter((s) => s.point === 'upper')).toHaveLength(7);
  });

  it('TC-CH-MOD-05 叉积转向：左转 >0、右转 <0', () => {
    expect(cross({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 })).toBeGreaterThan(0); // 左转
    expect(cross({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 })).toBeLessThan(0); // 右转
    expect(cross({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 })).toBe(0); // 共线
  });

  it('TC-CH-MOD-06 弹栈发生：lower/upper 各至少 1 步 popped 非空', () => {
    const hasPop = (pt: string) =>
      steps.some((s) => s.point === pt && (s.hull!.popped?.length ?? 0) > 0);
    expect(hasPop('lower')).toBe(true);
    expect(hasPop('upper')).toBe(true);
  });

  it('TC-CH-MOD-07 内部点 (3,3)（下标 3）被排除', () => {
    expect(last.hull!.finalHull).not.toContain(3);
  });

  it('TC-CH-MOD-08 凸包顶点逆时针 + 其余点在左侧（cross≥0）', () => {
    const H = hull.map((i) => CH_POINTS[i]);
    const m = H.length;
    for (let e = 0; e < m; e++) {
      const o = H[e];
      const a = H[(e + 1) % m];
      for (const p of CH_POINTS) {
        expect(cross(o, a, p)).toBeGreaterThanOrEqual(0); // 所有点在每条有向边左侧或线上
      }
    }
  });

  it('TC-CH-MOD-09 所有 7 点都在凸包内或边上', () => {
    const H = hull.map((i) => CH_POINTS[i]);
    const m = H.length;
    for (const p of CH_POINTS) {
      const inside = Array.from({ length: m }, (_, e) => cross(H[e], H[(e + 1) % m], p)).every(
        (c) => c >= 0,
      );
      expect(inside).toBe(true);
    }
  });

  it('TC-CH-MOD-10 done 步 caption 含凸包点数 6 与内部点排除', () => {
    expect(last.caption).toContain('6');
    expect(last.caption).toMatch(/内部点|排除/);
  });

  it('TC-CH-MOD-11 四语言 sources + 每 point 行号在源码行数内', () => {
    expect(convexHullSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of convexHullSources) {
      const nn = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(nn);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(['done', 'init', 'lower', 'upper'].sort());
    }
  });

  it('TC-CH-MOD-12 module 元信息 title 含凸包；initialInput()=[]', () => {
    expect(convexHullModule.title).toContain('凸包');
    expect(convexHullModule.initialInput()).toEqual([]);
  });
});
