import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BitonicSort from './BitonicSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import NetworkView from '@/components/NetworkView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(BitonicSort, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('双调排序页', () => {
  it('TC-VIEW-BN-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-BN-02 含「双调」标题与网络轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('双调');
    expect(w.findComponent(NetworkView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-BN-03 全模板：正文含「排序网络」+ NetworkView 同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('排序网络');
    expect(w.findComponent(NetworkView).exists()).toBe(true);
  });
});
