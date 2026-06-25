import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeViz from './TreeViz.vue';

const mountIt = () => mount(TreeViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: number | string) =>
  w.find('.val-input').setValue(String(v));

describe('TreeViz', () => {
  it('TC-VIZ-TREEVIZ-01 初始 7 节点 + 6 边 + 输入框 + 4 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.findAll('.edge')).toHaveLength(6);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '插入')).toBeTruthy();
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '中序遍历')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });
  it('TC-VIZ-TREEVIZ-02 insert 增节点、含新值', async () => {
    const w = mountIt();
    await setVal(w, 35);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.node')).toHaveLength(8);
    expect(w.findAll('.node').some((n) => n.text() === '35')).toBe(true);
  });
  it('TC-VIZ-TREEVIZ-03 insert 查重不增、解说已存在', async () => {
    const w = mountIt();
    await setVal(w, 50);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.node')).toHaveLength(7);
    expect(w.find('.status').text()).toContain('已经在树里');
  });
  it('TC-VIZ-TREEVIZ-04 search 找到解说', async () => {
    const w = mountIt();
    await setVal(w, 60);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('找到');
  });
  it('TC-VIZ-TREEVIZ-05 search 没找到解说', async () => {
    const w = mountIt();
    await setVal(w, 55);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('没找到');
  });
  it('TC-VIZ-TREEVIZ-06 中序遍历解说含升序序列', async () => {
    const w = mountIt();
    await btn(w, '中序遍历').trigger('click');
    expect(w.find('.status').text()).toContain('20 30 40 50 60 70 80');
  });
  it('TC-VIZ-TREEVIZ-07 超 4 层解说上限', async () => {
    const w = mountIt();
    await setVal(w, 90);
    await btn(w, '插入').trigger('click');
    await setVal(w, 95);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('上限');
  });
  it('TC-VIZ-TREEVIZ-08 reset 复位 7 节点', async () => {
    const w = mountIt();
    await setVal(w, 35);
    await btn(w, '插入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.node')).toHaveLength(7);
  });
  it('TC-VIZ-TREEVIZ-09 非法值提示、不增', async () => {
    const w = mountIt();
    await setVal(w, 0);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('请输入');
    expect(w.findAll('.node')).toHaveLength(7);
  });
  it('TC-VIZ-TREEVIZ-10 边数 = 节点数 - 1', async () => {
    const w = mountIt();
    await setVal(w, 35);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.edge')).toHaveLength(7);
  });
});
