import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BinarySearch from './BinarySearch.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BarsView from '@/components/BarsView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(BinarySearch, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('二分查找页', () => {
  it('TC-VIEW-BS-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-BS-02 含「二分查找」标题与主柱轨（本页有柱！）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('二分查找');
    expect(w.findComponent(BarsView).exists()).toBe(true);
  });
  it('TC-VIEW-BS-03 全模板：正文含「有序」与「O(log n)」', () => {
    const w = mountIt();
    expect(w.html()).toContain('有序');
    expect(w.html()).toContain('O(log n)');
  });
});
