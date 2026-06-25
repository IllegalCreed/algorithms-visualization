import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BalanceViz from './BalanceViz.vue';

const mountIt = () => mount(BalanceViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('BalanceViz', () => {
  it('TC-VIZ-BALVIZ-01 初始退化：7 节点 + 6 边 + 3 按钮 + 退化 on + readout 7 层/7 次', () => {
    const w = mountIt();
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.findAll('.edge')).toHaveLength(6);
    expect(btn(w, '退化')).toBeTruthy();
    expect(btn(w, '平衡')).toBeTruthy();
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '退化').classes()).toContain('on');
    const ro = w.find('.readout').text();
    expect(ro).toContain('7 层');
    expect(ro).toContain('7 次');
  });
  it('TC-VIZ-BALVIZ-02 切平衡：readout 3 层/3 次、节点仍 7、平衡 on', async () => {
    const w = mountIt();
    await btn(w, '平衡').trigger('click');
    const ro = w.find('.readout').text();
    expect(ro).toContain('3 层');
    expect(ro).toContain('3 次');
    expect(w.findAll('.node')).toHaveLength(7);
    expect(btn(w, '平衡').classes()).toContain('on');
  });
  it('TC-VIZ-BALVIZ-03 退化节点值 1–7', () => {
    const w = mountIt();
    expect(w.findAll('.node text').map((t) => t.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
    ]);
  });
  it('TC-VIZ-BALVIZ-04 查找 7（退化）status 含「7 步」', async () => {
    const w = mountIt();
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('7 步');
  });
  it('TC-VIZ-BALVIZ-05 查找 7（平衡）status 含「3 步」', async () => {
    const w = mountIt();
    await btn(w, '平衡').trigger('click');
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('3 步');
  });
  it('TC-VIZ-BALVIZ-06 切回退化：readout 回 7 层', async () => {
    const w = mountIt();
    await btn(w, '平衡').trigger('click');
    await btn(w, '退化').trigger('click');
    expect(w.find('.readout').text()).toContain('7 层');
  });
  it('TC-VIZ-BALVIZ-07 退化 vs 平衡 readout 不同', async () => {
    const w = mountIt();
    const a = w.find('.readout').text();
    await btn(w, '平衡').trigger('click');
    const b = w.find('.readout').text();
    expect(a).not.toBe(b);
  });
  it('TC-VIZ-BALVIZ-08 边数两 mode 均 6', async () => {
    const w = mountIt();
    expect(w.findAll('.edge')).toHaveLength(6);
    await btn(w, '平衡').trigger('click');
    expect(w.findAll('.edge')).toHaveLength(6);
  });
});
