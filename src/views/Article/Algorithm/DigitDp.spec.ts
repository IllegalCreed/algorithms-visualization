import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import DigitDp from './DigitDp.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(DigitDp, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('数位 DP 页', () => {
  it('TC-VIEW-DD-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-DD-02 含「数位」标题与矩阵轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('数位');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-DD-03 全模板：正文含「贴着」与「自由」', () => {
    const w = mountIt();
    expect(w.html()).toContain('贴着');
    expect(w.html()).toContain('自由');
  });
});
