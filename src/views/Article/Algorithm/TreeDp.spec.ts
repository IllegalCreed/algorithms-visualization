import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TreeDp from './TreeDp.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(TreeDp, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('树形 DP 页', () => {
  it('TC-VIEW-TD-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-TD-02 含「树形」标题与矩阵轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('树形');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-TD-03 全模板：正文含「后序」与「子树」', () => {
    const w = mountIt();
    expect(w.html()).toContain('后序');
    expect(w.html()).toContain('子树');
  });
});
