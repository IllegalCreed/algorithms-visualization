import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import MaxFlow from './MaxFlow.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(MaxFlow, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('最大流页', () => {
  it('TC-VIEW-MF-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-MF-02 含「最大流」标题与图轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('最大流');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-MF-03 全模板：正文含「残量」+ 图轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('残量');
    expect(w.findComponent(GraphView).exists()).toBe(true);
  });
});
