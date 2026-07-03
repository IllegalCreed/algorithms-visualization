import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import RabinKarp from './RabinKarp.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import KmpView from '@/components/KmpView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () =>
  mount(RabinKarp, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('Rabin-Karp 页', () => {
  it('TC-VIEW-RK-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-RK-02 含「Rabin-Karp」标题与匹配轨（无柱数组、无 π 行）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Rabin-Karp');
    expect(w.findComponent(KmpView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
    expect(w.findAll('.kmp-lps-cell')).toHaveLength(0); // 无 π 行
  });
  it('TC-VIEW-RK-03 全模板：Article 正文含「哈希」+ 匹配轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('哈希');
    expect(w.findComponent(KmpView).exists()).toBe(true);
  });
});
