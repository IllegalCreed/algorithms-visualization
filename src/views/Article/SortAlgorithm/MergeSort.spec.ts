import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import MergeSort from './MergeSort.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import AuxView from '@/components/AuxView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('MergeSort', () => {
  it('TC-VIEW-MERGE-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(MergeSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-MERGE-02 初始渲染主轨 10 柱 + 辅助轨且默认停第 0 步', async () => {
    const w = mount(MergeSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(AuxView).exists()).toBe(true);
    // 主轨 10 + 辅助轨 10 = 20 个 Bar（第 0 步 widthChange，aux 为整排空槽）
    expect(w.findAllComponents(Bar)).toHaveLength(20);
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
