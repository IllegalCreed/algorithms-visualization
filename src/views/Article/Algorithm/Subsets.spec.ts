import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Subsets from './Subsets.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import DecisionTreeView from '@/components/DecisionTreeView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Subsets, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('子集生成页', () => {
  it('TC-VIEW-SUBSETS-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-SUBSETS-02 含「子集」标题与决策树轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('子集');
    expect(w.findComponent(DecisionTreeView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-SUBSETS-03 全模板：Article 正文 + 决策树轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('子集');
    expect(w.findComponent(DecisionTreeView).exists()).toBe(true);
  });
});
