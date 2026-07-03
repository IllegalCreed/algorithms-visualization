import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import CompleteKnapsack from './CompleteKnapsack.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import MatrixView from '@/components/MatrixView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(CompleteKnapsack, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('完全背包页', () => {
  it('TC-VIEW-CK-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-CK-02 含「完全背包」标题与矩阵轨（28 单元，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('完全背包');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
    expect(w.findAll('.matrix-cell')).toHaveLength(28);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-CK-03 全模板：正文含「本行」（对照 0-1 递推来源）+ 矩阵轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('本行');
    expect(w.findComponent(MatrixView).exists()).toBe(true);
  });
});
