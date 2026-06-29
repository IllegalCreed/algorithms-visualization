import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SkipListViz from './SkipListViz.vue';

const mountIt = () => mount(SkipListViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const search = async (w: ReturnType<typeof mountIt>, v: number) => {
  await w.find('.val-input').setValue(String(v));
  await btn(w, '查找').trigger('click');
};

describe('SkipListViz 跳表互动', () => {
  it('TC-VIZ-SKIPVIZ-01 网格 19 skip-cell + 输入 + 查找/重置 + head', () => {
    const w = mountIt();
    expect(w.findAll('.skip-cell')).toHaveLength(19);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.find('.skip-cell.head').exists()).toBe(true);
  });
  it('TC-VIZ-SKIPVIZ-02 元素值 1/3/5/7/9/11/13/15 出现', () => {
    const w = mountIt();
    const texts = w.findAll('.skip-cell text').map((t) => t.text());
    for (const v of ['1', '3', '5', '7', '9', '11', '13', '15']) expect(texts).toContain(v);
  });
  it('TC-VIZ-SKIPVIZ-03 查找 11：status 含「跳过」且「找到了」', async () => {
    const w = mountIt();
    await search(w, 11);
    const s = w.find('.status').text();
    expect(s).toContain('跳过');
    expect(s).toContain('找到了');
  });
  it('TC-VIZ-SKIPVIZ-04 查找 8：status 含「没找到」', async () => {
    const w = mountIt();
    await search(w, 8);
    expect(w.find('.status').text()).toContain('没找到');
  });
  it('TC-VIZ-SKIPVIZ-05 查找 11：路径点亮 skip-cell.lit > 0', async () => {
    const w = mountIt();
    await search(w, 11);
    expect(w.findAll('.skip-cell.lit').length).toBeGreaterThan(0);
  });
  it('TC-VIZ-SKIPVIZ-06 查找 15：status 含「找到了」', async () => {
    const w = mountIt();
    await search(w, 15);
    expect(w.find('.status').text()).toContain('找到了');
  });
  it('TC-VIZ-SKIPVIZ-07 查找 99：status 含「没找到」', async () => {
    const w = mountIt();
    await search(w, 99);
    expect(w.find('.status').text()).toContain('没找到');
  });
  it('TC-VIZ-SKIPVIZ-08 重置：清高亮（skip-cell.lit/.hot 为 0）', async () => {
    const w = mountIt();
    await search(w, 11);
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.skip-cell.lit')).toHaveLength(0);
    expect(w.findAll('.skip-cell.hot')).toHaveLength(0);
  });
});
