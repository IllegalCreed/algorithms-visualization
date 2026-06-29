import { describe, it, expect } from 'vitest';
import { useBloom } from './useBloom';

const setBits = (b: ReturnType<typeof useBloom>) =>
  b.bits.value.flatMap((on, i) => (on ? [i] : []));

describe('useBloom 布隆过滤器（固定 m=16 / k=3）', () => {
  it('TC-BLOOM-LOGIC-01 初始 16 位全 0、size 16、k 3', () => {
    const b = useBloom();
    expect(b.bits.value).toHaveLength(16);
    expect(b.bits.value.every((v) => v === false)).toBe(true);
    expect(b.size).toBe(16);
    expect(b.k).toBe(3);
  });

  it('TC-BLOOM-LOGIC-02 hashes(3) = [3,5,6]', () => {
    expect(useBloom().hashes(3)).toEqual([3, 5, 6]);
  });

  it('TC-BLOOM-LOGIC-03 hashes(7)=[7,1,2]、hashes(11)=[11,13,14]', () => {
    const b = useBloom();
    expect(b.hashes(7)).toEqual([7, 1, 2]);
    expect(b.hashes(11)).toEqual([11, 13, 14]);
  });

  it('TC-BLOOM-LOGIC-04 add(3) 置位 [3,5,6]', () => {
    const b = useBloom();
    const r = b.add(3);
    expect(r.positions).toEqual([3, 5, 6]);
    expect(setBits(b)).toEqual([3, 5, 6]);
  });

  it('TC-BLOOM-LOGIC-05 add 3/7/11 后并集 9 位', () => {
    const b = useBloom();
    b.add(3);
    b.add(7);
    b.add(11);
    expect(setBits(b)).toEqual([1, 2, 3, 5, 6, 7, 11, 13, 14]);
  });

  it('TC-BLOOM-LOGIC-06 query(7) 真命中', () => {
    const b = useBloom();
    b.add(3);
    b.add(7);
    b.add(11);
    const r = b.query(7);
    expect(r.mightExist).toBe(true);
    expect(r.actuallyAdded).toBe(true);
    expect(r.falsePositive).toBe(false);
  });

  it('TC-BLOOM-LOGIC-07 query(5) 一定不存在（bit12=0）', () => {
    const b = useBloom();
    b.add(3);
    b.add(7);
    b.add(11);
    const r = b.query(5);
    expect(r.positions).toEqual([5, 3, 12]);
    expect(r.mightExist).toBe(false);
  });

  it('TC-BLOOM-LOGIC-08 query(2) 误判（假阳性）', () => {
    const b = useBloom();
    b.add(3);
    b.add(7);
    b.add(11);
    const r = b.query(2);
    expect(r.positions).toEqual([2, 14, 11]);
    expect(r.mightExist).toBe(true);
    expect(r.actuallyAdded).toBe(false);
    expect(r.falsePositive).toBe(true);
  });

  it('TC-BLOOM-LOGIC-09 query(4) 未命中有 0', () => {
    const b = useBloom();
    b.add(3);
    b.add(7);
    b.add(11);
    const r = b.query(4);
    expect(r.positions).toEqual([4, 12, 1]);
    expect(r.mightExist).toBe(false);
  });

  it('TC-BLOOM-LOGIC-10 add 幂等', () => {
    const b = useBloom();
    b.add(3);
    b.add(3);
    expect(setBits(b)).toEqual([3, 5, 6]);
  });

  it('TC-BLOOM-LOGIC-11 空表 query(7) 一定不存在', () => {
    expect(useBloom().query(7).mightExist).toBe(false);
  });

  it('TC-BLOOM-LOGIC-12 reset 清零、其后 query(7) 不存在', () => {
    const b = useBloom();
    b.add(3);
    b.add(7);
    b.add(11);
    b.reset();
    expect(b.bits.value.every((v) => v === false)).toBe(true);
    expect(b.query(7).mightExist).toBe(false);
  });
});
