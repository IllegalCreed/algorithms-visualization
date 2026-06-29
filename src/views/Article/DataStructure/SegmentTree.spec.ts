import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SegmentTree from './SegmentTree.vue';
import Article from '@/components/article/Article.vue';
import SegTreeViz from '@/components/structures/SegTreeViz.vue';

const mountIt = () => mount(SegmentTree);

describe('SegmentTree 线段树页', () => {
  it('TC-VIEW-SEG-01 挂载渲染 Article + SegTreeViz + Playground', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(SegTreeViz).exists()).toBe(true);
    expect(w.find('.playground').exists()).toBe(true);
  });
  it('TC-VIEW-SEG-02 含「线段树」标题与互动容器', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('线段树');
    expect(w.find('.seg-tree-viz').exists()).toBe(true);
    expect(w.findAll('.seg-node')).toHaveLength(15);
  });
});
