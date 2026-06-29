import { describe, it, expect } from 'vitest';
import { useSegTree } from './useSegTree';

describe('useSegTree 线段树（固定求和树 [2,5,1,4,9,3,7,6]）', () => {
  it('TC-SEG-LOGIC-01 建树 15 节点、root sum 37、root 区间 [0,7]', () => {
    const t = useSegTree();
    expect(t.nodes.value).toHaveLength(15);
    expect(t.nodes.value[0].sum).toBe(37);
    expect(t.nodes.value[0].lo).toBe(0);
    expect(t.nodes.value[0].hi).toBe(7);
  });

  it('TC-SEG-LOGIC-02 叶子（pos 7..14）还原原数组、均 isLeaf', () => {
    const t = useSegTree();
    const leaves = t.nodes.value.slice(7);
    expect(leaves.map((n) => n.sum)).toEqual([2, 5, 1, 4, 9, 3, 7, 6]);
    expect(leaves.every((n) => n.isLeaf)).toBe(true);
  });

  it('TC-SEG-LOGIC-03 节点管辖区间 [lo,hi]', () => {
    const n = useSegTree().nodes.value;
    expect([n[1].lo, n[1].hi]).toEqual([0, 3]);
    expect([n[2].lo, n[2].hi]).toEqual([4, 7]);
    expect([n[4].lo, n[4].hi]).toEqual([2, 3]);
    expect([n[10].lo, n[10].hi]).toEqual([3, 3]);
  });

  it('TC-SEG-LOGIC-04 内部节点聚合和', () => {
    const n = useSegTree().nodes.value;
    expect([n[1].sum, n[2].sum, n[3].sum, n[4].sum, n[5].sum, n[6].sum]).toEqual([
      12, 25, 7, 5, 12, 13,
    ]);
  });

  it('TC-SEG-LOGIC-05 query(2,5) → sum 17、covered [4,5]', () => {
    const r = useSegTree().query(2, 5);
    expect(r.sum).toBe(17);
    expect(r.covered).toEqual([4, 5]);
  });

  it('TC-SEG-LOGIC-06 query(0,7) → sum 37、covered [0]', () => {
    const r = useSegTree().query(0, 7);
    expect(r.sum).toBe(37);
    expect(r.covered).toEqual([0]);
  });

  it('TC-SEG-LOGIC-07 query(3,3) → sum 4、covered [10]', () => {
    const r = useSegTree().query(3, 3);
    expect(r.sum).toBe(4);
    expect(r.covered).toEqual([10]);
  });

  it('TC-SEG-LOGIC-08 query(1,6) → sum 29、covered 4 段', () => {
    const r = useSegTree().query(1, 6);
    expect(r.sum).toBe(29);
    expect(r.covered).toHaveLength(4);
  });

  it('TC-SEG-LOGIC-09 update(2,10) → path [9,4,1,0]、root 46、pos4 14', () => {
    const t = useSegTree();
    const r = t.update(2, 10);
    expect(r.path).toEqual([9, 4, 1, 0]);
    expect(t.nodes.value[0].sum).toBe(46);
    expect(t.nodes.value[4].sum).toBe(14);
  });

  it('TC-SEG-LOGIC-10 update(2,10) 后 query(2,5) → 26', () => {
    const t = useSegTree();
    t.update(2, 10);
    expect(t.query(2, 5).sum).toBe(26);
  });

  it('TC-SEG-LOGIC-11 reset 复原 root 37、query(2,5) 回 17', () => {
    const t = useSegTree();
    t.update(2, 10);
    t.reset();
    expect(t.nodes.value[0].sum).toBe(37);
    expect(t.query(2, 5).sum).toBe(17);
  });
});
