import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BloomViz from './BloomViz.vue';

const mountIt = () => mount(BloomViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const add = async (w: ReturnType<typeof mountIt>, x: number) => {
  await w.find('.in-a').setValue(String(x));
  await btn(w, '加入').trigger('click');
};
const query = async (w: ReturnType<typeof mountIt>, x: number) => {
  await w.find('.in-a').setValue(String(x));
  await btn(w, '查询').trigger('click');
};
const addAll = async (w: ReturnType<typeof mountIt>) => {
  for (const x of [3, 7, 11]) await add(w, x);
};

describe('BloomViz 布隆过滤器互动', () => {
  it('TC-VIZ-BLOOMVIZ-01 16 bit-cell + a 输入 + 加入/查询/重置 按钮', () => {
    const w = mountIt();
    expect(w.findAll('.bit-cell')).toHaveLength(16);
    expect(w.find('.in-a').exists()).toBe(true);
    expect(btn(w, '加入')).toBeTruthy();
    expect(btn(w, '查询')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });

  it('TC-VIZ-BLOOMVIZ-02 初始 set 0', () => {
    expect(mountIt().findAll('.bit-cell.set')).toHaveLength(0);
  });

  it('TC-VIZ-BLOOMVIZ-03 加入 3：set 3 + status 含「加入」', async () => {
    const w = mountIt();
    await add(w, 3);
    expect(w.findAll('.bit-cell.set')).toHaveLength(3);
    expect(w.find('.status').text()).toContain('加入');
  });

  it('TC-VIZ-BLOOMVIZ-04 加入 3/7/11：set 9', async () => {
    const w = mountIt();
    await addAll(w);
    expect(w.findAll('.bit-cell.set')).toHaveLength(9);
  });

  it('TC-VIZ-BLOOMVIZ-05 查询 7：含「可能存在」且不含「误判」', async () => {
    const w = mountIt();
    await addAll(w);
    await query(w, 7);
    const s = w.find('.status').text();
    expect(s).toContain('可能存在');
    expect(s).not.toContain('误判');
  });

  it('TC-VIZ-BLOOMVIZ-06 查询 5：含「一定不存在」', async () => {
    const w = mountIt();
    await addAll(w);
    await query(w, 5);
    expect(w.find('.status').text()).toContain('一定不存在');
  });

  it('TC-VIZ-BLOOMVIZ-07 查询 2：含「误判」', async () => {
    const w = mountIt();
    await addAll(w);
    await query(w, 2);
    expect(w.find('.status').text()).toContain('误判');
  });

  it('TC-VIZ-BLOOMVIZ-08 查询 7：探测位 probe 3', async () => {
    const w = mountIt();
    await addAll(w);
    await query(w, 7);
    expect(w.findAll('.bit-cell.probe')).toHaveLength(3);
  });

  it('TC-VIZ-BLOOMVIZ-09 重置：清空 set/probe', async () => {
    const w = mountIt();
    await add(w, 3);
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.bit-cell.set')).toHaveLength(0);
    expect(w.findAll('.bit-cell.probe')).toHaveLength(0);
  });
});
