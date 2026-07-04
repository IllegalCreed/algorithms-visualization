import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BinaryAnswer from './BinaryAnswer.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BarsView from '@/components/BarsView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(BinaryAnswer, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('二分答案页', () => {
  it('TC-VIEW-BA-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-BA-02 含「二分答案」标题与主柱轨', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('二分答案');
    expect(w.findComponent(BarsView).exists()).toBe(true);
  });
  it('TC-VIEW-BA-03 全模板：正文含「答案空间」与「单调」', () => {
    const w = mountIt();
    expect(w.html()).toContain('答案空间');
    expect(w.html()).toContain('单调');
  });
});
