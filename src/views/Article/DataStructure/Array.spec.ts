import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArrayPage from './Array.vue';
import Article from '@/components/article/Article.vue';
import ArrayViz from '@/components/structures/ArrayViz.vue';
import ArrayGrowViz from '@/components/structures/ArrayGrowViz.vue';

const mountIt = () =>
  mount(ArrayPage, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });

describe('Array 数组页', () => {
  it('TC-VIEW-ARRAY-01 挂载渲染 Article + ArrayViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(ArrayViz).exists()).toBe(true);
  });
  it('TC-VIEW-ARRAY-02 含「数组」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('数组');
    expect(w.find('.playground').exists()).toBe(true);
  });
  it('TC-VIEW-ARRAY-03 数组页含 ArrayGrowViz（扩容节）', () => {
    const w = mountIt();
    expect(w.findComponent(ArrayGrowViz).exists()).toBe(true);
  });
});
