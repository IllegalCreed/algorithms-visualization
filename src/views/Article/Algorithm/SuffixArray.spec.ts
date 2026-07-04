import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import SuffixArray from './SuffixArray.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import SuffixArrayView from '@/components/SuffixArrayView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(SuffixArray, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('后缀数组页', () => {
  it('TC-VIEW-SA-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-SA-02 含「后缀数组」标题与后缀轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('后缀数组');
    expect(w.findComponent(SuffixArrayView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-SA-03 全模板：正文含「倍增」+ 后缀轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('倍增');
    expect(w.findComponent(SuffixArrayView).exists()).toBe(true);
  });
});
