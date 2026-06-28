import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Header from './Header.vue';

// TC-VIEW-HEADER

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ fullPath: '/' }),
}));

// mock svg asset imports
vi.mock('@/assets/weibo.svg', () => ({ default: 'weibo.svg' }));
vi.mock('@/assets/github.svg', () => ({ default: 'github.svg' }));
vi.mock('@/assets/twitter.svg', () => ({ default: 'twitter.svg' }));
vi.mock('@/assets/homepage.svg', () => ({ default: 'homepage.svg' }));

describe('Master/Header 组件', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('TC-VIEW-HEADER-01: 渲染 #header 根元素', () => {
    const w = mount(Header, { global: { plugins: [createPinia()] } });
    expect(w.find('#header').exists()).toBe(true);
  });

  it('TC-VIEW-HEADER-02: 渲染 logo #logo 元素', () => {
    const w = mount(Header, { global: { plugins: [createPinia()] } });
    expect(w.find('#logo').exists()).toBe(true);
  });

  it('TC-VIEW-HEADER-03: 渲染「V」logo 字符', () => {
    const w = mount(Header, { global: { plugins: [createPinia()] } });
    expect(w.find('#logo span').text()).toBe('V');
  });

  it('TC-VIEW-HEADER-04: 渲染 h1 标题「算法可视化」', () => {
    const w = mount(Header, { global: { plugins: [createPinia()] } });
    expect(w.find('h1').text()).toBe('算法可视化');
  });

  it('TC-VIEW-HEADER-05: 点击 logo 跳转到 home 路由', async () => {
    const w = mount(Header, { global: { plugins: [createPinia()] } });
    await w.find('#logo').trigger('click');
    expect(mockPush).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith({ name: 'home' });
  });

  it('TC-VIEW-HEADER-06: 渲染 4 个 icon-link（微博/X/GitHub/个人主页），含个人主页项（C-030）', () => {
    const w = mount(Header, { global: { plugins: [createPinia()] } });
    const links = w.findAll('.icon-link');
    expect(links).toHaveLength(4);
    expect(links.some((l) => l.attributes('title') === '个人主页')).toBe(true);
  });

  it('TC-VIEW-HEADER-07: 初始无 header shadow class（isShowHeaderShadow 默认 false）', () => {
    const w = mount(Header, { global: { plugins: [createPinia()] } });
    expect(w.find('#header').classes()).not.toContain('neumorphism-bottom-shadow');
  });
});
