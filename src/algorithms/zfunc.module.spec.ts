// src/algorithms/zfunc.module.spec.ts —— Z 函数 module 对拍 oracle（C-106）
import { describe, it, expect } from 'vitest';
import { buildZSteps, zModule } from './zfunc.module';
import { zTrace, zBrute } from './zfunc';
import { zSources } from './zfunc.sources';

const POINTS = new Set(['init', 'brute', 'mirror', 'extend', 'done']);

describe('zfunc.module', () => {
  const steps = buildZSteps();
  const last = steps[steps.length - 1];
  const tr = zTrace();

  it('TC-Z-MOD-01 对拍：z=[7,1,0,2,3,1,0]=朴素逐位', () => {
    expect(tr.z).toEqual([7, 1, 0, 2, 3, 1, 0]);
    expect(tr.z).toEqual(zBrute());
  });

  it('TC-Z-MOD-02 事件流：brute×3 → 达界+2 → 直接抄×2', () => {
    expect(tr.events.map((e) => [e.i, e.mode, e.ext])).toEqual([
      [1, 'brute', 1],
      [2, 'brute', 0],
      [3, 'brute', 2],
      [4, 'mirror-capped', 2],
      [5, 'mirror-copy', 0],
      [6, 'mirror-copy', 0],
    ]);
    expect(tr.events[3].mirrored).toBe(1);
    expect(tr.events[3].boxUpd).toBe(true);
    expect(tr.events[3].box).toEqual([4, 7]);
    expect(tr.events[4].mirrored).toBe(1);
  });

  it('TC-Z-MOD-03 步合法：point + manacher + array 空', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.manacher).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-Z-MOD-04 步数结构：9 步序列全等', () => {
    expect(steps.map((s) => s.point)).toEqual([
      'init',
      'brute',
      'brute',
      'brute',
      'mirror',
      'extend',
      'mirror',
      'mirror',
      'done',
    ]);
  });

  it('TC-Z-MOD-05 init 步：z[0]=7 其余空 + 标签 S/z', () => {
    const init = steps[0];
    expect(init.manacher!.p).toEqual([7, null, null, null, null, null, null]);
    expect(init.manacher!.labels).toEqual(['S', 'z']);
    expect(init.caption).toContain('公共前缀');
  });

  it('TC-Z-MOD-06 brute 步：i=3 填至 [7,1,0,2] + box=[3,4]', () => {
    const b3 = steps[3];
    expect(b3.manacher!.center).toBe(3);
    expect(b3.manacher!.mirror ?? null).toBeNull();
    expect(b3.manacher!.p).toEqual([7, 1, 0, 2, null, null, null]);
    expect([b3.manacher!.boxL, b3.manacher!.boxR]).toEqual([3, 4]);
  });

  it('TC-Z-MOD-07 mirror 步：i=4 蓝环镜像 1 + 先抄 1 + 达界语义', () => {
    const m = steps[4];
    expect(m.manacher!.center).toBe(4);
    expect(m.manacher!.mirror).toBe(1);
    expect(m.manacher!.p[4]).toBe(1);
    expect(m.caption).toMatch(/达界|不止|右缘/);
    expect(m.manacher!.status).toBe('mirror');
  });

  it('TC-Z-MOD-08 extend 步：i=4 扩到 3 + box 刷新 [4,6] + status expand', () => {
    const e = steps[5];
    expect(e.manacher!.p[4]).toBe(3);
    expect([e.manacher!.boxL, e.manacher!.boxR]).toEqual([4, 6]);
    expect(e.manacher!.status).toBe('expand');
    expect(e.caption).toContain('+2');
  });

  it('TC-Z-MOD-09 mirror-copy 步：i=5 抄 1 零比较 + best 段', () => {
    const m5 = steps[6];
    expect(m5.manacher!.p[5]).toBe(1);
    expect(m5.caption).toMatch(/零比较|直接抄|一次都不/);
    expect(m5.manacher!.best).toEqual([5, 5]);
  });

  it('TC-Z-MOD-10 done：O(n) + P#T 应用', () => {
    expect(last.caption).toContain('O(n)');
    expect(last.caption).toMatch(/P#T|拼接/);
  });

  it('TC-Z-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(zSources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of zSources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['brute', 'done', 'extend', 'init', 'mirror'].sort(),
      );
    }
  });

  it('TC-Z-MOD-12 元信息：title 含 Z 函数；initialInput=[]', () => {
    expect(zModule.title).toContain('Z 函数');
    expect(zModule.initialInput()).toEqual([]);
  });
});
