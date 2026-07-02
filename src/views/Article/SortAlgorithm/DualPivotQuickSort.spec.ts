import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import DualPivotQuickSort from './DualPivotQuickSort.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import StackView from '@/components/StackView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('DualPivotQuickSort', () => {
  it('TC-VIEW-DUALPIVOT-01 全模板：介绍正文 Article（h1 双轴快排）+ 代码播放器', () => {
    const w = mount(DualPivotQuickSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.find('h1').text()).toContain('双轴快排');
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-DUALPIVOT-02 渲染区间栈 StackView + 主轨 8 柱且默认停第 0 步', async () => {
    const w = mount(DualPivotQuickSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(StackView).exists()).toBe(true);
    expect(w.findAllComponents(Bar)).toHaveLength(8); // 主轨 8 柱
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
