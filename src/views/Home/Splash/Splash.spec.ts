import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Splash from './Splash.vue';

// TC-VIEW-SPLASH

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a v-bind="$attrs"><slot /></a>',
};

const mountIt = () => mount(Splash, { global: { stubs: { RouterLink: RouterLinkStub } } });

describe('Splash 组件', () => {
  it('TC-VIEW-SPLASH-01: 渲染主标题「可视化的」', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toContain('可视化的');
  });

  it('TC-VIEW-SPLASH-02: 渲染副标题「数据结构与算法」', () => {
    const w = mountIt();
    expect(w.find('h2').text()).toContain('数据结构与算法');
  });

  it('TC-VIEW-SPLASH-03: 渲染技术栈描述文案', () => {
    const w = mountIt();
    expect(w.find('span').text()).toContain('Vue3');
  });

  it('TC-VIEW-SPLASH-04: 渲染「开始学习」按钮', () => {
    const w = mountIt();
    expect(w.find('#start-btn').text()).toBe('开始学习');
  });

  it('TC-VIEW-SPLASH-05: 「开始学习」是指向 array 页的 RouterLink', () => {
    const w = mountIt();
    expect(w.find('a#start-btn').exists()).toBe(true);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'array' });
  });
});
