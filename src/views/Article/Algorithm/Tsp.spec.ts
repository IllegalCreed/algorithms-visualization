import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Tsp from './Tsp.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Tsp, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('旅行商 TSP 页', () => {
  it('TC-VIEW-TSP-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-TSP-02 含「旅行商」标题与矩阵轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('旅行商');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-TSP-03 全模板：正文含「状压」与「mask」', () => {
    const w = mountIt();
    expect(w.html()).toContain('状压');
    expect(w.html()).toContain('mask');
  });
});
