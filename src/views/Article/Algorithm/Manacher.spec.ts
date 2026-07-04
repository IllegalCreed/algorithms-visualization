import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Manacher from './Manacher.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import ManacherView from '@/components/ManacherView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(Manacher, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('Manacher 页', () => {
  it('TC-VIEW-MAN-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-MAN-02 含「Manacher」标题与回文轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Manacher');
    expect(w.findComponent(ManacherView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-MAN-03 全模板：正文含「回文」+ 回文轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('回文');
    expect(w.findComponent(ManacherView).exists()).toBe(true);
  });
});
