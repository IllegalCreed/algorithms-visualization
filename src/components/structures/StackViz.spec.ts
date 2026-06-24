import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StackViz from './StackViz.vue';

// TransitionGroup 用 stub，让进出场即时，便于断言 DOM
const mountIt = () =>
  mount(StackViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('StackViz', () => {
  it('TC-VIZ-STACKVIZ-01 初始空：栈为空提示、无盘子、pop/peek 禁用', () => {
    const w = mountIt();
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(btn(w, 'pop').attributes('disabled')).toBeDefined();
    expect(btn(w, 'peek').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-STACKVIZ-02 push 增加一个盘子、值为递增序号', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.plate').text()).toBe('1');
  });
  it('TC-VIZ-STACKVIZ-03 连 push：栈顶 is-top 落在最后压入的元素', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'push').trigger('click');
    const items = w.findAll('.item');
    expect(items[items.length - 1].classes()).toContain('is-top');
    expect(items[0].classes()).not.toContain('is-top');
  });
  it('TC-VIZ-STACKVIZ-04 每个 item 含「← 栈顶」节点（可见性由 is-top 类约束）', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'push').trigger('click');
    expect(w.findAll('.item .arrow')).toHaveLength(2);
  });
  it('TC-VIZ-STACKVIZ-05 pop 减少一个盘子并解说', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'push').trigger('click');
    await btn(w, 'pop').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.status').text()).toContain('弹出');
  });
  it('TC-VIZ-STACKVIZ-06 push 到 8 后 push 禁用', async () => {
    const w = mountIt();
    for (let i = 0; i < 8; i++) await btn(w, 'push').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(8);
    expect(btn(w, 'push').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-STACKVIZ-07 重置清空', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
  });
  it('TC-VIZ-STACKVIZ-08 peek 解说栈顶、不取走', async () => {
    const w = mountIt();
    await btn(w, 'push').trigger('click');
    await btn(w, 'peek').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.status').text()).toContain('栈顶');
  });
});
