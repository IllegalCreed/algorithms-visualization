import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import AhoCorasick from './AhoCorasick.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(AhoCorasick, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('AC 自动机页', () => {
  it('TC-VIEW-AC-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-AC-02 含「AC/Aho」标题与图轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toMatch(/AC|Aho/);
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-AC-03 全模板：正文含「fail」+ 图轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('fail');
    expect(w.findComponent(GraphView).exists()).toBe(true);
  });
});
