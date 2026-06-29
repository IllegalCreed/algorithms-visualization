import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BloomFilter from './BloomFilter.vue';
import Article from '@/components/article/Article.vue';
import BloomViz from '@/components/structures/BloomViz.vue';

const mountIt = () => mount(BloomFilter);

describe('BloomFilter 布隆过滤器页', () => {
  it('TC-VIEW-BLOOM-01 挂载渲染 Article + BloomViz + Playground', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(BloomViz).exists()).toBe(true);
    expect(w.find('.playground').exists()).toBe(true);
  });
  it('TC-VIEW-BLOOM-02 含「布隆过滤器」标题与互动容器', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('布隆过滤器');
    expect(w.find('.bloom-viz').exists()).toBe(true);
    expect(w.findAll('.bit-cell')).toHaveLength(16);
  });
});
