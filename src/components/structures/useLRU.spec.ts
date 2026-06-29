import { describe, it, expect } from 'vitest';
import { useLRU } from './useLRU';

const keys = (lru: ReturnType<typeof useLRU>) => lru.entries.value.map((e) => e[1]);

describe('useLRU 缓存', () => {
  it('TC-LRU-LOGIC-01 初始 keys [3,2,1]、size 3、capacity 4', () => {
    const lru = useLRU();
    expect(keys(lru)).toEqual([3, 2, 1]);
    expect(lru.size.value).toBe(3);
    expect(lru.capacity).toBe(4);
  });
  it('TC-LRU-LOGIC-02 get(1) 命中：type hit、value 10', () => {
    const lru = useLRU();
    const r = lru.get(1);
    expect(r.type).toBe('hit');
    expect(r.value).toBe(10);
  });
  it('TC-LRU-LOGIC-03 get(1) 移最前：keys [1,3,2]', () => {
    const lru = useLRU();
    lru.get(1);
    expect(keys(lru)).toEqual([1, 3, 2]);
  });
  it('TC-LRU-LOGIC-04 get(9) 未命中：type miss、entries 不变', () => {
    const lru = useLRU();
    const r = lru.get(9);
    expect(r.type).toBe('miss');
    expect(keys(lru)).toEqual([3, 2, 1]);
  });
  it('TC-LRU-LOGIC-05 put(4,40) 新键未满：put-new、keys[0]=4、size 4、无淘汰', () => {
    const lru = useLRU();
    const r = lru.put(4, 40);
    expect(r.type).toBe('put-new');
    expect(r.evicted).toBe(null);
    expect(keys(lru)[0]).toBe(4);
    expect(lru.size.value).toBe(4);
  });
  it('TC-LRU-LOGIC-06 put(2,99) 更新已有：put-update、keys[0]=(2,99)、size 3', () => {
    const lru = useLRU();
    const r = lru.put(2, 99);
    expect(r.type).toBe('put-update');
    expect(lru.entries.value[0][1]).toBe(2);
    expect(lru.entries.value[0][2]).toBe(99);
    expect(lru.size.value).toBe(3);
  });
  it('TC-LRU-LOGIC-07 put 满后淘汰：put(4,40);put(5,50) → evicted 1、keys[0]=5、size 4', () => {
    const lru = useLRU();
    lru.put(4, 40);
    const r = lru.put(5, 50);
    expect(r.evicted).toBe(1);
    expect(keys(lru)[0]).toBe(5);
    expect(lru.size.value).toBe(4);
  });
  it('TC-LRU-LOGIC-08 淘汰的是 LRU 末位：07 后 keys [5,4,3,2]（无 1）', () => {
    const lru = useLRU();
    lru.put(4, 40);
    lru.put(5, 50);
    expect(keys(lru)).toEqual([5, 4, 3, 2]);
  });
  it('TC-LRU-LOGIC-09 连续 put 5 新键：size ≤ capacity 4', () => {
    const lru = useLRU();
    for (const k of [4, 5, 6, 7, 8]) lru.put(k, k * 10);
    expect(lru.size.value).toBe(4);
  });
  it('TC-LRU-LOGIC-10 reset 复原 keys [3,2,1]、size 3', () => {
    const lru = useLRU();
    lru.put(7, 70);
    lru.get(3);
    lru.reset();
    expect(keys(lru)).toEqual([3, 2, 1]);
    expect(lru.size.value).toBe(3);
  });
});
