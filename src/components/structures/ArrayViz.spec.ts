import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArrayViz from './ArrayViz.vue';

const mountIt = () =>
  mount(ArrayViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('ArrayViz', () => {
  it('TC-VIZ-ARRAYVIZ-01 初始 4 格 + 下标 0..3 + 无选中禁访问/插入/删除', () => {
    const w = mountIt();
    expect(w.findAll('.cell')).toHaveLength(4);
    expect(w.findAll('.slot')).toHaveLength(4);
    expect(w.find('.empty-hint').exists()).toBe(false);
    expect(btn(w, '访问').attributes('disabled')).toBeDefined();
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
    expect(btn(w, '删除').attributes('disabled')).toBeDefined();
    expect(btn(w, '追加').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-ARRAYVIZ-02 点格选中：cell/slot is-selected + 启用三键', async () => {
    const w = mountIt();
    await w.findAll('.cell')[2].trigger('click');
    expect(w.findAll('.cell')[2].classes()).toContain('is-selected');
    expect(w.findAll('.slot')[2].classes()).toContain('is-selected');
    expect(btn(w, '访问').attributes('disabled')).toBeUndefined();
    expect(btn(w, '插入').attributes('disabled')).toBeUndefined();
  });
  it('TC-VIZ-ARRAYVIZ-03 insert 增元素、新值落 i、下标≠值', async () => {
    const w = mountIt();
    await w.findAll('.cell')[2].trigger('click');
    await btn(w, '插入').trigger('click');
    const cells = w.findAll('.cell');
    expect(cells).toHaveLength(5);
    expect(cells[2].text()).toBe('5');
    expect(cells[3].text()).toBe('3'); // 下标 3 的值是 3
  });
  it('TC-VIZ-ARRAYVIZ-04 remove 减元素', async () => {
    const w = mountIt();
    await w.findAll('.cell')[1].trigger('click');
    await btn(w, '删除').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(3);
    expect(w.findAll('.cell').map((c) => c.text())).toEqual(['1', '3', '4']);
  });
  it('TC-VIZ-ARRAYVIZ-05 append 尾增（无需选中）', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    const cells = w.findAll('.cell');
    expect(cells).toHaveLength(5);
    expect(cells[4].text()).toBe('5');
  });
  it('TC-VIZ-ARRAYVIZ-06 下标行数量 = items 数、文本 0..n-1', async () => {
    const w = mountIt();
    await btn(w, '追加').trigger('click');
    expect(w.findAll('.slot')).toHaveLength(5);
    expect(w.findAll('.slot .num').map((s) => s.text())).toEqual(['0', '1', '2', '3', '4']);
  });
  it('TC-VIZ-ARRAYVIZ-07 满 8 禁插入/追加', async () => {
    const w = mountIt();
    for (let i = 0; i < 4; i++) await btn(w, '追加').trigger('click'); // 4→8
    expect(w.findAll('.cell')).toHaveLength(8);
    expect(btn(w, '追加').attributes('disabled')).toBeDefined();
    await w.findAll('.cell')[0].trigger('click');
    expect(btn(w, '插入').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-ARRAYVIZ-08 access 解说含 O(1)', async () => {
    const w = mountIt();
    await w.findAll('.cell')[2].trigger('click');
    await btn(w, '访问').trigger('click');
    expect(w.find('.status').text()).toContain('O(1)');
  });
  it('TC-VIZ-ARRAYVIZ-09 reset 复位 4 格、清选中', async () => {
    const w = mountIt();
    await w.findAll('.cell')[1].trigger('click');
    await btn(w, '追加').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(4);
    expect(w.findAll('.cell.is-selected')).toHaveLength(0);
  });
  it('TC-VIZ-ARRAYVIZ-10 删空显示 empty-hint + 禁三键', async () => {
    const w = mountIt();
    for (let i = 0; i < 4; i++) {
      await w.findAll('.cell')[0].trigger('click');
      await btn(w, '删除').trigger('click');
    }
    expect(w.findAll('.cell')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(btn(w, '访问').attributes('disabled')).toBeDefined();
  });
});
