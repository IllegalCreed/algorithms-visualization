import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BinaryBounds from './BinaryBounds.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BarsView from '@/components/BarsView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(BinaryBounds, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('二分边界页', () => {
  it('TC-VIEW-BB-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-BB-02 含「边界」标题与主柱轨', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('边界');
    expect(w.findComponent(BarsView).exists()).toBe(true);
  });
  it('TC-VIEW-BB-03 全模板：正文含「lower」与「半开」', () => {
    const w = mountIt();
    expect(w.html()).toContain('lower');
    expect(w.html()).toContain('半开');
  });
});
