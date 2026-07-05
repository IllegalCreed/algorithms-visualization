// src/views/Article/Complexity.spec.ts —— 复杂度速查页（C-114，M11-S2）
import { describe, it, expect } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Complexity from './Complexity.vue';

const mountIt = () =>
  mount(Complexity, {
    global: { plugins: [createPinia()], stubs: { RouterLink: RouterLinkStub } },
  });

describe('复杂度速查页', () => {
  it('TC-VIEW-CPLX-01 渲染九大类分组 + 总计数 92', () => {
    const w = mountIt();
    expect(w.findAll('.cx-group')).toHaveLength(9);
    expect(w.find('.cx-count').text()).toContain('92');
    expect(w.find('h1').text()).toContain('复杂度速查');
  });

  it('TC-VIEW-CPLX-02 点大类标签只显该组；「全部」还原', async () => {
    const w = mountIt();
    const tag = w.findAll('.cx-tag').find((b) => b.text() === '查找')!;
    await tag.trigger('click');
    expect(w.findAll('.cx-group')).toHaveLength(1);
    expect(w.find('.cx-count').text()).toContain('5');
    await w.findAll('.cx-tag')[0].trigger('click'); // 全部
    expect(w.findAll('.cx-group')).toHaveLength(9);
  });

  it('TC-VIEW-CPLX-03 关键词过滤缩减条目、空组隐藏', async () => {
    const w = mountIt();
    await w.find('.cx-kw').setValue('生日悖论');
    expect(w.findAll('.cx-group')).toHaveLength(1);
    expect(w.text()).toContain("Pollard's Rho");
    await w.find('.cx-kw').setValue('绝不存在xyz');
    expect(w.find('.cx-empty').exists()).toBe(true);
  });

  it('TC-VIEW-CPLX-04 行内名称链接指向 /docs/{url}', () => {
    const w = mountIt();
    const links = w.findAllComponents(RouterLinkStub);
    expect(links.length).toBe(92);
    expect(String(links[0].props('to'))).toMatch(/^\/docs\//);
  });
});
