import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import EulerPhi from './EulerPhi.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import SieveView from '@/components/SieveView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(EulerPhi, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('欧拉函数页', () => {
  it('TC-VIEW-PHI-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-PHI-02 含「欧拉函数」标题与数字网格轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('欧拉函数');
    expect(w.findComponent(SieveView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-PHI-03 全模板：正文含「互质」与「欧拉定理」+ SieveView 同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('互质');
    expect(w.html()).toContain('欧拉定理');
    expect(w.findComponent(SieveView).exists()).toBe(true);
  });
});
