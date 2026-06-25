import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HashViz from './HashViz.vue';

const mountIt = () => mount(HashViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setVal = (w: ReturnType<typeof mountIt>, v: number | string) =>
  w.find('.val-input').setValue(String(v));

describe('HashViz', () => {
  it('TC-VIZ-HASHVIZ-01 初始 7 桶 + 桶1 含 2 项 + 输入框 + 3 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.bucket')).toHaveLength(7);
    expect(w.findAll('.bucket')[1].findAll('.entry')).toHaveLength(2);
    expect(w.find('.val-input').exists()).toBe(true);
    expect(btn(w, '插入')).toBeTruthy();
    expect(btn(w, '查找')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });
  it('TC-VIZ-HASHVIZ-02 insert 空桶直放', async () => {
    const w = mountIt();
    await setVal(w, 7); // 7%7=0
    await btn(w, '插入').trigger('click');
    const e = w.findAll('.bucket')[0].findAll('.entry');
    expect(e).toHaveLength(1);
    expect(e[0].text()).toBe('7');
  });
  it('TC-VIZ-HASHVIZ-03 insert 冲突追加链尾', async () => {
    const w = mountIt();
    await setVal(w, 11); // 11%7=4，桶4 已有 [4]
    await btn(w, '插入').trigger('click');
    const e = w.findAll('.bucket')[4].findAll('.entry');
    expect(e).toHaveLength(2);
    expect(e[1].text()).toBe('11');
  });
  it('TC-VIZ-HASHVIZ-04 insert 总项数 +1', async () => {
    const w = mountIt();
    expect(w.findAll('.entry')).toHaveLength(4);
    await setVal(w, 7);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.entry')).toHaveLength(5);
  });
  it('TC-VIZ-HASHVIZ-05 insert 查重不增、解说已存在', async () => {
    const w = mountIt();
    await setVal(w, 15);
    await btn(w, '插入').trigger('click');
    expect(w.findAll('.entry')).toHaveLength(4);
    expect(w.find('.status').text()).toContain('已经在');
  });
  it('TC-VIZ-HASHVIZ-06 search 命中解说', async () => {
    const w = mountIt();
    await setVal(w, 8);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('找到');
  });
  it('TC-VIZ-HASHVIZ-07 search 没找到解说', async () => {
    const w = mountIt();
    await setVal(w, 22);
    await btn(w, '查找').trigger('click');
    expect(w.find('.status').text()).toContain('不存在');
  });
  it('TC-VIZ-HASHVIZ-08 insert 解说含 hash 算式', async () => {
    const w = mountIt();
    await setVal(w, 11);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('% 7');
  });
  it('TC-VIZ-HASHVIZ-09 非法值提示、不增', async () => {
    const w = mountIt();
    await setVal(w, 0);
    await btn(w, '插入').trigger('click');
    expect(w.find('.status').text()).toContain('请输入');
    expect(w.findAll('.entry')).toHaveLength(4);
  });
  it('TC-VIZ-HASHVIZ-10 reset 复位 4 项', async () => {
    const w = mountIt();
    await setVal(w, 7);
    await btn(w, '插入').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.entry')).toHaveLength(4);
  });
});
