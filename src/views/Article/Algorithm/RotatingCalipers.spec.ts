import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import RotatingCalipers from './RotatingCalipers.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import HullView from '@/components/HullView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(RotatingCalipers, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('旋转卡壳页', () => {
  it('TC-VIEW-RC-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-RC-02 含「旋转卡壳」标题与点平面轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('旋转卡壳');
    expect(w.findComponent(HullView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-RC-03 全模板：正文含「对踵」+ HullView 同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('对踵');
    expect(w.findComponent(HullView).exists()).toBe(true);
  });
});
