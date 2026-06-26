import { describe, it, expect } from 'vitest';
import { useGrow, GROW_INIT_CAP } from './useGrow';

describe('useGrow 动态数组扩容', () => {
  it('TC-GROW-LOGIC-01 初始 cap 4、len 3、items [1,2,3]、appends/copies 0', () => {
    const g = useGrow();
    expect(g.capacity.value).toBe(GROW_INIT_CAP);
    expect(g.capacity.value).toBe(4);
    expect(g.length.value).toBe(3);
    expect(g.items.value.map((it) => it[1])).toEqual([1, 2, 3]);
    expect(g.appends.value).toBe(0);
    expect(g.totalCopies.value).toBe(0);
  });
  it('TC-GROW-LOGIC-02 append 未满（len<cap）：grew false、copies 0、cap 4', () => {
    const g = useGrow();
    const r = g.append();
    expect(r.grew).toBe(false);
    expect(r.copies).toBe(0);
    expect(g.capacity.value).toBe(4);
    expect(g.length.value).toBe(4);
  });
  it('TC-GROW-LOGIC-03 append 到满再 append：grew true、copies 4、cap 8', () => {
    const g = useGrow();
    g.append(); // len 3→4（填满）
    const r = g.append(); // len 4==cap 4 → 扩容
    expect(r.grew).toBe(true);
    expect(r.copies).toBe(4);
    expect(r.capacity).toBe(8);
    expect(g.capacity.value).toBe(8);
  });
  it('TC-GROW-LOGIC-04 连续翻倍 4→8→16（append 6 次后 cap 16）', () => {
    const g = useGrow();
    for (let i = 0; i < 6; i++) g.append();
    expect(g.capacity.value).toBe(16);
  });
  it('TC-GROW-LOGIC-05 appends 计数随每次 +1', () => {
    const g = useGrow();
    g.append();
    g.append();
    g.append();
    expect(g.appends.value).toBe(3);
  });
  it('TC-GROW-LOGIC-06 totalCopies 累计 = 各次扩容拷贝和（4+8）', () => {
    const g = useGrow();
    for (let i = 0; i < 6; i++) g.append(); // 扩容发生在第 2 次(copy4)、第 6 次(copy8)
    expect(g.totalCopies.value).toBe(12);
  });
  it('TC-GROW-LOGIC-07 amortized = (appends+totalCopies)/appends', () => {
    const g = useGrow();
    for (let i = 0; i < 6; i++) g.append();
    expect(g.amortized.value).toBe((g.appends.value + g.totalCopies.value) / g.appends.value);
    expect(g.amortized.value).toBe(3); // (6+12)/6
  });
  it('TC-GROW-LOGIC-08 amortized 有界：append 20 次后 ≤ 3（体现 O(1)）', () => {
    const g = useGrow();
    for (let i = 0; i < 20; i++) g.append();
    expect(g.amortized.value).toBeLessThanOrEqual(3);
    expect(g.amortized.value).toBeGreaterThan(1);
  });
  it('TC-GROW-LOGIC-09 value = ++seq 递增（4,5,6…）', () => {
    const g = useGrow();
    expect(g.append().value).toBe(4);
    expect(g.append().value).toBe(5);
    expect(g.append().value).toBe(6);
  });
  it('TC-GROW-LOGIC-10 reset 复原 cap 4 len 3、计数归零', () => {
    const g = useGrow();
    for (let i = 0; i < 5; i++) g.append();
    g.reset();
    expect(g.capacity.value).toBe(4);
    expect(g.length.value).toBe(3);
    expect(g.items.value.map((it) => it[1])).toEqual([1, 2, 3]);
    expect(g.appends.value).toBe(0);
    expect(g.totalCopies.value).toBe(0);
  });
});
