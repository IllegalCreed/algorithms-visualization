import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Fenwick from './Fenwick.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BarsView from '@/components/BarsView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Fenwick, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('树状数组页', () => {
  it('TC-VIEW-BIT-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-BIT-02 含「树状数组」标题与主柱轨', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('树状数组');
    expect(w.findComponent(BarsView).exists()).toBe(true);
  });
  it('TC-VIEW-BIT-03 全模板：正文含「lowbit」与「管辖」', () => {
    const w = mountIt();
    expect(w.html()).toContain('lowbit');
    expect(w.html()).toContain('管辖');
  });
});
