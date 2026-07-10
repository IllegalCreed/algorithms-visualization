import { beforeEach, describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import Header from './Header.vue';

// TC-VIEW-HEADER

const mockRoute = vi.hoisted(() => ({
  fullPath: '/',
  path: '/',
  name: 'home',
  query: {} as Record<string, string>,
}));

vi.mock('vue-router', () => ({ useRoute: () => mockRoute }));

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
  beforeEach(() => {
    mockRoute.fullPath = '/';
    mockRoute.path = '/';
    mockRoute.name = 'home';
    mockRoute.query = {};
  });

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

  it('TC-I18N-UI-126-02: 英文 Header 与中英切换目标由当前页面对派生', () => {
    mockRoute.fullPath = '/en/docs/quick-sort?input=9,5,1';
    mockRoute.path = '/en/docs/quick-sort';
    mockRoute.name = 'en-quick-sort';
    mockRoute.query = { input: '9,5,1' };

    const w = mountIt();
    expect(w.find('h1').text()).toBe('Algorithm Visualizer');
    expect(w.find('#logo').attributes('aria-label')).toBe('Home');
    expect(w.find('.search-btn').attributes('aria-label')).toContain('Search algorithms');
    expect(w.findAll('.locale-option')).toHaveLength(2);

    const localeLinks = w
      .findAllComponents({ name: 'RouterLink' })
      .filter((link) => link.classes().includes('locale-option'));
    expect(localeLinks.map((link) => link.props('to'))).toEqual([
      { name: 'quick-sort', query: { input: '9,5,1' } },
      { name: 'en-quick-sort', query: { input: '9,5,1' } },
    ]);
    expect(w.find('.locale-option.active').text()).toBe('EN');
  });
});
