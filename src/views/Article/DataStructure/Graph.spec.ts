import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Graph from './Graph.vue';
import Article from '@/components/article/Article.vue';
import GraphViz from '@/components/structures/GraphViz.vue';

const mountIt = () => mount(Graph);

describe('Graph 图页', () => {
  it('TC-VIEW-GRAPH-01 挂载渲染 Article + GraphViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(GraphViz).exists()).toBe(true);
  });
  it('TC-VIEW-GRAPH-02 含「图」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('图');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
