import { describe, it, expect } from 'vitest';
import { useTrie } from './useTrie';

describe('useTrie 字典树', () => {
  it('TC-TRIE-LOGIC-01 nodes 11、edges 10、words 6（排序）', () => {
    const t = useTrie();
    expect(t.nodes).toHaveLength(11);
    expect(t.edges).toHaveLength(10);
    expect(t.words).toEqual(['car', 'card', 'cat', 'cup', 'do', 'dog']);
  });
  it('TC-TRIE-LOGIC-02 root：char ""、isEnd false、parent -1', () => {
    const t = useTrie();
    expect(t.nodes[0].char).toBe('');
    expect(t.nodes[0].isEnd).toBe(false);
    expect(t.nodes[0].parent).toBe(-1);
  });
  it('TC-TRIE-LOGIC-03 节点带坐标 + id 唯一 + 非 root char 单字符', () => {
    const t = useTrie();
    expect(typeof t.nodes[1].x).toBe('number');
    const ids = t.nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const n of t.nodes.slice(1)) expect(n.char).toHaveLength(1);
  });
  it('TC-TRIE-LOGIC-04 共享前缀：search(car) 与 search(cat) 前 3 节点相同', () => {
    const t = useTrie();
    const a = t.search('car').path.slice(0, 3);
    const b = t.search('cat').path.slice(0, 3);
    expect(a).toEqual(b);
    expect(a).toEqual([0, 1, 2]);
  });
  it('TC-TRIE-LOGIC-05 search(card)：found、reason found', () => {
    const t = useTrie();
    const r = t.search('card');
    expect(r.found).toBe(true);
    expect(r.reason).toBe('found');
  });
  it('TC-TRIE-LOGIC-06 search(ca)：prefix-only（不是词）', () => {
    const t = useTrie();
    const r = t.search('ca');
    expect(r.found).toBe(false);
    expect(r.reason).toBe('prefix-only');
  });
  it('TC-TRIE-LOGIC-07 search(cab)：no-edge（不存在）', () => {
    const t = useTrie();
    const r = t.search('cab');
    expect(r.found).toBe(false);
    expect(r.reason).toBe('no-edge');
  });
  it('TC-TRIE-LOGIC-08 startsWith(ca).words = [car,card,cat]', () => {
    const t = useTrie();
    expect(t.startsWith('ca').words).toEqual(['car', 'card', 'cat']);
  });
  it('TC-TRIE-LOGIC-09 startsWith(do)：words [do,dog]、subtree 2 节点', () => {
    const t = useTrie();
    const r = t.startsWith('do');
    expect(r.words).toEqual(['do', 'dog']);
    expect(r.subtree).toHaveLength(2);
  });
  it('TC-TRIE-LOGIC-10 startsWith(xyz)：prefixNode -1、words []', () => {
    const t = useTrie();
    const r = t.startsWith('xyz');
    expect(r.prefixNode).toBe(-1);
    expect(r.words).toEqual([]);
  });
});
