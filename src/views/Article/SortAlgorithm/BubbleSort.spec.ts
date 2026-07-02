// src/views/Article/SortAlgorithm/BubbleSort.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BubbleSort from './BubbleSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('BubbleSort', () => {
  it('挂载渲染 AlgorithmPlayer', () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('初始渲染 10 根柱子且默认停在第 0 步', async () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(10);
    expect(w.find('.counter').text()).toContain('1 / ');
  });

  it('TC-VIEW-BUBBLE-03 全模板：介绍正文 Article（h1 冒泡排序）', () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.find('h1').text()).toContain('冒泡排序');
  });
});
