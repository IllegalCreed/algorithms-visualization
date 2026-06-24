import { describe, it, expect } from 'vitest';
import { useQueue, QUEUE_MAX } from './useQueue';

describe('useQueue', () => {
  it('TC-QUEUE-LOGIC-01 初始空：items 空、front null、canDequeue F、canEnqueue T', () => {
    const q = useQueue();
    expect(q.items.value).toEqual([]);
    expect(q.front.value).toBe(null);
    expect(q.canDequeue.value).toBe(false);
    expect(q.canEnqueue.value).toBe(true);
  });
  it('TC-QUEUE-LOGIC-02 enqueue 追加递增序号、返回值；FIFO 下 front 保持队首不变', () => {
    const q = useQueue();
    expect(q.enqueue()).toBe(1);
    expect(q.front.value).toBe(1);
    expect(q.enqueue()).toBe(2);
    expect(q.items.value.map((t) => t[1])).toEqual([1, 2]);
    expect(q.front.value).toBe(1); // enqueue 不改 front（区别于栈 top）
  });
  it('TC-QUEUE-LOGIC-03 dequeue 删队首返回原队首；空 dequeue 返回 null', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    expect(q.dequeue()).toBe(1);
    expect(q.items.value.map((t) => t[1])).toEqual([2]);
    expect(q.front.value).toBe(2);
    expect(q.dequeue()).toBe(2);
    expect(q.dequeue()).toBe(null);
  });
  it('TC-QUEUE-LOGIC-04 peek 返回队首但不改变 items', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    expect(q.peek()).toBe(1);
    expect(q.items.value.length).toBe(2);
  });
  it('TC-QUEUE-LOGIC-05 reset 清空且 seq 归零', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    q.reset();
    expect(q.items.value).toEqual([]);
    expect(q.enqueue()).toBe(1);
  });
  it('TC-QUEUE-LOGIC-06 canEnqueue 满 QUEUE_MAX 为 false、enqueue 返回 null', () => {
    const q = useQueue();
    for (let i = 0; i < QUEUE_MAX; i++) q.enqueue();
    expect(q.items.value.length).toBe(QUEUE_MAX);
    expect(q.canEnqueue.value).toBe(false);
    expect(q.enqueue()).toBe(null);
    expect(q.items.value.length).toBe(QUEUE_MAX);
  });
  it('TC-QUEUE-LOGIC-07 每个元素 id 唯一', () => {
    const q = useQueue();
    q.enqueue();
    q.enqueue();
    q.enqueue();
    const ids = q.items.value.map((t) => t[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-QUEUE-LOGIC-08 canDequeue 随空/非空切换', () => {
    const q = useQueue();
    expect(q.canDequeue.value).toBe(false);
    q.enqueue();
    expect(q.canDequeue.value).toBe(true);
    q.dequeue();
    expect(q.canDequeue.value).toBe(false);
  });
});
