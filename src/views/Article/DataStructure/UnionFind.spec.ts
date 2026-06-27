import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UnionFind from './UnionFind.vue';
import Article from '@/components/article/Article.vue';
import UnionFindViz from '@/components/structures/UnionFindViz.vue';

const mountIt = () => mount(UnionFind);

describe('UnionFind 并查集页', () => {
  it('TC-VIEW-UF-01 挂载渲染 Article + UnionFindViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(UnionFindViz).exists()).toBe(true);
  });
  it('TC-VIEW-UF-02 含「并查集」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('并查集');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
