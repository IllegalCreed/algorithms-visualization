import { describe, it, expect } from 'vitest';
import { useDeque, DEQUE_MAX } from './useDeque';

describe('useDeque 双端队列', () => {
  it('TC-DEQUE-LOGIC-01 初始 [1,2,3]、size 3、front 1、back 3', () => {
    const d = useDeque();
    expect(d.items.value.map((it) => it[1])).toEqual([1, 2, 3]);
    expect(d.size.value).toBe(3);
    expect(d.front.value).toBe(1);
    expect(d.back.value).toBe(3);
  });
  it('TC-DEQUE-LOGIC-02 pushBack → 4 落尾：[1,2,3,4]、back 4', () => {
    const d = useDeque();
    expect(d.pushBack()).toBe(4);
    expect(d.items.value.map((it) => it[1])).toEqual([1, 2, 3, 4]);
    expect(d.back.value).toBe(4);
  });
  it('TC-DEQUE-LOGIC-03 pushFront → 4 落头：[4,1,2,3]、front 4', () => {
    const d = useDeque();
    expect(d.pushFront()).toBe(4);
    expect(d.items.value.map((it) => it[1])).toEqual([4, 1, 2, 3]);
    expect(d.front.value).toBe(4);
  });
  it('TC-DEQUE-LOGIC-04 popFront → 1、[2,3]', () => {
    const d = useDeque();
    expect(d.popFront()).toBe(1);
    expect(d.items.value.map((it) => it[1])).toEqual([2, 3]);
  });
  it('TC-DEQUE-LOGIC-05 popBack → 3、[1,2]', () => {
    const d = useDeque();
    expect(d.popBack()).toBe(3);
    expect(d.items.value.map((it) => it[1])).toEqual([1, 2]);
  });
  it('TC-DEQUE-LOGIC-06 popFront×3 → isEmpty、front/back null', () => {
    const d = useDeque();
    d.popFront();
    d.popFront();
    d.popFront();
    expect(d.size.value).toBe(0);
    expect(d.isEmpty.value).toBe(true);
    expect(d.front.value).toBe(null);
    expect(d.back.value).toBe(null);
  });
  it('TC-DEQUE-LOGIC-07 满（push 到 DEQUE_MAX）后 pushBack/pushFront → null', () => {
    const d = useDeque();
    while (!d.isFull.value) d.pushBack();
    expect(d.size.value).toBe(DEQUE_MAX);
    expect(d.pushBack()).toBe(null);
    expect(d.pushFront()).toBe(null);
  });
  it('TC-DEQUE-LOGIC-08 空时 popFront/popBack → null', () => {
    const d = useDeque();
    d.popFront();
    d.popFront();
    d.popFront();
    expect(d.popFront()).toBe(null);
    expect(d.popBack()).toBe(null);
  });
  it('TC-DEQUE-LOGIC-09 reset 复原 [1,2,3]', () => {
    const d = useDeque();
    d.pushFront();
    d.popBack();
    d.reset();
    expect(d.items.value.map((it) => it[1])).toEqual([1, 2, 3]);
  });
  it('TC-DEQUE-LOGIC-10 栈=尾进尾出(LIFO)、队列=尾进头出(FIFO)', () => {
    const d = useDeque();
    expect(d.pushBack()).toBe(4); // [1,2,3,4]
    expect(d.popBack()).toBe(4); // 栈：尾端拿到刚压入的 4
    expect(d.popFront()).toBe(1); // 队列：头端拿到最早的 1
  });
});
