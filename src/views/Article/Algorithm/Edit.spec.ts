import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Edit from './Edit.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () => mount(Edit, { global: { plugins: [createPinia()] } });

describe('编辑距离页', () => {
  it('TC-VIEW-EDIT-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-EDIT-02 含「编辑距离」标题与矩阵轨（16 单元，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('编辑距离');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.findAll('.matrix-cell')).toHaveLength(16);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-EDIT-03 全模板：Article 正文 + 矩阵轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('编辑距离');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
  });
});
