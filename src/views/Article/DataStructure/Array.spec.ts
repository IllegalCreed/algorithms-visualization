import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArrayPage from './Array.vue';
import Article from '@/components/article/Article.vue';
import ArrayViz from '@/components/structures/ArrayViz.vue';

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
});
