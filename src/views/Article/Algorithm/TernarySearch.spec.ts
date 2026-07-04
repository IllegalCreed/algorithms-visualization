import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TernarySearch from './TernarySearch.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BarsView from '@/components/BarsView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(TernarySearch, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('三分查找页', () => {
  it('TC-VIEW-TER-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-TER-02 含「三分」标题与主柱轨', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('三分');
    expect(w.findComponent(BarsView).exists()).toBe(true);
  });
  it('TC-VIEW-TER-03 全模板：正文含「单峰」与「探针」', () => {
    const w = mountIt();
    expect(w.html()).toContain('单峰');
    expect(w.html()).toContain('探针');
  });
});
