import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import QuickSort from './QuickSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import StackView from '@/components/StackView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('QuickSort', () => {
  it('TC-VIEW-QUICK-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(QuickSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-QUICK-02 初始渲染主轨 10 柱 + 区间栈轨且默认停第 0 步', async () => {
    const w = mount(QuickSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(StackView).exists()).toBe(true);
    // 快排原地，仅主轨 10 柱（无辅助数组轨）
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.counter').text()).toContain('1 / ');
  });

  it('TC-VIEW-QUICK-03 全模板：介绍正文 Article（h1 快速排序）', () => {
    const w = mount(QuickSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.find('h1').text()).toContain('快速排序');
  });
});
