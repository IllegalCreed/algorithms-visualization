import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Link from './Link.vue';
import Article from '@/components/article/Article.vue';
import LinkViz from '@/components/structures/LinkViz.vue';

const mountIt = () =>
  mount(Link, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });

describe('Link 链表页', () => {
  it('TC-VIEW-LINK-01 挂载渲染 Article + LinkViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(LinkViz).exists()).toBe(true);
  });
  it('TC-VIEW-LINK-02 含「链表」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('链表');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
