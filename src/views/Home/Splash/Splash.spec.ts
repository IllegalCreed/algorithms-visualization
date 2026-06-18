import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Splash from './Splash.vue';

// TC-VIEW-SPLASH

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Splash 组件', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('TC-VIEW-SPLASH-01: 渲染主标题「可视化的」', () => {
    const w = mount(Splash);
    expect(w.find('h1').text()).toContain('可视化的');
  });

  it('TC-VIEW-SPLASH-02: 渲染副标题「数据结构与算法」', () => {
    const w = mount(Splash);
    expect(w.find('h2').text()).toContain('数据结构与算法');
  });

  it('TC-VIEW-SPLASH-03: 渲染技术栈描述文案', () => {
    const w = mount(Splash);
    expect(w.find('span').text()).toContain('Vue3');
  });

  it('TC-VIEW-SPLASH-04: 渲染「开始学习」按钮', () => {
    const w = mount(Splash);
    expect(w.find('#start-btn').text()).toBe('开始学习');
  });

  it('TC-VIEW-SPLASH-05: 点击「开始学习」跳转到 array 页', async () => {
    const w = mount(Splash);
    await w.find('#start-btn').trigger('click');
    expect(mockPush).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith({ name: 'array' });
  });
});
