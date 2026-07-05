import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import PollardRho from './PollardRho.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(PollardRho, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe("Pollard's Rho 页", () => {
  it('TC-VIEW-RHO-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-RHO-02 含「Pollard」标题与图轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Pollard');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-RHO-03 全模板：正文含「生日悖论」与「gcd」', () => {
    const w = mountIt();
    expect(w.html()).toContain('生日悖论');
    expect(w.html()).toContain('gcd');
  });
});
