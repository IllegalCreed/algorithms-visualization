import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Trie from './Trie.vue';
import Article from '@/components/article/Article.vue';
import TrieViz from '@/components/structures/TrieViz.vue';

const mountIt = () => mount(Trie);

describe('Trie 字典树页', () => {
  it('TC-VIEW-TRIE-01 挂载渲染 Article + TrieViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(TrieViz).exists()).toBe(true);
  });
  it('TC-VIEW-TRIE-02 含「字典树」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('字典树');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
