import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Kruskal from './Kruskal.vue';
import Article from '@/components/article/Article.vue';
import KruskalViz from '@/components/structures/KruskalViz.vue';

const mountIt = () => mount(Kruskal);

describe('Kruskal 最小生成树页', () => {
  it('TC-VIEW-KRUSKAL-01 挂载渲染 Article + KruskalViz + Playground', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(KruskalViz).exists()).toBe(true);
    expect(w.find('.playground').exists()).toBe(true);
  });
  it('TC-VIEW-KRUSKAL-02 含「Kruskal」标题与互动容器', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Kruskal');
    expect(w.find('.kruskal-viz').exists()).toBe(true);
    expect(w.findAll('.kvert')).toHaveLength(6);
  });
});
