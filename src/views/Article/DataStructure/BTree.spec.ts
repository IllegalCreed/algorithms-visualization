import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BTree from './BTree.vue';
import Article from '@/components/article/Article.vue';
import BTreeViz from '@/components/structures/BTreeViz.vue';

const mountIt = () => mount(BTree);

describe('BTree B+ 树页', () => {
  it('TC-VIEW-BTREE-01 挂载渲染 Article + BTreeViz + Playground', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(BTreeViz).exists()).toBe(true);
    expect(w.find('.playground').exists()).toBe(true);
  });
  it('TC-VIEW-BTREE-02 含「B 树」标题与互动容器', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('B 树');
    expect(w.find('.b-tree-viz').exists()).toBe(true);
    expect(w.findAll('.bt-node')).toHaveLength(4);
  });
});
