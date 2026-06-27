import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UnionFindViz from './UnionFindViz.vue';

const mountIt = () => mount(UnionFindViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setAB = async (w: ReturnType<typeof mountIt>, a: number, b: number) => {
  const inputs = w.findAll('.val-input');
  await inputs[0].setValue(String(a));
  await inputs[1].setValue(String(b));
};
const mergeChain = async (w: ReturnType<typeof mountIt>) => {
  for (const [a, b] of [
    [0, 1],
    [1, 2],
    [2, 3],
  ]) {
    await setAB(w, a, b);
    await btn(w, '合并').trigger('click');
  }
};

describe('UnionFindViz 并查集互动', () => {
  it('TC-VIZ-UFVIZ-01 初始 8 ufnode + 两输入 + 4 按钮 + readout 含 8', () => {
    const w = mountIt();
    expect(w.findAll('.ufnode')).toHaveLength(8);
    expect(w.findAll('.val-input')).toHaveLength(2);
    expect(btn(w, '合并')).toBeTruthy();
    expect(btn(w, '查根')).toBeTruthy();
    expect(btn(w, '连通')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.find('.readout').text()).toContain('8');
  });
  it('TC-VIZ-UFVIZ-02 节点标 0..7', () => {
    const w = mountIt();
    expect(w.findAll('.ufnode text').map((t) => t.text())).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
    ]);
  });
  it('TC-VIZ-UFVIZ-03 合并 0,1：readout 含 7、uf-edge 1 条', async () => {
    const w = mountIt();
    await setAB(w, 0, 1);
    await btn(w, '合并').trigger('click');
    expect(w.find('.readout').text()).toContain('7');
    expect(w.findAll('.uf-edge')).toHaveLength(1);
  });
  it('TC-VIZ-UFVIZ-04 合并链(0,1;1,2;2,3)：uf-edge 3、readout 含 5', async () => {
    const w = mountIt();
    await mergeChain(w);
    expect(w.findAll('.uf-edge')).toHaveLength(3);
    expect(w.find('.readout').text()).toContain('5');
  });
  it('TC-VIZ-UFVIZ-05 链后查根 0：status 含「压缩」', async () => {
    const w = mountIt();
    await mergeChain(w);
    await setAB(w, 0, 1);
    await btn(w, '查根').trigger('click');
    expect(w.find('.status').text()).toContain('压缩');
  });
  it('TC-VIZ-UFVIZ-06 连通?（合并 0,1 后 a=0,b=1）：status 含「同根」', async () => {
    const w = mountIt();
    await setAB(w, 0, 1);
    await btn(w, '合并').trigger('click');
    await btn(w, '连通').trigger('click');
    expect(w.find('.status').text()).toContain('同根');
  });
  it('TC-VIZ-UFVIZ-07 连通?（0 与 2 未并）：status 含「根不同」', async () => {
    const w = mountIt();
    await setAB(w, 0, 2);
    await btn(w, '连通').trigger('click');
    expect(w.find('.status').text()).toContain('根不同');
  });
  it('TC-VIZ-UFVIZ-08 重置：8 ufnode、0 uf-edge、readout 含 8', async () => {
    const w = mountIt();
    await mergeChain(w);
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.ufnode')).toHaveLength(8);
    expect(w.findAll('.uf-edge')).toHaveLength(0);
    expect(w.find('.readout').text()).toContain('8');
  });
});
