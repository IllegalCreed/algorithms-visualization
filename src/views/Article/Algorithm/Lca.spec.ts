import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Lca from './Lca.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Lca, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('LCA 倍增页', () => {
  it('TC-VIEW-LCA-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-LCA-02 含「LCA」标题与矩阵轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('LCA');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-LCA-03 全模板：正文含「倍增」与「祖先」', () => {
    const w = mountIt();
    expect(w.html()).toContain('倍增');
    expect(w.html()).toContain('祖先');
  });
});
