import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BinaryInsertionSort from './BinaryInsertionSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('BinaryInsertionSort', () => {
  it('TC-VIEW-BININS-01 全模板：介绍正文 Article（h1 二分插入排序）+ 代码播放器', () => {
    const w = mount(BinaryInsertionSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.find('h1').text()).toContain('二分插入排序');
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-BININS-02 主轨 8 柱且默认停第 0 步', async () => {
    const w = mount(BinaryInsertionSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findAllComponents(Bar)).toHaveLength(8); // 纯 BarsView，无辅助轨
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
