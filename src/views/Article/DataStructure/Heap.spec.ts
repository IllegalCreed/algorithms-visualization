import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Heap from './Heap.vue';
import Article from '@/components/article/Article.vue';
import HeapViz from '@/components/structures/HeapViz.vue';

const mountIt = () =>
  mount(Heap, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });

describe('Heap 堆页', () => {
  it('TC-VIEW-HEAPDS-01 挂载渲染 Article + HeapViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(HeapViz).exists()).toBe(true);
  });
  it('TC-VIEW-HEAPDS-02 含「堆」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('堆');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
