import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BucketSort from './BucketSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import BucketView from '@/components/BucketView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('BucketSort', () => {
  it('TC-VIEW-BUCKET-01 全模板：介绍正文 Article（h1 桶排序）+ 代码播放器', () => {
    const w = mount(BucketSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.find('h1').text()).toContain('桶排序');
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-BUCKET-02 渲染桶轨 BucketView + 主轨 8 柱且默认停第 0 步', async () => {
    const w = mount(BucketSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(BucketView).exists()).toBe(true);
    expect(w.findAllComponents(Bar)).toHaveLength(8); // 主轨 8 柱
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
