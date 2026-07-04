import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ExtGcd from './ExtGcd.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(ExtGcd, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('扩展欧几里得页', () => {
  it('TC-VIEW-EG-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-EG-02 含「扩展欧几里得」标题与矩阵轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('扩展欧几里得');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-EG-03 全模板：正文含「模逆元」+ MatrixView 同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('模逆元');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
  });
});
