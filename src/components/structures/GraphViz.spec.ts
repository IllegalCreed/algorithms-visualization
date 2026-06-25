import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GraphViz from './GraphViz.vue';

const mountIt = () => mount(GraphViz);
const btn = (w: ReturnType<typeof mountIt>, label: string) =>
  w.findAll('.btn').find((b) => b.text().includes(label))!;

describe('GraphViz', () => {
  it('TC-VIZ-GRAPHVIZ-01 初始 6 顶点 + 7 边 + 3 按钮 + 默认起点高亮', () => {
    const w = mountIt();
    expect(w.findAll('.vertex')).toHaveLength(6);
    expect(w.findAll('.edge')).toHaveLength(7);
    expect(btn(w, 'BFS')).toBeTruthy();
    expect(btn(w, 'DFS')).toBeTruthy();
    expect(btn(w, '重置')).toBeTruthy();
    expect(w.findAll('.vertex.is-start')).toHaveLength(1);
  });
  it('TC-VIZ-GRAPHVIZ-02 顶点标签 A–F', () => {
    const w = mountIt();
    expect(w.findAll('.vertex text').map((t) => t.text())).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });
  it('TC-VIZ-GRAPHVIZ-03 点顶点换起点（唯一 is-start）', async () => {
    const w = mountIt();
    await w.findAll('.vertex')[2].trigger('click');
    expect(w.findAll('.vertex')[2].classes()).toContain('is-start');
    expect(w.findAll('.vertex.is-start')).toHaveLength(1);
  });
  it('TC-VIZ-GRAPHVIZ-04 BFS status 含「队列」+ 顺序 A B C D E F', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    const s = w.find('.status').text();
    expect(s).toContain('队列');
    expect(s).toContain('A B C D E F');
  });
  it('TC-VIZ-GRAPHVIZ-05 DFS status 含「栈」+ 顺序 A B D E F C', async () => {
    const w = mountIt();
    await btn(w, 'DFS').trigger('click');
    const s = w.find('.status').text();
    expect(s).toContain('栈');
    expect(s).toContain('A B D E F C');
  });
  it('TC-VIZ-GRAPHVIZ-06 BFS helper-label 含「队列」', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    expect(w.find('.helper-label').text()).toContain('队列');
  });
  it('TC-VIZ-GRAPHVIZ-07 DFS helper-label 含「栈」', async () => {
    const w = mountIt();
    await btn(w, 'DFS').trigger('click');
    expect(w.find('.helper-label').text()).toContain('栈');
  });
  it('TC-VIZ-GRAPHVIZ-08 重置复位（无 current、status 含起点）', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    await btn(w, '重置').trigger('click');
    expect(w.findAll('.vertex.current')).toHaveLength(0);
    expect(w.find('.status').text()).toContain('起点');
  });
  it('TC-VIZ-GRAPHVIZ-09 换起点后 BFS 从该点出发', async () => {
    const w = mountIt();
    await w.findAll('.vertex')[5].trigger('click'); // F
    await btn(w, 'BFS').trigger('click');
    expect(w.find('.status').text()).toContain('从 F');
  });
  it('TC-VIZ-GRAPHVIZ-10 BFS 与 DFS 顺序不同', async () => {
    const w = mountIt();
    await btn(w, 'BFS').trigger('click');
    const sb = w.find('.status').text();
    await btn(w, '重置').trigger('click');
    await btn(w, 'DFS').trigger('click');
    const sd = w.find('.status').text();
    expect(sb).not.toBe(sd);
  });
});
