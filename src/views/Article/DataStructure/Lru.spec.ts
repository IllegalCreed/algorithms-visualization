import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Lru from './Lru.vue';
import Article from '@/components/article/Article.vue';
import LruViz from '@/components/structures/LruViz.vue';

const mountIt = () =>
  mount(Lru, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });

describe('Lru LRU 缓存页', () => {
  it('TC-VIEW-LRU-01 挂载渲染 Article + LruViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(LruViz).exists()).toBe(true);
  });
  it('TC-VIEW-LRU-02 含「LRU」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('LRU');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
