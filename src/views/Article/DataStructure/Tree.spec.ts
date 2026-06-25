import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tree from './Tree.vue';
import Article from '@/components/article/Article.vue';
import TreeViz from '@/components/structures/TreeViz.vue';

const mountIt = () => mount(Tree);

describe('Tree 树页', () => {
  it('TC-VIEW-TREE-01 挂载渲染 Article + TreeViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(TreeViz).exists()).toBe(true);
  });
  it('TC-VIEW-TREE-02 含「树」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('树');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
