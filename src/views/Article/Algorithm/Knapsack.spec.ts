import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Knapsack from './Knapsack.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () => mount(Knapsack, { global: { plugins: [createPinia()] } });

describe('0-1 背包页', () => {
  it('TC-VIEW-KNAP-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-KNAP-02 含「背包」标题与矩阵轨（30 单元，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('背包');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.findAll('.matrix-cell')).toHaveLength(30);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-KNAP-03 全模板：Article 正文 + 矩阵轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('背包');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
  });
});
