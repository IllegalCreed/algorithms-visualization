import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import LinearSieve from './LinearSieve.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import SieveView from '@/components/SieveView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(LinearSieve, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('线性筛页', () => {
  it('TC-VIEW-LS-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-LS-02 含「线性筛」标题与筛轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('线性筛');
    expect(w.findComponent(SieveView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-LS-03 全模板：正文含「最小质因子」+ 筛轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('最小质因子');
    expect(w.findComponent(SieveView).exists()).toBe(true);
  });
});
