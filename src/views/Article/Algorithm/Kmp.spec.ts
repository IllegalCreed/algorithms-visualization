import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Kmp from './Kmp.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import KmpView from '@/components/KmpView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () => mount(Kmp, { global: { plugins: [createPinia()] } });

describe('KMP 字符串匹配页', () => {
  it('TC-VIEW-KMP-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-KMP-02 含「KMP」标题与字符串匹配轨（无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('KMP');
    expect(w.findComponent(KmpView).exists()).toBe(true);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-KMP-03 全模板：Article 正文含「字符串」+ 匹配轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('字符串');
    expect(w.findComponent(KmpView).exists()).toBe(true);
  });
});
