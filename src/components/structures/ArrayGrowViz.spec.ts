import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArrayGrowViz from './ArrayGrowViz.vue';

const mountIt = () => mount(ArrayGrowViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('ArrayGrowViz 动态数组扩容互动', () => {
  it('TC-VIZ-GROWVIZ-01 初始 4 gcell + 3 filled + 追加/重置 + readout 含 3 / 4', () => {
    const w = mountIt();
    expect(w.findAll('.gcell')).toHaveLength(4);
    expect(w.findAll('.gcell.filled')).toHaveLength(3);
    expect(btn(w, '追加')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    const ro = w.find('.readout').text();
    expect(ro).toContain('3');
    expect(ro).toContain('4');
  });
  it('TC-VIZ-GROWVIZ-02 filled 格值 1/2/3', () => {
    const w = mountIt();
    expect(w.findAll('.gcell.filled').map((c) => c.text())).toEqual(['1', '2', '3']);
  });
  it('TC-VIZ-GROWVIZ-03 append 未满：4 filled、status 含「O(1)」、仍 4 gcell', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    expect(w.findAll('.gcell.filled')).toHaveLength(4);
    expect(w.findAll('.gcell')).toHaveLength(4);
    expect(w.find('.status').text()).toContain('O(1)');
  });
  it('TC-VIZ-GROWVIZ-04 append×2 触发扩容：8 gcell、status 含「扩容」', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click'); // 填满（len 4）
    await btn(w, '追加').trigger('click'); // 触发扩容 → cap 8
    expect(w.findAll('.gcell')).toHaveLength(8);
    expect(w.find('.status').text()).toContain('扩容');
  });
  it('TC-VIZ-GROWVIZ-05 扩容那次 status 含「O(n)」', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    await btn(w, '追加').trigger('click');
    expect(w.find('.status').text()).toContain('O(n)');
  });
  it('TC-VIZ-GROWVIZ-06 stats 含均摊统计（append 次数）', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    expect(w.find('.stats').text()).toContain('append');
  });
  it('TC-VIZ-GROWVIZ-07 连续 append 6 次：容量翻倍到 16（16 gcell）', async () => {
    const w = mountIt();
    for (let i = 0; i < 6; i++) await btn(w, '追加').trigger('click');
    expect(w.findAll('.gcell')).toHaveLength(16);
  });
  it('TC-VIZ-GROWVIZ-08 重置回 3 filled、4 gcell', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    await btn(w, '追加').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.gcell.filled')).toHaveLength(3);
    expect(w.findAll('.gcell')).toHaveLength(4);
  });
});
