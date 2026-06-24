import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LinkViz from './LinkViz.vue';

const mountIt = () =>
  mount(LinkViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('LinkViz', () => {
  it('TC-VIZ-LINKVIZ-01 初始 3 节点 + head + null + 无选中禁查找/插入/删除', () => {
    const w = mountIt();
    expect(w.findAll('.node')).toHaveLength(3);
    expect(w.find('.head').exists()).toBe(true);
    expect(w.find('.nullbox').exists()).toBe(true);
    expect(w.find('.empty-hint').exists()).toBe(false);
    expect(btn(w, '查找').attributes('disabled')).toBeDefined();
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
    expect(btn(w, '删除').attributes('disabled')).toBeDefined();
    expect(btn(w, '头插').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-LINKVIZ-02 点节点选中：is-sel + 启用查找/插入/删除', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    expect(w.findAll('.node')[1].classes()).toContain('is-sel');
    expect(btn(w, '查找').attributes('disabled')).toBeUndefined();
    expect(btn(w, '插入').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-LINKVIZ-03 insertAfter 增节点、新值落选中后', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    await btn(w, '插入').trigger('click');
    const boxes = w.findAll('.node .box');
    expect(boxes).toHaveLength(4);
    expect(boxes[2].text()).toBe('4'); // 落在 a[1] 之后 = index 2
  });
  it('TC-VIZ-LINKVIZ-04 remove 减节点', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    await btn(w, '删除').trigger('click');
    expect(w.findAll('.node')).toHaveLength(2);
    expect(w.findAll('.node .box').map((b) => b.text())).toEqual(['1', '3']);
  });
  it('TC-VIZ-LINKVIZ-05 prepend 头插落表头', async () => {
    const w = mountIt();
    await btn(w, '头插').trigger('click');
    const boxes = w.findAll('.node .box');
    expect(boxes).toHaveLength(4);
    expect(boxes[0].text()).toBe('4');
  });
  it('TC-VIZ-LINKVIZ-06 每节点带 next 箭头 + 有 head/null', () => {
    const w = mountIt();
    expect(w.findAll('.node .arrow').length).toBeGreaterThanOrEqual(3);
    expect(w.find('.head').exists()).toBe(true);
    expect(w.find('.nullbox').exists()).toBe(true);
  });
  it('TC-VIZ-LINKVIZ-07 满 6 禁插入/头插', async () => {
    const w = mountIt();
    for (let i = 0; i < 3; i++) await btn(w, '头插').trigger('click'); // 3→6
    expect(w.findAll('.node')).toHaveLength(6);
    expect(btn(w, '头插').attributes('disabled')).toBeDefined();
    await w.findAll('.node .box')[0].trigger('click');
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-LINKVIZ-08 find 同步解说含 O(n)', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[2].trigger('click');
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('O(n)');
  });
  it('TC-VIZ-LINKVIZ-09 reset 复位 3 节点、清选中', async () => {
    const w = mountIt();
    await w.findAll('.node .box')[1].trigger('click');
    await btn(w, '头插').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.node')).toHaveLength(3);
    expect(w.findAll('.node.is-sel')).toHaveLength(0);
  });
  it('TC-VIZ-LINKVIZ-10 删空显示 empty-hint + 禁三键', async () => {
    const w = mountIt();
    for (let i = 0; i < 3; i++) {
      await w.findAll('.node .box')[0].trigger('click');
      await btn(w, '删除').trigger('click');
    }
    expect(w.findAll('.node')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(btn(w, '查找').attributes('disabled')).toBeDefined();
  });
});
