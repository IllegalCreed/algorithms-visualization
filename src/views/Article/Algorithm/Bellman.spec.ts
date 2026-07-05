import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Bellman from './Bellman.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () => mount(Bellman, { global: { plugins: [createPinia()] } });

describe('Bellman-Ford 最短路页', () => {
  it('TC-VIEW-BELLMAN-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-BELLMAN-02 含「Bellman」标题与图轨（5 节点，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Bellman');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.findAll('.graph-node')).toHaveLength(5);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-BELLMAN-03 全模板：Article 正文 + 图轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('最短');
    expect(w.findAll('.graph-edge').length).toBeGreaterThanOrEqual(7);
  });

  it('TC-VIEW-BELLMAN-04 B 档补强：正文含差分约束段（C-109）', () => {
    const w = mountIt();
    expect(w.html()).toContain('差分约束');
    expect(w.html()).toContain('x_v − x_u ≤ w');
  });
});
