import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import CoinChange from './CoinChange.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(CoinChange, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('硬币找零方案数页', () => {
  it('TC-VIEW-CC-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-CC-02 含「硬币」标题与矩阵轨（24 单元，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('硬币');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.findAll('.matrix-cell')).toHaveLength(24);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-CC-03 全模板：正文含「计数」+ 矩阵轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('计数');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
  });
});
