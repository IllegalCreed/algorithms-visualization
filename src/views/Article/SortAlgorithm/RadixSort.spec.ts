import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import RadixSort from './RadixSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import CountView from '@/components/CountView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('RadixSort', () => {
  it('TC-VIEW-RADIX-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(RadixSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-RADIX-02 渲染计数桶轨 + 主轨 8 柱且默认停第 0 步', async () => {
    const w = mount(RadixSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(CountView).exists()).toBe(true);
    expect(w.findAllComponents(Bar)).toHaveLength(8); // 主轨 8 柱
    expect(w.find('.counter').text()).toContain('1 / ');
  });

  it('TC-VIEW-RADIX-03 全模板：介绍正文 Article（h1 基数排序）', () => {
    const w = mount(RadixSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.find('h1').text()).toContain('基数排序');
  });
});
