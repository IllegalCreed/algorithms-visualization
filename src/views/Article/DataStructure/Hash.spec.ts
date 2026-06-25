import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Hash from './Hash.vue';
import Article from '@/components/article/Article.vue';
import HashViz from '@/components/structures/HashViz.vue';

const mountIt = () => mount(Hash);

describe('Hash 哈希页', () => {
  it('TC-VIEW-HASH-01 挂载渲染 Article + HashViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(HashViz).exists()).toBe(true);
  });
  it('TC-VIEW-HASH-02 含「哈希表」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('哈希表');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
