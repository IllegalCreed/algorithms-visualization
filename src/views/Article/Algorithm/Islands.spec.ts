import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Islands from './Islands.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MazeView from '@/components/MazeView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Islands, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('岛屿数量页', () => {
  it('TC-VIEW-ISL-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-ISL-02 含「岛屿」标题与网格轨（16 格，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('岛屿');
    expect(w.findComponent(MazeView).exists()).toBe(true);
    expect(w.findAll('.maze-cell')).toHaveLength(16);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-ISL-03 全模板：正文含「连通」+ 网格轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('连通');
    expect(w.findComponent(MazeView).exists()).toBe(true);
  });
});
