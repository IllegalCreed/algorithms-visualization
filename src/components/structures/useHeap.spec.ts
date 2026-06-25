import { describe, it, expect } from 'vitest';
import { useHeap, HEAP_MAX } from './useHeap';

const vals = (h: ReturnType<typeof useHeap>) => h.items.value.map((t) => t[1]);
const isMaxHeap = (a: number[]) => {
  for (let i = 0; i < a.length; i++) {
    if (2 * i + 1 < a.length && a[i] < a[2 * i + 1]) return false;
    if (2 * i + 2 < a.length && a[i] < a[2 * i + 2]) return false;
  }
  return true;
};
const fullInsert = (h: ReturnType<typeof useHeap>, v: number) => {
  let i = h.insert(v);
  if (i === null) return;
  while ((i = h.siftUpStep(i)) >= 0);
};
const fullExtract = (h: ReturnType<typeof useHeap>) => {
  const m = h.extractRoot();
  let i = 0;
  while ((i = h.siftDownStep(i)) >= 0);
  return m;
};

describe('useHeap', () => {
  it('TC-HEAPDS-LOGIC-01 初始大顶堆 [90,70,80,40,60,30,50]、peek 90、边界', () => {
    const h = useHeap();
    expect(vals(h)).toEqual([90, 70, 80, 40, 60, 30, 50]);
    expect(h.peek()).toBe(90);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.canInsert.value).toBe(true);
    expect(h.canExtract.value).toBe(true);
  });
  it('TC-HEAPDS-LOGIC-02 insert 末尾追加（不 sift）、返回新下标', () => {
    const h = useHeap();
    expect(h.insert(95)).toBe(7);
    expect(h.items.value[7][1]).toBe(95);
    expect(h.items.value).toHaveLength(8);
  });
  it('TC-HEAPDS-LOGIC-03 siftUpStep 单步上浮', () => {
    const h = useHeap();
    h.insert(95); // idx7、父 idx3=40
    expect(h.siftUpStep(7)).toBe(3);
    expect(h.items.value[3][1]).toBe(95);
    expect(h.siftUpStep(0)).toBe(-1);
  });
  it('TC-HEAPDS-LOGIC-04 完整插入后仍是大顶堆、root 为最大', () => {
    const h = useHeap();
    fullInsert(h, 95);
    expect(h.peek()).toBe(95);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.items.value).toHaveLength(8);
  });
  it('TC-HEAPDS-LOGIC-05 extractRoot 取根（最大）、末位补根', () => {
    const h = useHeap();
    expect(h.extractRoot()).toBe(90);
    expect(h.items.value[0][1]).toBe(50);
    expect(h.items.value).toHaveLength(6);
  });
  it('TC-HEAPDS-LOGIC-06 完整弹出后仍是大顶堆、返回最大、新堆顶', () => {
    const h = useHeap();
    expect(fullExtract(h)).toBe(90);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.peek()).toBe(80);
    expect(h.items.value).toHaveLength(6);
  });
  it('TC-HEAPDS-LOGIC-07 siftDownStep 单步下沉', () => {
    const h = useHeap();
    h.extractRoot(); // [50,70,80,40,60,30]，根 50 待下沉
    expect(h.siftDownStep(0)).toBe(2);
    expect(h.items.value[0][1]).toBe(80);
  });
  it('TC-HEAPDS-LOGIC-08 不变量：连续插入/弹出后仍大顶堆、peek=max', () => {
    const h = useHeap();
    [95, 10, 88, 45, 99].forEach((v) => fullInsert(h, v));
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.peek()).toBe(Math.max(...vals(h)));
    fullExtract(h);
    fullExtract(h);
    expect(isMaxHeap(vals(h))).toBe(true);
    expect(h.peek()).toBe(Math.max(...vals(h)));
  });
  it('TC-HEAPDS-LOGIC-09 边界：满 15 insert null；空 extractRoot/peek null；id 唯一', () => {
    const h = useHeap();
    while (h.items.value.length < HEAP_MAX) h.insert(h.items.value.length);
    expect(h.canInsert.value).toBe(false);
    expect(h.insert(1)).toBe(null);
    const ids = h.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
    const e = useHeap();
    while (e.items.value.length) e.extractRoot();
    expect(e.canExtract.value).toBe(false);
    expect(e.extractRoot()).toBe(null);
    expect(e.peek()).toBe(null);
  });
  it('TC-HEAPDS-LOGIC-10 reset 复位初始堆', () => {
    const h = useHeap();
    fullInsert(h, 99);
    fullExtract(h);
    h.reset();
    expect(vals(h)).toEqual([90, 70, 80, 40, 60, 30, 50]);
  });
});
