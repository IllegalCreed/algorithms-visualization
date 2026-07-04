import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Gcd from './Gcd.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GcdView from '@/components/GcdView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Gcd, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('欧几里得算法页', () => {
  it('TC-VIEW-GCD-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-GCD-02 含「欧几里得/公约数」标题与铺砖轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toMatch(/欧几里得|公约数/);
    expect(w.findComponent(GcdView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-GCD-03 全模板：正文含「辗转相除」+ 铺砖轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('辗转相除');
    expect(w.findComponent(GcdView).exists()).toBe(true);
  });
});
