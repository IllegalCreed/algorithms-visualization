import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BTreeViz from './BTreeViz.vue';

const mountIt = () => mount(BTreeViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setAB = async (w: ReturnType<typeof mountIt>, a: number, b: number) => {
  await w.find('.in-a').setValue(String(a));
  await w.find('.in-b').setValue(String(b));
};
const search = async (w: ReturnType<typeof mountIt>, a: number) => {
  await w.find('.in-a').setValue(String(a));
  await btn(w, '查找').trigger('click');
};
const range = async (w: ReturnType<typeof mountIt>, a: number, b: number) => {
  await setAB(w, a, b);
  await btn(w, '范围').trigger('click');
};

describe('BTreeViz B+ 树互动', () => {
  it('TC-VIZ-BTREEVIZ-01 4 bt-node + 14 bt-key + 2 bt-link + a/b 输入 + 三按钮', () => {
    const w = mountIt();
    expect(w.findAll('.bt-node')).toHaveLength(4);
    expect(w.findAll('.bt-key')).toHaveLength(14);
    expect(w.findAll('.bt-link')).toHaveLength(2);
    expect(w.find('.in-a').exists()).toBe(true);
    expect(w.find('.in-b').exists()).toBe(true);
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '范围')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });

  it('TC-VIZ-BTREEVIZ-02 key 格显数字（5/25/60）', () => {
    const w = mountIt();
    const texts = w.findAll('.bt-key text').map((t) => t.text());
    for (const v of ['5', '25', '60']) expect(texts).toContain(v);
  });

  it('TC-VIZ-BTREEVIZ-03 查找 30：status 含「找到了」、hit 1', async () => {
    const w = mountIt();
    await search(w, 30);
    expect(w.find('.status').text()).toContain('找到了');
    expect(w.findAll('.bt-key.hit')).toHaveLength(1);
  });

  it('TC-VIZ-BTREEVIZ-04 查找 30：下钻路径 onpath 2（root+叶）', async () => {
    const w = mountIt();
    await search(w, 30);
    expect(w.findAll('.bt-node.onpath')).toHaveLength(2);
  });

  it('TC-VIZ-BTREEVIZ-05 查找 33：status 含「不存在」、hit 0', async () => {
    const w = mountIt();
    await search(w, 33);
    expect(w.find('.status').text()).toContain('不存在');
    expect(w.findAll('.bt-key.hit')).toHaveLength(0);
  });

  it('TC-VIZ-BTREEVIZ-06 查找 5：落最左叶、status 含「找到了」', async () => {
    const w = mountIt();
    await search(w, 5);
    expect(w.find('.status').text()).toContain('找到了');
  });

  it('TC-VIZ-BTREEVIZ-07 范围查 12,38：status 含「扫到」、inrange 5', async () => {
    const w = mountIt();
    await range(w, 12, 38);
    expect(w.find('.status').text()).toContain('扫到');
    expect(w.findAll('.bt-key.inrange')).toHaveLength(5);
  });

  it('TC-VIZ-BTREEVIZ-08 范围查 48,99：inrange 3', async () => {
    const w = mountIt();
    await range(w, 48, 99);
    expect(w.findAll('.bt-key.inrange')).toHaveLength(3);
  });

  it('TC-VIZ-BTREEVIZ-09 重置：清高亮（hit/onpath 0）', async () => {
    const w = mountIt();
    await search(w, 30);
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.bt-key.hit')).toHaveLength(0);
    expect(w.findAll('.bt-node.onpath')).toHaveLength(0);
  });
});
