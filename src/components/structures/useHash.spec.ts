import { describe, it, expect } from 'vitest';
import { useHash, HASH_MAX } from './useHash';

const keys = (h: ReturnType<typeof useHash>, b: number) => h.buckets.value[b].map((e) => e[1]);

describe('useHash', () => {
  it('TC-HASH-LOGIC-01 初始：7 桶、桶1=[15,8]、桶2=[23]、桶4=[4]、size 4', () => {
    const h = useHash();
    expect(h.buckets.value).toHaveLength(7);
    expect(keys(h, 1)).toEqual([15, 8]);
    expect(keys(h, 2)).toEqual([23]);
    expect(keys(h, 4)).toEqual([4]);
    expect(keys(h, 0)).toEqual([]);
    expect(h.size.value).toBe(4);
  });
  it('TC-HASH-LOGIC-02 hash = key % 7', () => {
    const h = useHash();
    expect(h.hash(11)).toBe(4);
    expect(h.hash(8)).toBe(1);
    expect(h.hash(7)).toBe(0);
  });
  it('TC-HASH-LOGIC-03 has 命中/未命中', () => {
    const h = useHash();
    expect(h.has(15)).toBe(true);
    expect(h.has(99)).toBe(false);
  });
  it('TC-HASH-LOGIC-04 insert 空桶直放（无冲突）', () => {
    const h = useHash();
    const r = h.insert(7); // 7%7=0，空桶
    expect(r.ok).toBe(true);
    expect(r.bucket).toBe(0);
    expect(r.collision).toBe(false);
    expect(keys(h, 0)).toEqual([7]);
  });
  it('TC-HASH-LOGIC-05 insert 冲突追加链尾', () => {
    const h = useHash();
    const r = h.insert(11); // 11%7=4，桶4 已有 [4]
    expect(r.ok).toBe(true);
    expect(r.bucket).toBe(4);
    expect(r.collision).toBe(true);
    expect(keys(h, 4)).toEqual([4, 11]);
  });
  it('TC-HASH-LOGIC-06 insert 查重不插', () => {
    const h = useHash();
    const r = h.insert(15);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('dup');
    expect(keys(h, 1)).toEqual([15, 8]);
  });
  it('TC-HASH-LOGIC-07 search 命中返回 bucket + steps', () => {
    const h = useHash();
    const r = h.search(8); // 桶1 第2个
    expect(r.found).toBe(true);
    expect(r.bucket).toBe(1);
    expect(r.steps).toBe(2);
  });
  it('TC-HASH-LOGIC-08 search 没找到（走完链）', () => {
    const h = useHash();
    const r = h.search(22); // 22%7=1，桶1=[15,8] 无 22
    expect(r.found).toBe(false);
    expect(r.bucket).toBe(1);
    expect(r.steps).toBe(2);
  });
  it('TC-HASH-LOGIC-09 满 HASH_MAX：canInsert false、insert full、id 唯一', () => {
    const h = useHash();
    let k = 30;
    while (h.size.value < HASH_MAX) h.insert(k++);
    expect(h.size.value).toBe(HASH_MAX);
    expect(h.canInsert.value).toBe(false);
    expect(h.insert(99).reason).toBe('full');
    const ids = h.buckets.value.flat().map((e) => e[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-HASH-LOGIC-10 reset 复位初始', () => {
    const h = useHash();
    h.insert(7);
    h.insert(11);
    h.reset();
    expect(keys(h, 1)).toEqual([15, 8]);
    expect(h.size.value).toBe(4);
  });
});
