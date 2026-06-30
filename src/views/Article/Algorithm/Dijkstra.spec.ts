import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Dijkstra from './Dijkstra.vue';
import Article from '@/components/article/Article.vue';
import DijkstraViz from '@/components/structures/DijkstraViz.vue';

const mountIt = () => mount(Dijkstra);

describe('Dijkstra 最短路页', () => {
  it('TC-VIEW-DIJKSTRA-01 挂载渲染 Article + DijkstraViz + Playground', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(DijkstraViz).exists()).toBe(true);
    expect(w.find('.playground').exists()).toBe(true);
  });
  it('TC-VIEW-DIJKSTRA-02 含「Dijkstra」标题与互动容器', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Dijkstra');
    expect(w.find('.dijkstra-viz').exists()).toBe(true);
    expect(w.findAll('.dvert')).toHaveLength(6);
  });
});
