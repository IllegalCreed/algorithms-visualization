import { describe, it, expect } from 'vitest';
import { useSkipList } from './useSkipList';

const elemCount = (sk: ReturnType<typeof useSkipList>, lv: number) =>
  sk.levelNodes(lv).filter((i) => !sk.nodes[i].isHead).length;

describe('useSkipList 跳表', () => {
  it('TC-SKIP-LOGIC-01 nodes 9（head+8）、maxLevel 4、元素值 [1..15 奇]', () => {
    const sk = useSkipList();
    expect(sk.nodes).toHaveLength(9);
    expect(sk.maxLevel).toBe(4);
    expect(sk.nodes.slice(1).map((n) => n.value)).toEqual([1, 3, 5, 7, 9, 11, 13, 15]);
  });
  it('TC-SKIP-LOGIC-02 元素 heights [4,1,2,1,3,1,2,1]、head height 4', () => {
    const sk = useSkipList();
    expect(sk.nodes.slice(1).map((n) => n.height)).toEqual([4, 1, 2, 1, 3, 1, 2, 1]);
    expect(sk.nodes[0].height).toBe(4);
    expect(sk.nodes[0].isHead).toBe(true);
  });
  it('TC-SKIP-LOGIC-03 各层元素数（不含 head）：L0 8、L1 4、L2 2、L3 1', () => {
    const sk = useSkipList();
    expect([elemCount(sk, 0), elemCount(sk, 1), elemCount(sk, 2), elemCount(sk, 3)]).toEqual([
      8, 4, 2, 1,
    ]);
  });
  it('TC-SKIP-LOGIC-04 search(11) found', () => {
    expect(useSkipList().search(11).found).toBe(true);
  });
  it('TC-SKIP-LOGIC-05 search(11) visitedValues [1,9,11]（跳过 3,5,7）', () => {
    expect(useSkipList().search(11).visitedValues).toEqual([1, 9, 11]);
  });
  it('TC-SKIP-LOGIC-06 search(8) not found、visitedValues [1,5,7]', () => {
    const r = useSkipList().search(8);
    expect(r.found).toBe(false);
    expect(r.visitedValues).toEqual([1, 5, 7]);
  });
  it('TC-SKIP-LOGIC-07 search(1) found（首元素）', () => {
    expect(useSkipList().search(1).found).toBe(true);
  });
  it('TC-SKIP-LOGIC-08 search(15) found、visitedValues [1,9,13,15]', () => {
    const r = useSkipList().search(15);
    expect(r.found).toBe(true);
    expect(r.visitedValues).toEqual([1, 9, 13, 15]);
  });
  it('TC-SKIP-LOGIC-09 search(99) not found（落 15）', () => {
    expect(useSkipList().search(99).found).toBe(false);
  });
  it('TC-SKIP-LOGIC-10 path：level 单调不增、move ∈ {start,right,down}', () => {
    const { path } = useSkipList().search(11);
    for (let i = 1; i < path.length; i++)
      expect(path[i].level).toBeLessThanOrEqual(path[i - 1].level);
    for (const s of path) expect(['start', 'right', 'down']).toContain(s.move);
  });
});
