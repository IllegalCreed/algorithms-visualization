import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TrieViz from './TrieViz.vue';

const mountIt = () => mount(TrieViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: string) => w.find('.val-input').setValue(v);

describe('TrieViz 字典树互动', () => {
  it('TC-VIZ-TRIEVIZ-01 11 tnode + 10 edge + 输入框 + 查找/前缀/重置 3 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.tnode')).toHaveLength(11);
    expect(w.findAll('.edge')).toHaveLength(10);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '前缀')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });
  it('TC-VIZ-TRIEVIZ-02 节点字符含 c/a/t/r/d/u/p/o/g', () => {
    const w = mountIt();
    const chars = w.findAll('.tnode text').map((t) => t.text());
    for (const c of ['c', 'a', 't', 'r', 'd', 'u', 'p', 'o', 'g']) expect(chars).toContain(c);
  });
  it('TC-VIZ-TRIEVIZ-03 查找 card：status 含「是一个词」', async () => {
    const w = mountIt();
    await setVal(w, 'card');
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('是一个词');
  });
  it('TC-VIZ-TRIEVIZ-04 查找 ca：status 含「前缀」', async () => {
    const w = mountIt();
    await setVal(w, 'ca');
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('前缀');
  });
  it('TC-VIZ-TRIEVIZ-05 查找 cab：status 含「不存在」', async () => {
    const w = mountIt();
    await setVal(w, 'cab');
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('不存在');
  });
  it('TC-VIZ-TRIEVIZ-06 前缀 ca：status 含「car」（补全列表）', async () => {
    const w = mountIt();
    await setVal(w, 'ca');
    await btn(w, '前缀').trigger('click');
    expect(w.find('.status').text()).toContain('car');
  });
  it('TC-VIZ-TRIEVIZ-07 前缀 ca：子树点亮 .tnode.lit = 4', async () => {
    const w = mountIt();
    await setVal(w, 'ca');
    await btn(w, '前缀').trigger('click');
    expect(w.findAll('.tnode.lit')).toHaveLength(4);
  });
  it('TC-VIZ-TRIEVIZ-08 重置：清高亮（.tnode.lit/.hot 为 0）', async () => {
    const w = mountIt();
    await setVal(w, 'ca');
    await btn(w, '前缀').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.tnode.lit')).toHaveLength(0);
    expect(w.findAll('.tnode.hot')).toHaveLength(0);
  });
});
