import { describe, it, expect } from 'vitest';
import { useDlink } from './useDlink';

describe('useDlink 双向链表', () => {
  it('TC-DLINK-LOGIC-01 初始 items 值 [10,20,30,40]、长度 4', () => {
    const d = useDlink();
    expect(d.items.value.map((it) => it[1])).toEqual([10, 20, 30, 40]);
    expect(d.items.value).toHaveLength(4);
  });
  it('TC-DLINK-LOGIC-02 forward = [10,20,30,40]（沿 next）', () => {
    const d = useDlink();
    expect(d.forward.value).toEqual([10, 20, 30, 40]);
  });
  it('TC-DLINK-LOGIC-03 backward = [40,30,20,10]（沿 prev）', () => {
    const d = useDlink();
    expect(d.backward.value).toEqual([40, 30, 20, 10]);
  });
  it('TC-DLINK-LOGIC-04 select toggle + hasSelection', () => {
    const d = useDlink();
    expect(d.hasSelection.value).toBe(false);
    d.select(1);
    expect(d.selected.value).toBe(1);
    expect(d.hasSelection.value).toBe(true);
    d.select(1);
    expect(d.selected.value).toBe(null);
    expect(d.hasSelection.value).toBe(false);
  });
  it('TC-DLINK-LOGIC-05 removeAt 中部（选1=20）：→[10,30,40]、rewire{0,2}', () => {
    const d = useDlink();
    d.select(1);
    const r = d.removeAt();
    expect(r?.value).toBe(20);
    expect(r?.rewire).toEqual({ left: 0, right: 2 });
    expect(d.items.value.map((it) => it[1])).toEqual([10, 30, 40]);
  });
  it('TC-DLINK-LOGIC-06 removeAt 头（选0=10）：→[20,30,40]、rewire.left=head', () => {
    const d = useDlink();
    d.select(0);
    const r = d.removeAt();
    expect(r?.value).toBe(10);
    expect(r?.rewire.left).toBe('head');
    expect(r?.rewire.right).toBe(1);
    expect(d.items.value.map((it) => it[1])).toEqual([20, 30, 40]);
  });
  it('TC-DLINK-LOGIC-07 removeAt 尾（选3=40）：→[10,20,30]、rewire.right=tail', () => {
    const d = useDlink();
    d.select(3);
    const r = d.removeAt();
    expect(r?.value).toBe(40);
    expect(r?.rewire.left).toBe(2);
    expect(r?.rewire.right).toBe('tail');
    expect(d.items.value.map((it) => it[1])).toEqual([10, 20, 30]);
  });
  it('TC-DLINK-LOGIC-08 removeAt 无选中 → null、items 不变', () => {
    const d = useDlink();
    expect(d.removeAt()).toBe(null);
    expect(d.items.value.map((it) => it[1])).toEqual([10, 20, 30, 40]);
  });
  it('TC-DLINK-LOGIC-09 删除后 backward 更新（删1后 [40,30,10]）', () => {
    const d = useDlink();
    d.select(1);
    d.removeAt();
    expect(d.backward.value).toEqual([40, 30, 10]);
  });
  it('TC-DLINK-LOGIC-10 reset 复原 [10,20,30,40]、清选中', () => {
    const d = useDlink();
    d.select(2);
    d.removeAt();
    d.reset();
    expect(d.items.value.map((it) => it[1])).toEqual([10, 20, 30, 40]);
    expect(d.selected.value).toBe(null);
  });
});
