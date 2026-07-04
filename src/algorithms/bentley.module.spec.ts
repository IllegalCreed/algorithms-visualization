// src/algorithms/bentley.module.spec.ts —— 扫描线求交 module 对拍 oracle（C-088）
import { describe, it, expect } from 'vitest';
import { buildBentleySteps, bentleyModule } from './bentley.module';
import { bruteCrosses, boEvents } from './bentley';
import { bentleySources } from './bentley.sources';

const POINTS = new Set(['init', 'start', 'cross', 'end', 'done']);

describe('bentley.module', () => {
  const steps = buildBentleySteps();
  const last = steps[steps.length - 1];
  const brute = bruteCrosses();
  const events = boEvents();

  it('TC-BO-MOD-01 交点对拍：事件流 = 暴力 {(4,6),(5,5),(6,6)}；done marks 3 个', () => {
    expect(brute.map((c) => [c.pt.x, c.pt.y])).toEqual([
      [4, 6],
      [5, 5],
      [6, 6],
    ]);
    const crossEvents = events.filter((e) => e.type === 'cross');
    expect(crossEvents.map((e) => [e.pt!.x, e.pt!.y])).toEqual(brute.map((c) => [c.pt.x, c.pt.y]));
    expect(last.hull!.marks).toHaveLength(3);
  });

  it('TC-BO-MOD-02 每步执行点合法且带 hull（array 空）', () => {
    for (const s of steps) {
      expect(POINTS.has(s.point)).toBe(true);
      expect(s.hull).toBeTruthy();
      expect(s.array).toEqual([]);
    }
  });

  it('TC-BO-MOD-03 造型：6 点 3 边；init 全默认、无扫描线', () => {
    const init = steps[0];
    expect(init.point).toBe('init');
    expect(init.hull!.points).toHaveLength(6);
    expect(init.hull!.edges).toHaveLength(3);
    expect(init.hull!.edgeClasses).toEqual([null, null, null]);
    expect(init.hull!.divider ?? null).toBeNull();
  });

  it('TC-BO-MOD-04 事件序：9 事件 x 与类型', () => {
    expect(events.map((e) => e.x)).toEqual([1, 2, 2.5, 4, 5, 6, 8, 8.5, 9]);
    expect(events.map((e) => e.type)).toEqual([
      'start',
      'start',
      'start',
      'cross',
      'cross',
      'cross',
      'end',
      'end',
      'end',
    ]);
    expect(steps).toHaveLength(11); // init + 9 + done
  });

  it('TC-BO-MOD-05 start 步：divider=事件 x、主角边 seg-test、未入场边 seg-no', () => {
    const starts = steps.filter((s) => s.point === 'start');
    expect(starts).toHaveLength(3);
    expect(starts.map((s) => s.hull!.divider)).toEqual([1, 2, 2.5]);
    // x=1：A(0) 主角，B(1)、C(2) 未入场
    expect(starts[0].hull!.edgeClasses).toEqual(['seg-test', 'seg-no', 'seg-no']);
    // x=2：B(1) 主角，A 在场默认，C 未入场
    expect(starts[1].hull!.edgeClasses).toEqual([null, 'seg-test', 'seg-no']);
    expect(starts[2].hull!.edgeClasses).toEqual([null, null, 'seg-test']);
  });

  it('TC-BO-MOD-06 cross 步：markActive=交点、双边 seg-yes、marks 累积', () => {
    const crosses = steps.filter((s) => s.point === 'cross');
    expect(crosses).toHaveLength(3);
    expect(crosses.map((s) => s.hull!.markActive)).toEqual([
      { x: 4, y: 6 },
      { x: 5, y: 5 },
      { x: 6, y: 6 },
    ]);
    expect(crosses.map((s) => s.hull!.marks!.length)).toEqual([1, 2, 3]);
    // x=4：B(1) × C(2)
    expect(crosses[0].hull!.edgeClasses).toEqual([null, 'seg-yes', 'seg-yes']);
    expect(crosses[1].hull!.edgeClasses).toEqual(['seg-yes', 'seg-yes', null]);
    expect(crosses[2].hull!.edgeClasses).toEqual(['seg-yes', null, 'seg-yes']);
  });

  it('TC-BO-MOD-07 end 步：该边转 seg-no、marks 保持 3', () => {
    const ends = steps.filter((s) => s.point === 'end');
    expect(ends).toHaveLength(3);
    expect(ends[0].hull!.edgeClasses![1]).toBe('seg-no'); // x=8 B 离场
    expect(ends[1].hull!.edgeClasses![2]).toBe('seg-no'); // x=8.5 C 离场
    expect(ends[2].hull!.edgeClasses![0]).toBe('seg-no'); // x=9 A 离场
    for (const s of ends) expect(s.hull!.marks).toHaveLength(3);
  });

  it('TC-BO-MOD-08 新相邻检查入队：x=2 入 (5,5)；x=2.5 入 (6,6)+(4,6)', () => {
    expect(events[0].enqueued).toEqual([]); // x=1 A 独自在场
    expect(events[1].enqueued).toEqual([{ x: 5, y: 5 }]);
    const q = [...events[2].enqueued].sort((a, b) => a.x - b.x);
    expect(q).toEqual([
      { x: 4, y: 6 },
      { x: 6, y: 6 },
    ]);
    // 其后事件均无新入队（去重 / 交点在扫描线左侧）
    for (const e of events.slice(3)) expect(e.enqueued).toEqual([]);
  });

  it('TC-BO-MOD-09 扫描线单调递增', () => {
    const xs = steps
      .filter((s) => s.point !== 'init' && s.point !== 'done')
      .map((s) => s.hull!.divider as number);
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
  });

  it('TC-BO-MOD-10 done caption 含 3 个交点与扫描语义', () => {
    expect(last.point).toBe('done');
    expect(last.caption).toContain('3 个交点');
    expect(last.caption).toContain('相邻');
  });

  it('TC-BO-MOD-11 四语言 + 行号 + 五执行点', () => {
    expect(bentleySources.map((s) => s.lang).sort()).toEqual(['go', 'python', 'rust', 'ts']);
    for (const src of bentleySources) {
      const n = src.code.split('\n').length;
      for (const ln of Object.values(src.lineMap)) {
        expect(ln).toBeGreaterThanOrEqual(1);
        expect(ln).toBeLessThanOrEqual(n);
      }
      expect(Object.keys(src.lineMap).sort()).toEqual(
        ['cross', 'done', 'end', 'init', 'start'].sort(),
      );
    }
  });

  it('TC-BO-MOD-12 module 元信息 title 含扫描线；initialInput()=[]', () => {
    expect(bentleyModule.title).toContain('扫描线');
    expect(bentleyModule.initialInput()).toEqual([]);
  });
});
