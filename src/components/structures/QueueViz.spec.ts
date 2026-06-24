import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import QueueViz from './QueueViz.vue';

// TransitionGroup 用 stub，让进出场即时，便于断言 DOM
const mountIt = () =>
  mount(QueueViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('QueueViz', () => {
  it('TC-VIZ-QUEUEVIZ-01 初始空：队列为空 + dequeue/peek 禁用', () => {
    const w = mountIt();
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(btn(w, 'dequeue').attributes('disabled')).toBeDefined();
    expect(btn(w, 'peek').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-QUEUEVIZ-02 enqueue 增元素、值为递增序号', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.plate').text()).toBe('1');
  });
  it('TC-VIZ-QUEUEVIZ-03 队首 is-front 落 index0、队尾 is-rear 落末位', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'enqueue').trigger('click');
    const items = w.findAll('.qitem');
    expect(items[0].classes()).toContain('is-front');
    expect(items[items.length - 1].classes()).toContain('is-rear');
    expect(items[0].classes()).not.toContain('is-rear');
  });
  it('TC-VIZ-QUEUEVIZ-04 每个 qitem 含队首/队尾 marker 节点', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'enqueue').trigger('click');
    expect(w.findAll('.qitem .m-front')).toHaveLength(2);
    expect(w.findAll('.qitem .m-rear')).toHaveLength(2);
  });
  it('TC-VIZ-QUEUEVIZ-05 dequeue 移除队首并解说', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'dequeue').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.plate').text()).toBe('2'); // 队首 1 已出，2 成新队首
    expect(w.find('.status').text()).toContain('出队');
  });
  it('TC-VIZ-QUEUEVIZ-06 enqueue 到 6 后 enqueue 禁用', async () => {
    const w = mountIt();
    for (let i = 0; i < 6; i++) await btn(w, 'enqueue').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(6);
    expect(btn(w, 'enqueue').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-QUEUEVIZ-07 重置清空', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
  });
  it('TC-VIZ-QUEUEVIZ-08 peek 解说队首、不取走', async () => {
    const w = mountIt();
    await btn(w, 'enqueue').trigger('click');
    await btn(w, 'peek').trigger('click');
    expect(w.findAll('.plate')).toHaveLength(1);
    expect(w.find('.status').text()).toContain('队首');
  });
});
