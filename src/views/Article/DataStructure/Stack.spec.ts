import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Stack from './Stack.vue';
import Article from '@/components/article/Article.vue';
import StackViz from '@/components/structures/StackViz.vue';

const mountIt = () =>
  mount(Stack, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });

describe('Stack 栈页', () => {
  it('TC-VIEW-STACK-01 挂载渲染 Article + StackViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(StackViz).exists()).toBe(true);
  });
  it('TC-VIEW-STACK-02 含「栈」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('栈');
    expect(w.find('.playground').exists()).toBe(true);
  });
});
