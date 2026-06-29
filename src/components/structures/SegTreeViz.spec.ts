import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SegTreeViz from './SegTreeViz.vue';

const mountIt = () => mount(SegTreeViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const setAB = async (w: ReturnType<typeof mountIt>, a: number, b: number) => {
  await w.find('.in-a').setValue(String(a));
  await w.find('.in-b').setValue(String(b));
};
const range = async (w: ReturnType<typeof mountIt>, a: number, b: number) => {
  await setAB(w, a, b);
  await btn(w, '区间和').trigger('click');
};
const update = async (w: ReturnType<typeof mountIt>, a: number, b: number) => {
  await setAB(w, a, b);
  await btn(w, '更新').trigger('click');
};

describe('SegTreeViz 线段树互动', () => {
  it('TC-VIZ-SEGVIZ-01 15 seg-node + 14 seg-edge + a/b 两输入 + 三按钮', () => {
    const w = mountIt();
    expect(w.findAll('.seg-node')).toHaveLength(15);
    expect(w.findAll('.seg-edge')).toHaveLength(14);
    expect(w.find('.in-a').exists()).toBe(true);
    expect(w.find('.in-b').exists()).toBe(true);
    expect(btn(w, '区间和')).toBeTruthy();
    expect(btn(w, '更新')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });

  it('TC-VIZ-SEGVIZ-02 节点显聚合和（root 37、叶 9）', () => {
    const w = mountIt();
    const texts = w.findAll('.seg-node text').map((t) => t.text());
    expect(texts).toContain('37');
    expect(texts).toContain('9');
  });

  it('TC-VIZ-SEGVIZ-03 区间和 2,5：status 含 17、covered 点亮 2 个', async () => {
    const w = mountIt();
    await range(w, 2, 5);
    expect(w.find('.status').text()).toContain('17');
    expect(w.findAll('.seg-node.covered')).toHaveLength(2);
  });

  it('TC-VIZ-SEGVIZ-04 区间和 0,7：status 含 37、covered 点亮 1 个', async () => {
    const w = mountIt();
    await range(w, 0, 7);
    expect(w.find('.status').text()).toContain('37');
    expect(w.findAll('.seg-node.covered')).toHaveLength(1);
  });

  it('TC-VIZ-SEGVIZ-05 区间和 3,3：status 含 4', async () => {
    const w = mountIt();
    await range(w, 3, 3);
    expect(w.find('.status').text()).toContain('4');
  });

  it('TC-VIZ-SEGVIZ-06 更新 2→10：status 含「更新」、节点出现 46', async () => {
    const w = mountIt();
    await update(w, 2, 10);
    expect(w.find('.status').text()).toContain('更新');
    expect(w.findAll('.seg-node text').map((t) => t.text())).toContain('46');
  });

  it('TC-VIZ-SEGVIZ-07 更新 2→10：路径点亮 onpath 4 个', async () => {
    const w = mountIt();
    await update(w, 2, 10);
    expect(w.findAll('.seg-node.onpath')).toHaveLength(4);
  });

  it('TC-VIZ-SEGVIZ-08 重置：清高亮 + 复原 37', async () => {
    const w = mountIt();
    await range(w, 2, 5);
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.seg-node.covered')).toHaveLength(0);
    expect(w.findAll('.seg-node.onpath')).toHaveLength(0);
    expect(w.findAll('.seg-node text').map((t) => t.text())).toContain('37');
  });
});
