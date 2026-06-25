import { describe, it, expect } from 'vitest';
import { useTree } from './useTree';

describe('useTree', () => {
  it('TC-TREE-LOGIC-01 初始平衡树 50/30/70/20/40/60/80、pos 正确', () => {
    const t = useTree();
    expect(t.nodes.value).toHaveLength(7);
    expect(t.nodeAt(0)?.value).toBe(50);
    expect(t.nodeAt(1)?.value).toBe(30);
    expect(t.nodeAt(2)?.value).toBe(70);
    expect(t.nodeAt(6)?.value).toBe(80);
  });
  it('TC-TREE-LOGIC-02 has 命中/未命中', () => {
    const t = useTree();
    expect(t.has(50)).toBe(true);
    expect(t.has(99)).toBe(false);
  });
  it('TC-TREE-LOGIC-03 insert 走位落正确 pos + 返回 path', () => {
    const t = useTree();
    const r = t.insert(35);
    expect(r.ok).toBe(true);
    expect(r.pos).toBe(9);
    expect(r.path).toEqual([0, 1, 4]);
    expect(t.nodeAt(9)?.value).toBe(35);
    expect(t.nodes.value).toHaveLength(8);
  });
  it('TC-TREE-LOGIC-04 insert 查重返回 dup、不增', () => {
    const t = useTree();
    const r = t.insert(50);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('dup');
    expect(t.nodes.value).toHaveLength(7);
  });
  it('TC-TREE-LOGIC-05 insert 维持 BST：任意插入后 inorder 升序', () => {
    const t = useTree();
    [35, 10, 90, 45].forEach((v) => t.insert(v));
    const io = t.inorder();
    expect(io).toEqual([...io].sort((a, b) => a - b));
    expect(io).toContain(35);
  });
  it('TC-TREE-LOGIC-06 insert 超 4 层返回 depth', () => {
    const t = useTree();
    expect(t.insert(90).ok).toBe(true); // 落 pos14（第 4 层）
    const r = t.insert(95);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('depth');
    expect(r.path).toEqual([0, 2, 6, 14]);
  });
  it('TC-TREE-LOGIC-07 search 命中返回 found + path', () => {
    const t = useTree();
    const r = t.search(60);
    expect(r.found).toBe(true);
    expect(r.pos).toBe(5);
    expect(r.path).toEqual([0, 2, 5]);
  });
  it('TC-TREE-LOGIC-08 search 未命中返回 false + 走到空位的 path', () => {
    const t = useTree();
    const r = t.search(55);
    expect(r.found).toBe(false);
    expect(r.path).toEqual([0, 2, 5]);
  });
  it('TC-TREE-LOGIC-09 inorder 初始 = 升序', () => {
    const t = useTree();
    expect(t.inorder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
  it('TC-TREE-LOGIC-10 reset 复位 7 节点、清插入', () => {
    const t = useTree();
    t.insert(35);
    t.insert(10);
    t.reset();
    expect(t.nodes.value).toHaveLength(7);
    expect(t.inorder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});
