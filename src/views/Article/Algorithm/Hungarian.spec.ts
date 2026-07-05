import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Hungarian from './Hungarian.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Hungarian, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('匈牙利算法页', () => {
  it('TC-VIEW-HG-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-HG-02 含「匈牙利」标题与图轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('匈牙利');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-HG-03 全模板：正文含「增广」与「二分图」', () => {
    const w = mountIt();
    expect(w.html()).toContain('增广');
    expect(w.html()).toContain('二分图');
  });
});
