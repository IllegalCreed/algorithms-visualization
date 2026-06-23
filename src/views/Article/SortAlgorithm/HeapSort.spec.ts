import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import HeapSort from './HeapSort.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import TreeView from '@/components/TreeView.vue';
import Bar from '@/components/Bar.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

describe('HeapSort', () => {
  it('TC-VIEW-HEAP-01 挂载渲染 AlgorithmPlayer', () => {
    const w = mount(HeapSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });

  it('TC-VIEW-HEAP-02 初始渲染二叉树轨 + 主轨 10 柱且默认停第 0 步', async () => {
    const w = mount(HeapSort, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.findComponent(TreeView).exists()).toBe(true);
    expect(w.findAllComponents(Bar)).toHaveLength(10); // 主轨 10 柱（树轨用 .tree-node）
    expect(w.find('.counter').text()).toContain('1 / ');
  });
});
