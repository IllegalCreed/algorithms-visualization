import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Header from './Header.vue';

// TC-VIEW-HEADER

vi.mock('vue-router', () => ({
  useRoute: () => ({ fullPath: '/' }),
}));

// mock svg asset imports
vi.mock('@/assets/weibo.svg', () => ({ default: 'weibo.svg' }));
vi.mock('@/assets/github.svg', () => ({ default: 'github.svg' }));
vi.mock('@/assets/twitter.svg', () => ({ default: 'twitter.svg' }));
vi.mock('@/assets/homepage.svg', () => ({ default: 'homepage.svg' }));

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a v-bind="$attrs"><slot /></a>',
};

const mountIt = (pinia = createPinia()) =>
  mount(Header, {
    global: {
      plugins: [pinia],
      stubs: { RouterLink: RouterLinkStub },
    },
  });

describe('Master/Header 组件', () => {
  it('TC-VIEW-HEADER-01: 渲染 #header 根元素', () => {
    const w = mountIt();
    expect(w.find('#header').exists()).toBe(true);
  });

  it('TC-VIEW-HEADER-02: 渲染 logo #logo 元素', () => {
    const w = mountIt();
    expect(w.find('#logo').exists()).toBe(true);
  });

  it('TC-VIEW-HEADER-03: 渲染「V」logo 字符', () => {
    const w = mountIt();
    expect(w.find('#logo span').text()).toBe('V');
  });

  it('TC-VIEW-HEADER-04: 渲染 h1 标题「算法可视化」', () => {
    const w = mountIt();
    expect(w.find('h1').text()).toBe('算法可视化');
  });

  it('TC-VIEW-HEADER-05: logo 是指向 home 路由的 RouterLink', () => {
    const w = mountIt();
    expect(w.find('a#logo').exists()).toBe(true);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'home' });
    expect(w.find('#logo').attributes('aria-label')).toBe('首页');
  });

  it('TC-VIEW-HEADER-06: 渲染 4 个 icon-link（微博/X/GitHub/个人主页），含个人主页项（C-030）', () => {
    const w = mountIt();
    const links = w.findAll('.icon-link');
    expect(links).toHaveLength(4);
    expect(links.some((l) => l.attributes('title') === '个人主页')).toBe(true);
  });

  it('TC-VIEW-HEADER-07: 初始无 header shadow class（isShowHeaderShadow 默认 false）', () => {
    const w = mountIt();
    expect(w.find('#header').classes()).not.toContain('neumorphism-bottom-shadow');
  });

  it('TC-VIEW-HEADER-08: 搜索按钮存在，点击打开搜索面板（C-113）', async () => {
    const pinia = createPinia();
    const w = mountIt(pinia);
    const btn = w.find('.search-btn');
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain('⌘K');
    expect(btn.attributes('aria-label')).toContain('搜索算法');
    const { useSystemStore } = await import('@/store/modules/system');
    const store = useSystemStore(pinia);
    expect(store.isSearchOpen).toBe(false);
    await btn.trigger('click');
    expect(store.isSearchOpen).toBe(true);
  });
});
