import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import TopDownMergeSort from './TopDownMergeSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import AuxView from '@/components/AuxView.vue';
import StackView from '@/components/StackView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('TopDownMergeSort', () => {
  it('TC-VIEW-TDMERGE-01 全模板：介绍正文 Article（h1 自顶向下归并）+ 代码播放器', () => {
    const w = mount(TopDownMergeSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.find('h1').text()).toContain('自顶向下归并');
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-TDMERGE-02 渲染 AuxView 与 StackView 双辅助轨 + 主轨 8 柱且默认停第 0 步', async () => {
    const w = mount(TopDownMergeSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(true);
    expect(w.findComponent(StackView).exists()).toBe(true);
    expect(w.findAllComponents(Bar).length).toBeGreaterThanOrEqual(8); // 主轨 8 柱 + aux 轨槽
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
