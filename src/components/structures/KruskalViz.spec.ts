import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import KruskalViz from './KruskalViz.vue';

const mountIt = () => mount(KruskalViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const next = async (w: ReturnType<typeof mountIt>, times = 1) => {
  for (let i = 0; i < times; i++) await btn(w, '下一步').trigger('click');
};

describe('KruskalViz 最小生成树互动', () => {
  it('TC-VIZ-KRUSKALVIZ-01 6 kvert + 9 kedge + 边列表 9 行 + 下一步/重置', () => {
    const w = mountIt();
    expect(w.findAll('.kvert')).toHaveLength(6);
    expect(w.findAll('.kedge')).toHaveLength(9);
    expect(w.findAll('.ke-row')).toHaveLength(9);
    expect(btn(w, '下一步')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });

  it('TC-VIZ-KRUSKALVIZ-02 初始无 MST', () => {
    expect(mountIt().findAll('.kedge.mst')).toHaveLength(0);
  });

  it('TC-VIZ-KRUSKALVIZ-03 下一步×1：首条加入、status 含「加入」', async () => {
    const w = mountIt();
    await next(w, 1);
    expect(w.findAll('.kedge.mst')).toHaveLength(1);
    expect(w.find('.status').text()).toContain('加入');
  });

  it('TC-VIZ-KRUSKALVIZ-04 下一步×4：成环跳过、cycle ≥1、mst 仍 3', async () => {
    const w = mountIt();
    await next(w, 4);
    expect(w.find('.status').text()).toContain('成环');
    expect(w.findAll('.kedge.cycle').length).toBeGreaterThanOrEqual(1);
    expect(w.findAll('.kedge.mst')).toHaveLength(3);
  });

  it('TC-VIZ-KRUSKALVIZ-05 下一步×4：当前考虑边高亮 ≥1', async () => {
    const w = mountIt();
    await next(w, 4);
    expect(w.findAll('.kedge.current').length).toBeGreaterThanOrEqual(1);
  });

  it('TC-VIZ-KRUSKALVIZ-06 走到底：mst 5、status 含 18', async () => {
    const w = mountIt();
    await next(w, 9);
    expect(w.findAll('.kedge.mst')).toHaveLength(5);
    expect(w.find('.status').text()).toContain('18');
  });

  it('TC-VIZ-KRUSKALVIZ-07 走到底：成环 4 条', async () => {
    const w = mountIt();
    await next(w, 9);
    expect(w.findAll('.kedge.cycle')).toHaveLength(4);
  });

  it('TC-VIZ-KRUSKALVIZ-08 重置：mst 清空', async () => {
    const w = mountIt();
    await next(w, 3);
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.kedge.mst')).toHaveLength(0);
  });
});
