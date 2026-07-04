import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import SieveOfEratosthenes from './SieveOfEratosthenes.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import SieveView from '@/components/SieveView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(SieveOfEratosthenes, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('埃氏筛页', () => {
  it('TC-VIEW-SIEVE-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-SIEVE-02 含「筛」标题与筛轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('筛');
    expect(w.findComponent(SieveView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-SIEVE-03 全模板：正文含「素数」+ 筛轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('素数');
    expect(w.findComponent(SieveView).exists()).toBe(true);
  });
});
