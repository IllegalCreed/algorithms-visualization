import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DijkstraViz from './DijkstraViz.vue';

const mountIt = () => mount(DijkstraViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;
const next = async (w: ReturnType<typeof mountIt>, times = 1) => {
  for (let i = 0; i < times; i++) await btn(w, '下一步').trigger('click');
};
const distText = (w: ReturnType<typeof mountIt>) =>
  w
    .findAll('.dcell')
    .map((c) => c.text())
    .join(' ');

describe('DijkstraViz 单源最短路互动', () => {
  it('TC-VIZ-DIJKSTRAVIZ-01 6 dvert + 9 dedge + 距离表 6 格 + 下一步/重置', () => {
    const w = mountIt();
    expect(w.findAll('.dvert')).toHaveLength(6);
    expect(w.findAll('.dedge')).toHaveLength(9);
    expect(w.findAll('.dcell')).toHaveLength(6);
    expect(btn(w, '下一步')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
  });

  it('TC-VIZ-DIJKSTRAVIZ-02 初始距离表 0 + ∞、settled 0', () => {
    const w = mountIt();
    const t = distText(w);
    expect(t).toContain('0');
    expect(t).toContain('∞');
    expect(w.findAll('.dvert.settled')).toHaveLength(0);
  });

  it('TC-VIZ-DIJKSTRAVIZ-03 下一步×1：确定 A、settled 1、dist 现 4 与 1', async () => {
    const w = mountIt();
    await next(w, 1);
    expect(w.findAll('.dvert.settled')).toHaveLength(1);
    const t = distText(w);
    expect(t).toContain('4');
    expect(t).toContain('1');
  });

  it('TC-VIZ-DIJKSTRAVIZ-04 下一步×2：B 由 4 松弛到 3', async () => {
    const w = mountIt();
    await next(w, 2);
    expect(distText(w)).toContain('3');
  });

  it('TC-VIZ-DIJKSTRAVIZ-05 下一步×1：松弛边点亮 ≥1', async () => {
    const w = mountIt();
    await next(w, 1);
    expect(w.findAll('.dedge.relaxed').length).toBeGreaterThanOrEqual(1);
  });

  it('TC-VIZ-DIJKSTRAVIZ-06 走到底：settled 6、dist 现 9、status 含「最短」', async () => {
    const w = mountIt();
    await next(w, 6);
    expect(w.findAll('.dvert.settled')).toHaveLength(6);
    expect(distText(w)).toContain('9');
    expect(w.find('.status').text()).toContain('最短');
  });

  it('TC-VIZ-DIJKSTRAVIZ-07 走到底：最短路树点亮 ≥1', async () => {
    const w = mountIt();
    await next(w, 6);
    expect(w.findAll('.dedge.tree').length).toBeGreaterThanOrEqual(1);
  });

  it('TC-VIZ-DIJKSTRAVIZ-08 重置：清空 settled、距离表回 ∞', async () => {
    const w = mountIt();
    await next(w, 3);
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.dvert.settled')).toHaveLength(0);
    expect(distText(w)).toContain('∞');
  });
});
