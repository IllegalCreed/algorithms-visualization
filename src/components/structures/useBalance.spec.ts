import { describe, it, expect } from 'vitest';
import { useBalance } from './useBalance';

describe('useBalance', () => {
  it('TC-BAL-LOGIC-01 chain 结构：7 节点 1-7、6 边、高度 7、最坏 7', () => {
    const b = useBalance();
    expect(b.chain.nodes.map((n) => n.value)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(b.chain.edges).toHaveLength(6);
    expect(b.chain.height).toBe(7);
    expect(b.chain.worst).toBe(7);
  });
  it('TC-BAL-LOGIC-02 balanced 结构：7 节点 4/2/6/1/3/5/7、6 边、高度 3、最坏 3', () => {
    const b = useBalance();
    expect(b.balanced.nodes.map((n) => n.value)).toEqual([4, 2, 6, 1, 3, 5, 7]);
    expect(b.balanced.edges).toHaveLength(6);
    expect(b.balanced.height).toBe(3);
    expect(b.balanced.worst).toBe(3);
  });
  it('TC-BAL-LOGIC-03 节点带坐标 + id 唯一', () => {
    const b = useBalance();
    expect(typeof b.chain.nodes[0].x).toBe('number');
    const ids = [...b.chain.nodes, ...b.balanced.nodes].map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('TC-BAL-LOGIC-04 search(7, chain) 走 7 步（退化 O(n)）', () => {
    const r = useBalance().search(7, 'chain');
    expect(r.steps).toBe(7);
    expect(r.path).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
  it('TC-BAL-LOGIC-05 search(7, balanced) 走 3 步（O(log n)）', () => {
    const r = useBalance().search(7, 'balanced');
    expect(r.steps).toBe(3);
    expect(r.path).toEqual([0, 2, 6]);
  });
  it('TC-BAL-LOGIC-06 chain search 步数 = 值（升序链）', () => {
    const b = useBalance();
    expect(b.search(3, 'chain').steps).toBe(3);
    expect(b.search(5, 'chain').steps).toBe(5);
  });
  it('TC-BAL-LOGIC-07 balanced：根 1 步、叶 3 步', () => {
    const b = useBalance();
    expect(b.search(4, 'balanced').steps).toBe(1);
    expect(b.search(1, 'balanced').steps).toBe(3);
    expect(b.search(5, 'balanced').steps).toBe(3);
  });
  it('TC-BAL-LOGIC-08 同值两 mode 步数不同（7：7 vs 3）', () => {
    const b = useBalance();
    expect(b.search(7, 'chain').steps).not.toBe(b.search(7, 'balanced').steps);
  });
});
