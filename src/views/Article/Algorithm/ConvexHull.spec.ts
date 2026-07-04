import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ConvexHull from './ConvexHull.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import HullView from '@/components/HullView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(ConvexHull, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('凸包页', () => {
  it('TC-VIEW-CH-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-CH-02 含「凸包」标题与点平面轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('凸包');
    expect(w.findComponent(HullView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-CH-03 全模板：正文含「叉积」+ 点平面轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('叉积');
    expect(w.findComponent(HullView).exists()).toBe(true);
  });
});
