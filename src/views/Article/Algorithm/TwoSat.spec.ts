import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TwoSat from './TwoSat.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(TwoSat, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('2-SAT 页', () => {
  it('TC-VIEW-2SAT-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-2SAT-02 含「2-SAT」标题与图轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('2-SAT');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-2SAT-03 全模板：正文含「蕴含」+ 图轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('蕴含');
    expect(w.findComponent(GraphView).exists()).toBe(true);
  });
});
