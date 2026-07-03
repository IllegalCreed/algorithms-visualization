import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Maze from './Maze.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MazeView from '@/components/MazeView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Maze, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('迷宫寻路页', () => {
  it('TC-VIEW-MAZE-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-MAZE-02 含「迷宫」标题与迷宫轨（25 格，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('迷宫');
    expect(w.findComponent(MazeView).exists()).toBe(true);
    expect(w.findAll('.maze-cell')).toHaveLength(25);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-MAZE-03 全模板：Article 正文 + 迷宫轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('迷宫');
    expect(w.findComponent(MazeView).exists()).toBe(true);
  });
});
