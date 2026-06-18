import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import BubbleSort from './BubbleSort.vue';
import List from '@/components/List.vue';

describe('BubbleSort', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('挂载渲染 List + 比较表达式', () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(List).exists()).toBe(true);
    expect(w.find('.expression').exists()).toBe(true);
  });

  it('初始渲染 10 个方块', () => {
    const w = mount(BubbleSort, { global: { plugins: [createPinia()] } });
    expect(w.findComponent(List).props('data')).toHaveLength(10);
  });
});
