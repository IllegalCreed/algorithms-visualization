import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Scc from './Scc.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Scc, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('强连通分量页', () => {
  it('TC-VIEW-SCC-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-SCC-02 含「强连通」标题与图轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('强连通');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-SCC-03 全模板：正文含「Tarjan」+ 图轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('Tarjan');
    expect(w.findComponent(GraphView).exists()).toBe(true);
  });
});
