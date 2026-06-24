import { describe, it, expect } from 'vitest';
import { useArray, ARRAY_MAX } from './useArray';

const vals = (a: ReturnType<typeof useArray>) => a.items.value.map((t) => t[1]);

describe('useArray', () => {
  it('TC-ARRAY-LOGIC-01 初始 [1,2,3,4]、无选中、can 标志', () => {
    const a = useArray();
    expect(vals(a)).toEqual([1, 2, 3, 4]);
    expect(a.selected.value).toBe(null);
    expect(a.hasSelection.value).toBe(false);
    expect(a.canInsert.value).toBe(false);
    expect(a.canAppend.value).toBe(true);
  });
  it('TC-ARRAY-LOGIC-02 valueAt 按下标读、越界 null', () => {
    const a = useArray();
    expect(a.valueAt(0)).toBe(1);
    expect(a.valueAt(3)).toBe(4);
    expect(a.valueAt(-1)).toBe(null);
    expect(a.valueAt(4)).toBe(null);
  });
  it('TC-ARRAY-LOGIC-03 select toggle：选中/再点取消/换选', () => {
    const a = useArray();
    a.select(2);
    expect(a.selected.value).toBe(2);
    a.select(2);
    expect(a.selected.value).toBe(null);
    a.select(0);
    expect(a.selected.value).toBe(0);
  });
  it('TC-ARRAY-LOGIC-04 insert 未选返回 null 且不变', () => {
    const a = useArray();
    expect(a.insert()).toBe(null);
    expect(vals(a)).toEqual([1, 2, 3, 4]);
  });
  it('TC-ARRAY-LOGIC-05 insert 在 i 处插入递增值、i 起右移、保持选中落新元素、下标≠值、id 唯一', () => {
    const a = useArray();
    a.select(2);
    expect(a.insert()).toBe(5);
    expect(vals(a)).toEqual([1, 2, 5, 3, 4]);
    expect(a.selected.value).toBe(2);
    expect(a.valueAt(2)).toBe(5);
    expect(a.valueAt(3)).toBe(3);
    const ids = a.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-ARRAY-LOGIC-06 remove 删 i、后续左移、清空选中', () => {
    const a = useArray();
    a.select(2);
    a.insert(); // [1,2,5,3,4]，选中仍落在新元素（下标 2）
    expect(a.remove()).toBe(5);
    expect(vals(a)).toEqual([1, 2, 3, 4]);
    expect(a.selected.value).toBe(null);
  });
  it('TC-ARRAY-LOGIC-07 remove 未选返回 null', () => {
    const a = useArray();
    expect(a.remove()).toBe(null);
    expect(vals(a)).toEqual([1, 2, 3, 4]);
  });
  it('TC-ARRAY-LOGIC-08 append 尾插递增、不动选中', () => {
    const a = useArray();
    a.select(1);
    expect(a.append()).toBe(5);
    expect(vals(a)).toEqual([1, 2, 3, 4, 5]);
    expect(a.selected.value).toBe(1);
  });
  it('TC-ARRAY-LOGIC-09 满 ARRAY_MAX：canAppend/canInsert 为 false、返回 null', () => {
    const a = useArray();
    while (a.items.value.length < ARRAY_MAX) a.append();
    expect(a.items.value.length).toBe(ARRAY_MAX);
    expect(a.canAppend.value).toBe(false);
    expect(a.append()).toBe(null);
    a.select(0);
    expect(a.canInsert.value).toBe(false);
    expect(a.insert()).toBe(null);
    expect(a.items.value.length).toBe(ARRAY_MAX);
  });
  it('TC-ARRAY-LOGIC-10 reset 复位 [1,2,3,4]、清选中、下次 append=5', () => {
    const a = useArray();
    a.select(1);
    a.insert();
    a.append();
    a.reset();
    expect(vals(a)).toEqual([1, 2, 3, 4]);
    expect(a.selected.value).toBe(null);
    expect(a.append()).toBe(5);
  });
});
