// src/views/Article/Paths.spec.ts —— 学习路径页（C-115，M11-S3）
import { describe, it, expect } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Paths from './Paths.vue';
import { LEARNING_PATHS } from '@/data/paths';

const mountIt = () =>
  mount(Paths, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('学习路径页', () => {
  it('TC-VIEW-PATHS-01 渲染 4 张路径卡 + h1', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('学习路径');
    expect(w.findAll('.lp-card')).toHaveLength(4);
    expect(w.text()).toContain('新手入门');
    expect(w.text()).toContain('面试高频');
  });

  it('TC-VIEW-PATHS-02 步骤为链接指向 /docs/{url}，编号有序', () => {
    const w = mountIt();
    const totalSteps = LEARNING_PATHS.reduce((s, p) => s + p.steps.length, 0);
    const links = w.findAllComponents(RouterLinkStub);
    expect(links).toHaveLength(totalSteps);
    expect(String(links[0].props('to'))).toBe('/docs/array');
    const firstCardIdx = w.findAll('.lp-card')[0].findAll('.lp-idx');
    expect(firstCardIdx[0].text()).toBe('1');
    expect(firstCardIdx[firstCardIdx.length - 1].text()).toBe(
      String(LEARNING_PATHS[0].steps.length),
    );
  });

  it('TC-VIEW-PATHS-03 步骤 title 属性含大类名', () => {
    const w = mountIt();
    const first = w.findAllComponents(RouterLinkStub)[0];
    expect(first.attributes('title')).toBe('数据结构');
  });
});
