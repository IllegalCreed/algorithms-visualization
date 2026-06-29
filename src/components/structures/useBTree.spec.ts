import { describe, it, expect } from 'vitest';
import { useBTree } from './useBTree';

describe('useBTree B+ 树（固定 2 层：root [25,45] + 3 叶）', () => {
  it('TC-BTREE-LOGIC-01 结构 4 节点、root keys [25,45]、非叶、3 子', () => {
    const t = useBTree();
    expect(t.nodes).toHaveLength(4);
    const root = t.byId('bt-root');
    expect(root.keys).toEqual([25, 45]);
    expect(root.isLeaf).toBe(false);
    expect(root.childrenIds).toEqual(['bt-l0', 'bt-l1', 'bt-l2']);
  });

  it('TC-BTREE-LOGIC-02 叶子 keys + 均 isLeaf', () => {
    const t = useBTree();
    expect(t.byId('bt-l0').keys).toEqual([5, 10, 15, 20]);
    expect(t.byId('bt-l1').keys).toEqual([25, 30, 35, 40]);
    expect(t.byId('bt-l2').keys).toEqual([45, 50, 55, 60]);
    expect(['bt-l0', 'bt-l1', 'bt-l2'].every((id) => t.byId(id).isLeaf)).toBe(true);
  });

  it('TC-BTREE-LOGIC-03 叶链 next', () => {
    const t = useBTree();
    expect(t.byId('bt-l0').nextId).toBe('bt-l1');
    expect(t.byId('bt-l1').nextId).toBe('bt-l2');
    expect(t.byId('bt-l2').nextId).toBeNull();
  });

  it('TC-BTREE-LOGIC-04 search(30) 命中、下钻路径 [root,l1]', () => {
    const r = useBTree().search(30);
    expect(r.found).toBe(true);
    expect(r.path).toEqual(['bt-root', 'bt-l1']);
    expect(r.leafId).toBe('bt-l1');
    expect(r.hitKey).toBe(30);
  });

  it('TC-BTREE-LOGIC-05 search(33) 未命中、路径仍到 l1', () => {
    const r = useBTree().search(33);
    expect(r.found).toBe(false);
    expect(r.path).toEqual(['bt-root', 'bt-l1']);
    expect(r.hitKey).toBeNull();
  });

  it('TC-BTREE-LOGIC-06 search(5) 落最左叶 l0', () => {
    const r = useBTree().search(5);
    expect(r.found).toBe(true);
    expect(r.leafId).toBe('bt-l0');
  });

  it('TC-BTREE-LOGIC-07 search(60) 落最右叶 l2', () => {
    const r = useBTree().search(60);
    expect(r.found).toBe(true);
    expect(r.leafId).toBe('bt-l2');
  });

  it('TC-BTREE-LOGIC-08 search(100) 大值未命中落 l2', () => {
    const r = useBTree().search(100);
    expect(r.found).toBe(false);
    expect(r.leafId).toBe('bt-l2');
  });

  it('TC-BTREE-LOGIC-09 rangeScan(12,38) 跨两叶', () => {
    const r = useBTree().rangeScan(12, 38);
    expect(r.values).toEqual([15, 20, 25, 30, 35]);
    expect(r.leafPath).toEqual(['bt-l0', 'bt-l1']);
  });

  it('TC-BTREE-LOGIC-10 rangeScan(48,99) 仅右叶', () => {
    const r = useBTree().rangeScan(48, 99);
    expect(r.values).toEqual([50, 55, 60]);
    expect(r.leafPath).toEqual(['bt-l2']);
  });

  it('TC-BTREE-LOGIC-11 rangeScan(5,60) 全表 12 值 3 叶', () => {
    const r = useBTree().rangeScan(5, 60);
    expect(r.values).toHaveLength(12);
    expect(r.leafPath).toEqual(['bt-l0', 'bt-l1', 'bt-l2']);
  });

  it('TC-BTREE-LOGIC-12 rangeScan(100,200) 空命中、定位到 l2', () => {
    const r = useBTree().rangeScan(100, 200);
    expect(r.values).toEqual([]);
    expect(r.leafPath).toEqual(['bt-l2']);
  });
});
