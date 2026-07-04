import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import FastPower from './FastPower.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import PowerView from '@/components/PowerView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(FastPower, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('快速幂页', () => {
  it('TC-VIEW-FP-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-FP-02 含「快速幂」标题与幂块轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('快速幂');
    expect(w.findComponent(PowerView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-FP-03 全模板：正文含「二进制」+ 幂块轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('二进制');
    expect(w.findComponent(PowerView).exists()).toBe(true);
  });
});
