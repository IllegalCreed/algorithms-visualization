import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BentleyOttmann from './BentleyOttmann.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import HullView from '@/components/HullView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(BentleyOttmann, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('扫描线求交页', () => {
  it('TC-VIEW-BO-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-BO-02 含「扫描线」标题与点平面轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('扫描线');
    expect(w.findComponent(HullView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-BO-03 全模板：正文含「事件」与「相邻」+ HullView 同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('事件');
    expect(w.html()).toContain('相邻');
    expect(w.findComponent(HullView).exists()).toBe(true);
  });
});
