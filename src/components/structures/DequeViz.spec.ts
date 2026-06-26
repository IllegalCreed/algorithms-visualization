import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DequeViz from './DequeViz.vue';

const mountIt = () =>
  mount(DequeViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('DequeViz 双端队列互动', () => {
  it('TC-VIZ-DEQUEVIZ-01 初始 3 dqitem + 5 按钮 + 头/尾标记', () => {
    const w = mountIt();
    expect(w.findAll('.dqitem')).toHaveLength(3);
    expect(btn(w, '头部入')).toBeTruthy();
    expect(btn(w, '尾部入')).toBeTruthy();
    expect(btn(w, '头部出')).toBeTruthy();
    expect(btn(w, '尾部出')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.find('.dm-front').exists()).toBe(true);
    expect(w.find('.dm-back').exists()).toBe(true);
  });
  it('TC-VIZ-DEQUEVIZ-02 dqitem 值 1/2/3', () => {
    const w = mountIt();
    expect(w.findAll('.dqitem .plate').map((p) => p.text())).toEqual(['1', '2', '3']);
  });
  it('TC-VIZ-DEQUEVIZ-03 尾部入：4 dqitem、status 含「尾」', async () => {
    const w = mountIt();
    await btn(w, '尾部入').trigger('click');
    expect(w.findAll('.dqitem')).toHaveLength(4);
    expect(w.find('.status').text()).toContain('尾');
  });
  it('TC-VIZ-DEQUEVIZ-04 头部入：4 dqitem、首位=新值、status 含「头」', async () => {
    const w = mountIt();
    await btn(w, '头部入').trigger('click');
    expect(w.findAll('.dqitem')).toHaveLength(4);
    expect(w.findAll('.dqitem .plate')[0].text()).toBe('4');
    expect(w.find('.status').text()).toContain('头');
  });
  it('TC-VIZ-DEQUEVIZ-05 头部出：剩 2 dqitem、首位变 2、status 含「头」', async () => {
    const w = mountIt();
    await btn(w, '头部出').trigger('click');
    expect(w.findAll('.dqitem')).toHaveLength(2);
    expect(w.findAll('.dqitem .plate')[0].text()).toBe('2');
    expect(w.find('.status').text()).toContain('头');
  });
  it('TC-VIZ-DEQUEVIZ-06 尾部出：剩 2 dqitem、末位变 2、status 含「尾」', async () => {
    const w = mountIt();
    await btn(w, '尾部出').trigger('click');
    const plates = w.findAll('.dqitem .plate');
    expect(plates).toHaveLength(2);
    expect(plates[plates.length - 1].text()).toBe('2');
    expect(w.find('.status').text()).toContain('尾');
  });
  it('TC-VIZ-DEQUEVIZ-07 头部出×3 → 空：出队按钮禁用 + empty-hint', async () => {
    const w = mountIt();
    await btn(w, '头部出').trigger('click');
    await btn(w, '头部出').trigger('click');
    await btn(w, '头部出').trigger('click');
    expect(w.findAll('.dqitem')).toHaveLength(0);
    expect(w.find('.empty-hint').exists()).toBe(true);
    expect(btn(w, '头部出').attributes('disabled')).toBeDefined();
    expect(btn(w, '尾部出').attributes('disabled')).toBeDefined();
  });
  it('TC-VIZ-DEQUEVIZ-08 重置回 3 dqitem', async () => {
    const w = mountIt();
    await btn(w, '尾部入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.dqitem')).toHaveLength(3);
  });
});
