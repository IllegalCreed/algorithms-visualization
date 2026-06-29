import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LruViz from './LruViz.vue';

const mountIt = () =>
  mount(LruViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setKV = async (w: ReturnType<typeof mountIt>, k: number, v: number) => {
  const inputs = w.findAll('.val-input');
  await inputs[0].setValue(String(k));
  await inputs[1].setValue(String(v));
};
const firstKey = (w: ReturnType<typeof mountIt>) => w.findAll('.lru-key')[0].text();

describe('LruViz 缓存互动', () => {
  it('TC-VIZ-LRUVIZ-01 初始 3 lru-cell + 两输入 + get/put/重置 + MRU/LRU 标记', () => {
    const w = mountIt();
    expect(w.findAll('.lru-cell')).toHaveLength(3);
    expect(w.findAll('.val-input')).toHaveLength(2);
    expect(btn(w, 'get')).toBeTruthy();
    expect(btn(w, 'put')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.find('.m-mru').exists()).toBe(true);
    expect(w.find('.m-lru').exists()).toBe(true);
  });
  it('TC-VIZ-LRUVIZ-02 cell 键含 3/2/1', () => {
    const w = mountIt();
    expect(w.findAll('.lru-key').map((t) => t.text())).toEqual(['3', '2', '1']);
  });
  it('TC-VIZ-LRUVIZ-03 get(1) 命中：status 含「找到」、首个 cell 键 1', async () => {
    const w = mountIt();
    await setKV(w, 1, 100);
    await btn(w, 'get').trigger('click');
    expect(w.find('.status').text()).toContain('找到');
    expect(firstKey(w)).toBe('1');
  });
  it('TC-VIZ-LRUVIZ-04 get(9) 未命中：status 含「没有」', async () => {
    const w = mountIt();
    await setKV(w, 9, 100);
    await btn(w, 'get').trigger('click');
    expect(w.find('.status').text()).toContain('没有');
  });
  it('TC-VIZ-LRUVIZ-05 put(4,40) 新键：4 lru-cell、首个 cell 键 4', async () => {
    const w = mountIt();
    await setKV(w, 4, 40);
    await btn(w, 'put').trigger('click');
    expect(w.findAll('.lru-cell')).toHaveLength(4);
    expect(firstKey(w)).toBe('4');
  });
  it('TC-VIZ-LRUVIZ-06 put 满后淘汰：填满再 put → status 含「淘汰」、cell 仍 4', async () => {
    const w = mountIt();
    await setKV(w, 4, 40);
    await btn(w, 'put').trigger('click'); // size 4（满）
    await setKV(w, 5, 50);
    await btn(w, 'put').trigger('click'); // 淘汰
    expect(w.find('.status').text()).toContain('淘汰');
    expect(w.findAll('.lru-cell')).toHaveLength(4);
  });
  it('TC-VIZ-LRUVIZ-07 put(2,99) 更新：status 含「更新」', async () => {
    const w = mountIt();
    await setKV(w, 2, 99);
    await btn(w, 'put').trigger('click');
    expect(w.find('.status').text()).toContain('更新');
  });
  it('TC-VIZ-LRUVIZ-08 重置：3 lru-cell', async () => {
    const w = mountIt();
    await setKV(w, 4, 40);
    await btn(w, 'put').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.lru-cell')).toHaveLength(3);
  });
});
