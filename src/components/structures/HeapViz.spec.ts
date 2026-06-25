import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HeapViz from './HeapViz.vue';

const mountIt = () =>
  mount(HeapViz, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: number | string) =>
  w.find('.val-input').setValue(String(v));

describe('HeapViz', () => {
  it('TC-VIZ-HEAPVIZ-01 初始 7 格 + 7 节点 + 6 边 + 输入框 + 3 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.cell')).toHaveLength(7);
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.findAll('.edge')).toHaveLength(6);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '插入')).toBeTruthy();
    expect(btn(w, '弹出')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });
  it('TC-VIZ-HEAPVIZ-02 insert 双视图各 +1', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(8);
    expect(w.findAll('.node')).toHaveLength(8);
  });
  it('TC-VIZ-HEAPVIZ-03 insert 出现新值 95', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell').some((c) => c.text() === '95')).toBe(true);
    expect(w.findAll('.node').some((n) => n.text() === '95')).toBe(true);
  });
  it('TC-VIZ-HEAPVIZ-04 extract 双视图各 -1', async () => {
    const w = mountIt();
    await btn(w, '弹出').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(6);
    expect(w.findAll('.node')).toHaveLength(6);
  });
  it('TC-VIZ-HEAPVIZ-05 extract 解说弹出 + 最大值 90', async () => {
    const w = mountIt();
    await btn(w, '弹出').trigger('click');
    expect(w.find('.status').text()).toContain('弹出');
    expect(w.find('.status').text()).toContain('90');
  });
  it('TC-VIZ-HEAPVIZ-06 双视图同步：格数 == 节点数', async () => {
    const w = mountIt();
    expect(w.findAll('.cell').length).toBe(w.findAll('.node').length);
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.cell').length).toBe(w.findAll('.node').length);
  });
  it('TC-VIZ-HEAPVIZ-07 边数 = 节点数 - 1', async () => {
    const w = mountIt();
    expect(w.findAll('.edge')).toHaveLength(6);
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.edge')).toHaveLength(7);
  });
  it('TC-VIZ-HEAPVIZ-08 非法值提示、不增', async () => {
    const w = mountIt();
    await setVal(w, 0);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('请输入');
    expect(w.findAll('.cell')).toHaveLength(7);
  });
  it('TC-VIZ-HEAPVIZ-09 reset 复位 7 格', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.cell')).toHaveLength(7);
  });
  it('TC-VIZ-HEAPVIZ-10 insert 解说含「上浮」', async () => {
    const w = mountIt();
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('上浮');
  });
});
