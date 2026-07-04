import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Sudoku from './Sudoku.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import SudokuView from '@/components/SudokuView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Sudoku, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('数独页', () => {
  it('TC-VIEW-SDK-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-SDK-02 含「数独」标题与数独轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('数独');
    expect(w.findComponent(SudokuView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-SDK-03 全模板：正文含「回溯」+ 数独轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('回溯');
    expect(w.findComponent(SudokuView).exists()).toBe(true);
  });
});
