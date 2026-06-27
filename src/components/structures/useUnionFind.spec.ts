import { describe, it, expect } from 'vitest';
import { useUnionFind } from './useUnionFind';

const chain = (uf: ReturnType<typeof useUnionFind>) => {
  uf.union(0, 1);
  uf.union(1, 2);
  uf.union(2, 3); // 0→1→2→3
};

describe('useUnionFind 并查集', () => {
  it('TC-UF-LOGIC-01 初始 parent [0..7]、groupCount 8', () => {
    const uf = useUnionFind();
    expect(uf.parent.value).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(uf.groupCount.value).toBe(8);
  });
  it('TC-UF-LOGIC-02 union(0,1)：merged、parent[0]=1、groupCount 7', () => {
    const uf = useUnionFind();
    const r = uf.union(0, 1);
    expect(r.merged).toBe(true);
    expect(uf.parent.value[0]).toBe(1);
    expect(uf.groupCount.value).toBe(7);
  });
  it('TC-UF-LOGIC-03 union 同组：再 union(0,1) → merged false、组不减', () => {
    const uf = useUnionFind();
    uf.union(0, 1);
    const r = uf.union(0, 1);
    expect(r.merged).toBe(false);
    expect(uf.groupCount.value).toBe(7);
  });
  it('TC-UF-LOGIC-04 链 0→1→2→3 后 find(0)：root 3、path [0,1,2,3]', () => {
    const uf = useUnionFind();
    chain(uf);
    const r = uf.find(0);
    expect(r.root).toBe(3);
    expect(r.path).toEqual([0, 1, 2, 3]);
  });
  it('TC-UF-LOGIC-05 find 纯走位不改 parent', () => {
    const uf = useUnionFind();
    chain(uf);
    const before = [...uf.parent.value];
    uf.find(0);
    expect(uf.parent.value).toEqual(before);
  });
  it('TC-UF-LOGIC-06 compress(0)（链后）：parent[0/1/2]=3、root 3', () => {
    const uf = useUnionFind();
    chain(uf);
    const r = uf.compress(0);
    expect(r.root).toBe(3);
    expect(uf.parent.value[0]).toBe(3);
    expect(uf.parent.value[1]).toBe(3);
    expect(uf.parent.value[2]).toBe(3);
  });
  it('TC-UF-LOGIC-07 connected：union(0,1)(2,3)；(0,1)true、(0,2)false', () => {
    const uf = useUnionFind();
    uf.union(0, 1);
    uf.union(2, 3);
    expect(uf.connected(0, 1)).toBe(true);
    expect(uf.connected(0, 2)).toBe(false);
  });
  it('TC-UF-LOGIC-08 connected 经链：链后 connected(0,3) true', () => {
    const uf = useUnionFind();
    chain(uf);
    expect(uf.connected(0, 3)).toBe(true);
  });
  it('TC-UF-LOGIC-09 groupCount 随 union 递减（3 次后 5）', () => {
    const uf = useUnionFind();
    chain(uf);
    expect(uf.groupCount.value).toBe(5);
  });
  it('TC-UF-LOGIC-10 reset 复原 parent [0..7]、groupCount 8', () => {
    const uf = useUnionFind();
    chain(uf);
    uf.compress(0);
    uf.reset();
    expect(uf.parent.value).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(uf.groupCount.value).toBe(8);
  });
});
