import { describe, it, expect } from 'vitest';
import { useProbe } from './useProbe';

describe('useProbe 开放寻址（线性探测）', () => {
  it('TC-PROBE-LOGIC-01 初始扁平表 [null,15,8,23,4,null,null]、size 4', () => {
    const p = useProbe();
    expect(p.slots.value).toEqual([null, 15, 8, 23, 4, null, null]);
    expect(p.size.value).toBe(4);
  });
  it('TC-PROBE-LOGIC-02 装载因子 4/7、isFull=false', () => {
    const p = useProbe();
    expect(p.load.value).toBeCloseTo(4 / 7, 5);
    expect(p.isFull.value).toBe(false);
  });
  it('TC-PROBE-LOGIC-03 hash(key)=key%7', () => {
    const p = useProbe();
    expect(p.hash(15)).toBe(1);
    expect(p.hash(8)).toBe(1);
    expect(p.hash(23)).toBe(2);
    expect(p.hash(4)).toBe(4);
  });
  it('TC-PROBE-LOGIC-04 insert 非冲突：5→格5', () => {
    const p = useProbe();
    const r = p.insert(5);
    expect(r.ok).toBe(true);
    expect(r.slot).toBe(5);
    expect(r.path).toEqual([5]);
    expect(r.collision).toBe(false);
    expect(p.slots.value[5]).toBe(5);
  });
  it('TC-PROBE-LOGIC-05 insert 冲突：9→探 2,3,4 落 5', () => {
    const p = useProbe();
    const r = p.insert(9);
    expect(r.ok).toBe(true);
    expect(r.home).toBe(2);
    expect(r.slot).toBe(5);
    expect(r.path).toEqual([2, 3, 4, 5]);
    expect(r.collision).toBe(true);
  });
  it('TC-PROBE-LOGIC-06 insert 查重：15 已在 → dup', () => {
    const p = useProbe();
    const r = p.insert(15);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('dup');
  });
  it('TC-PROBE-LOGIC-07 search 命中：15→1 步、8→2 步（8 不在家被探到）', () => {
    const p = useProbe();
    const a = p.search(15);
    expect(a.found).toBe(true);
    expect(a.slot).toBe(1);
    expect(a.steps).toBe(1);
    const b = p.search(8);
    expect(b.found).toBe(true);
    expect(b.slot).toBe(2);
    expect(b.steps).toBe(2);
  });
  it('TC-PROBE-LOGIC-08 search 未命中：99（%7=1）探到空槽止', () => {
    const p = useProbe();
    const r = p.search(99);
    expect(r.found).toBe(false);
    expect(r.steps).toBe(5);
    expect(r.path[r.path.length - 1]).toBe(5);
    expect(p.slots.value[5]).toBe(null);
  });
  it('TC-PROBE-LOGIC-09 填满后 isFull、load=1，insert→full 不死循环', () => {
    const p = useProbe();
    p.insert(7); // →格0
    p.insert(5); // →格5
    p.insert(6); // →格6
    expect(p.isFull.value).toBe(true);
    expect(p.load.value).toBe(1);
    const r = p.insert(99);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('full');
  });
  it('TC-PROBE-LOGIC-10 reset 复原；has(8)=true、has(99)=false', () => {
    const p = useProbe();
    p.insert(9);
    p.insert(33);
    p.reset();
    expect(p.slots.value).toEqual([null, 15, 8, 23, 4, null, null]);
    expect(p.has(8)).toBe(true);
    expect(p.has(99)).toBe(false);
  });
});
