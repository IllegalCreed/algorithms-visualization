import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DlinkViz from './DlinkViz.vue';

const mountIt = () =>
  mount(DlinkViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('DlinkViz 双向链表互动', () => {
  it('TC-VIZ-DLINKVIZ-01 初始 4 dnode + 双箭头(→/←) + 3 按钮 + head + tail', () => {
    const w = mountIt();
    expect(w.findAll('.dnode')).toHaveLength(4);
    expect(w.find('.conn .nx').exists()).toBe(true);
    expect(w.find('.conn .pv').exists()).toBe(true);
    expect(btn(w, '反向')).toBeTruthy();
    expect(btn(w, '删除')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.find('.danchor.head').exists()).toBe(true);
    expect(w.find('.danchor.tail').exists()).toBe(true);
  });
  it('TC-VIZ-DLINKVIZ-02 dnode 值 10/20/30/40', () => {
    const w = mountIt();
    expect(w.findAll('.dnode .box').map((b) => b.text())).toEqual(['10', '20', '30', '40']);
  });
  it('TC-VIZ-DLINKVIZ-03 点 dnode[1] 选中 is-sel', async () => {
    const w = mountIt();
    await w.findAll('.dnode')[1].find('.box').trigger('click');
    expect(w.findAll('.dnode')[1].classes()).toContain('is-sel');
  });
  it('TC-VIZ-DLINKVIZ-04 反向遍历：status 含「反向」且含「40 → 30」', async () => {
    const w = mountIt();
    await btn(w, '反向').trigger('click');
    const s = w.find('.status').text();
    expect(s).toContain('反向');
    expect(s).toContain('40 → 30');
  });
  it('TC-VIZ-DLINKVIZ-05 删除选中（选1）：dnode→3、status 含「O(1)」「prev」', async () => {
    const w = mountIt();
    await w.findAll('.dnode')[1].find('.box').trigger('click');
    await btn(w, '删除').trigger('click');
    expect(w.findAll('.dnode')).toHaveLength(3);
    const s = w.find('.status').text();
    expect(s).toContain('O(1)');
    expect(s).toContain('prev');
  });
  it('TC-VIZ-DLINKVIZ-06 删头（选0）删除：首 dnode 变 20、dnode→3', async () => {
    const w = mountIt();
    await w.findAll('.dnode')[0].find('.box').trigger('click');
    await btn(w, '删除').trigger('click');
    expect(w.findAll('.dnode')).toHaveLength(3);
    expect(w.findAll('.dnode .box')[0].text()).toBe('20');
  });
  it('TC-VIZ-DLINKVIZ-07 未选中时删除按钮禁用、dnode 仍 4', () => {
    const w = mountIt();
    expect(btn(w, '删除').attributes('disabled')).toBeDefined();
    expect(w.findAll('.dnode')).toHaveLength(4);
  });
  it('TC-VIZ-DLINKVIZ-08 重置回 4 dnode', async () => {
    const w = mountIt();
    await w.findAll('.dnode')[1].find('.box').trigger('click');
    await btn(w, '删除').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.dnode')).toHaveLength(4);
  });
});
