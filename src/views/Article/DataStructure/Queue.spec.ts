import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Queue from './Queue.vue';
import Article from '@/components/article/Article.vue';
import QueueViz from '@/components/structures/QueueViz.vue';
import DequeViz from '@/components/structures/DequeViz.vue';

const mountIt = () =>
  mount(Queue, {
    global: { stubs: { 'transition-group': { template: '<div><slot /></div>' } } },
  });

describe('Queue 队列页', () => {
  it('TC-VIEW-QUEUE-01 挂载渲染 Article + QueueViz', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(QueueViz).exists()).toBe(true);
  });
  it('TC-VIEW-QUEUE-02 含「队列」标题与 Playground', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('队列');
    expect(w.find('.playground').exists()).toBe(true);
  });
  it('TC-VIEW-QUEUE-03 队列页含 DequeViz（双端队列节）', () => {
    const w = mountIt();
    expect(w.findComponent(DequeViz).exists()).toBe(true);
  });
});
