import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import ZFunction from './ZFunction.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import ManacherView from '@/components/ManacherView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(ZFunction, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('Z 函数页', () => {
  it('TC-VIEW-Z-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-Z-02 含「Z 函数」标题与回文轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Z 函数');
    expect(w.findComponent(ManacherView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-Z-03 全模板：正文含「公共前缀」与「Z-box」', () => {
    const w = mountIt();
    expect(w.html()).toContain('公共前缀');
    expect(w.html()).toContain('Z-box');
  });
});
