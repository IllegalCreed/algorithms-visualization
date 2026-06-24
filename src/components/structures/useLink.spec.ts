import { describe, it, expect } from 'vitest';
import { useLink, LINK_MAX } from './useLink';

const vals = (l: ReturnType<typeof useLink>) => l.items.value.map((t) => t[1]);

describe('useLink', () => {
  it('TC-LINK-LOGIC-01 初始 [1,2,3]、无选中、can 标志', () => {
    const l = useLink();
    expect(vals(l)).toEqual([1, 2, 3]);
    expect(l.selected.value).toBe(null);
    expect(l.hasSelection.value).toBe(false);
    expect(l.canInsert.value).toBe(false);
    expect(l.canPrepend.value).toBe(true);
  });
  it('TC-LINK-LOGIC-02 valueAt 按位置读、越界 null', () => {
    const l = useLink();
    expect(l.valueAt(0)).toBe(1);
    expect(l.valueAt(2)).toBe(3);
    expect(l.valueAt(-1)).toBe(null);
    expect(l.valueAt(3)).toBe(null);
  });
  it('TC-LINK-LOGIC-03 select toggle：选中/再点取消/换选', () => {
    const l = useLink();
    l.select(1);
    expect(l.selected.value).toBe(1);
    l.select(1);
    expect(l.selected.value).toBe(null);
    l.select(0);
    expect(l.selected.value).toBe(0);
  });
  it('TC-LINK-LOGIC-04 insertAfter 未选返回 null 且不变', () => {
    const l = useLink();
    expect(l.insertAfter()).toBe(null);
    expect(vals(l)).toEqual([1, 2, 3]);
  });
  it('TC-LINK-LOGIC-05 insertAfter 在选中后插递增值、选中落新节点(i+1)、链序、id 唯一', () => {
    const l = useLink();
    l.select(1);
    expect(l.insertAfter()).toBe(4);
    expect(vals(l)).toEqual([1, 2, 4, 3]);
    expect(l.selected.value).toBe(2);
    expect(l.valueAt(2)).toBe(4);
    expect(l.valueAt(3)).toBe(3);
    const ids = l.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-LINK-LOGIC-06 remove 删选中、清空选中', () => {
    const l = useLink();
    l.select(1);
    expect(l.remove()).toBe(2);
    expect(vals(l)).toEqual([1, 3]);
    expect(l.selected.value).toBe(null);
  });
  it('TC-LINK-LOGIC-07 remove 未选返回 null', () => {
    const l = useLink();
    expect(l.remove()).toBe(null);
    expect(vals(l)).toEqual([1, 2, 3]);
  });
  it('TC-LINK-LOGIC-08 prepend 头插递增、落表头、选中随之 +1', () => {
    const l = useLink();
    l.select(1);
    expect(l.prepend()).toBe(4);
    expect(vals(l)).toEqual([4, 1, 2, 3]);
    expect(l.valueAt(0)).toBe(4);
    expect(l.selected.value).toBe(2);
  });
  it('TC-LINK-LOGIC-09 满 LINK_MAX：canPrepend/canInsert 为 false、返回 null', () => {
    const l = useLink();
    while (l.items.value.length < LINK_MAX) l.prepend();
    expect(l.items.value.length).toBe(LINK_MAX);
    expect(l.canPrepend.value).toBe(false);
    expect(l.prepend()).toBe(null);
    l.select(0);
    expect(l.canInsert.value).toBe(false);
    expect(l.insertAfter()).toBe(null);
    expect(l.items.value.length).toBe(LINK_MAX);
  });
  it('TC-LINK-LOGIC-10 reset 复位 [1,2,3]、清选中、下次 prepend=4', () => {
    const l = useLink();
    l.select(0);
    l.insertAfter();
    l.prepend();
    l.reset();
    expect(vals(l)).toEqual([1, 2, 3]);
    expect(l.selected.value).toBe(null);
    expect(l.prepend()).toBe(4);
  });
});
