import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Prim from './Prim.vue';
import Article from '@/components/article/Article.vue';
import AlgorithmPlayer from '@/components/player/AlgorithmPlayer.vue';
import GraphView from '@/components/GraphView.vue';

vi.mock('@/components/player/useHighlighter', () => ({
  highlightToLines: vi.fn(async (code: string) => code.split('\n').map((l) => [{ content: l }])),
}));

const mountIt = () => mount(Prim, { global: { plugins: [createPinia()] } });

describe('Prim 最小生成树页', () => {
  it('TC-VIEW-PRIM-01 挂载渲染 Article + AlgorithmPlayer', () => {
    const w = mountIt();
    expect(w.findComponent(Article).exists()).toBe(true);
    expect(w.findComponent(AlgorithmPlayer).exists()).toBe(true);
  });
  it('TC-VIEW-PRIM-02 含「Prim」标题与图轨（6 节点，无柱数组）', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('Prim');
    expect(w.findComponent(GraphView).exists()).toBe(true);
    expect(w.findAll('.graph-node')).toHaveLength(6);
    expect(w.find('.bars-view').exists()).toBe(false);
  });
  it('TC-VIEW-PRIM-03 全模板：Article 正文 + 图轨播放器同屏', () => {
    const w = mountIt();
    expect(w.html()).toContain('最小生成树');
    expect(w.findAll('.graph-edge').length).toBeGreaterThanOrEqual(9);
  });
});
