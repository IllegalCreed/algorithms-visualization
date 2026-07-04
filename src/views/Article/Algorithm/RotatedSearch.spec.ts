import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import RotatedSearch from './RotatedSearch.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BarsView from '@/components/BarsView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(RotatedSearch, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('旋转数组搜索页', () => {
  it('TC-VIEW-RS-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-RS-02 含「旋转」标题与主柱轨', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('旋转');
    expect(w.findComponent(BarsView).exists()).toBe(true);
  });
  it('TC-VIEW-RS-03 全模板：正文含「断崖」与「有序」', () => {
    const w = mountIt();
    expect(w.html()).toContain('断崖');
    expect(w.html()).toContain('有序');
  });
});
