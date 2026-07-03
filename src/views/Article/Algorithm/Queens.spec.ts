import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Queens from './Queens.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BoardView from '@/components/BoardView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () => mount(Queens, { global: { plugins: [createPinia()] } });

describe('N 皇后页', () => {
  it('TC-VIEW-QUEENS-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-QUEENS-02 含「皇后」标题与棋盘轨（16 格，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('皇后');
    expect(w.findComponent(BoardView).exists()).toBe(true);
    expect(w.findAll('.board-cell')).toHaveLength(16);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-QUEENS-03 全模板：Article 正文 + 棋盘轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('皇后');
    expect(w.findComponent(BoardView).exists()).toBe(true);
  });
});
