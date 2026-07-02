import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Dijkstra from './Dijkstra.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () => mount(Dijkstra, { global: { plugins: [createPinia()] } });

describe('Dijkstra 最短路页', () => {
  it('TC-VIEW-DIJKSTRA-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-DIJKSTRA-02 含「Dijkstra」标题与图轨（6 节点，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Dijkstra');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.findAll('.graph-node')).toHaveLength(6);
    // 图算法首步 array:[] → 不渲染柱状轨
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-DIJKSTRA-03 全模板：Article 正文 + 图轨播放器同屏', () => {
    const w = mountIt();
    const html = w.html();
    expect(html).toContain('最短');
    expect(w.findAll('.graph-edge').length).toBeGreaterThanOrEqual(9);
  });
});
