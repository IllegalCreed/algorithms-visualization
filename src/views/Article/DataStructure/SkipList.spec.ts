import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SkipList from './SkipList.vue';
import Article from '@/components/article/Article.vue';
import SkipListViz from '@/components/structures/SkipListViz.vue';

const mountIt = () => mount(SkipList);

describe('SkipList 跳表页', () => {
  it('TC-VIEW-SKIP-01 挂载渲染 Article + SkipListViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(SkipListViz).exists()).toBe(true);
  });
  it('TC-VIEW-SKIP-02 含「跳表」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('跳表');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
