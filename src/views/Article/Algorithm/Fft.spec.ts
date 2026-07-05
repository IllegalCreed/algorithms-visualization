import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Fft from './Fft.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import NetworkView from '@/components/NetworkView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Fft, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('FFT 页', () => {
  it('TC-VIEW-FFT-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-FFT-02 含「FFT」标题与网络轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('FFT');
    expect(w.findComponent(NetworkView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-FFT-03 全模板：正文含「单位根」与「点值」', () => {
    const w = mountIt();
    expect(w.html()).toContain('单位根');
    expect(w.html()).toContain('点值');
  });
});
