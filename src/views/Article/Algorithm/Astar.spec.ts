import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Astar from './Astar.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MazeView from '@/components/MazeView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Astar, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('A* 寻路页', () => {
  it('TC-VIEW-AS-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-AS-02 含「A*」标题与迷宫轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('A*');
    expect(w.findComponent(MazeView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-AS-03 全模板：正文含「启发」与「f = g + h」', () => {
    const w = mountIt();
    expect(w.html()).toContain('启发');
    expect(w.html()).toContain('f = g + h');
  });
});
