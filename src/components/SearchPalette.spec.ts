// src/components/SearchPalette.spec.ts —— 全站搜索命令面板（C-113，M11-S1）
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SearchPalette from './SearchPalette.vue';
import { useSystemStore } from '@/store/modules/system';

const push = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}));

const mountIt = () =>
  mount(SearchPalette, {
    global: { plugins: [createPinia()], stubs: { Teleport: true } },
  });

describe('SearchPalette 全站搜索', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    push.mockClear();
  });

  it('TC-VIZ-SEARCH-01 store 开关控制面板显隐 + 打开渲染输入框', async () => {
    const w = mountIt();
    const store = useSystemStore();
    expect(w.find('.search-palette').exists()).toBe(false);
    store.openSearch();
    await flushPromises();
    expect(w.find('.search-palette').exists()).toBe(true);
    expect(w.find('.sp-input').exists()).toBe(true);
  });

  it('TC-VIZ-SEARCH-02 输入过滤：快速排序命中且带大类徽标；上限 10 条', async () => {
    const w = mountIt();
    const store = useSystemStore();
    store.openSearch();
    await flushPromises();
    await w.find('.sp-input').setValue('快速排序');
    const items = w.findAll('.sp-item');
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(w.text()).toContain('快速排序');
    expect(w.find('.sp-cat').text()).toContain('排序');
    await w.find('.sp-input').setValue('排序');
    expect(w.findAll('.sp-item').length).toBeLessThanOrEqual(10);
  });

  it('TC-VIZ-SEARCH-03 键盘 ↓↑ 移动 + Enter 跳转并关闭', async () => {
    const w = mountIt();
    const store = useSystemStore();
    store.openSearch();
    await flushPromises();
    await w.find('.sp-input').setValue('排序');
    await w.find('.sp-input').trigger('keydown', { key: 'ArrowDown' });
    expect(w.findAll('.sp-item')[1].classes()).toContain('sp-active');
    await w.find('.sp-input').trigger('keydown', { key: 'ArrowUp' });
    expect(w.findAll('.sp-item')[0].classes()).toContain('sp-active');
    await w.find('.sp-input').trigger('keydown', { key: 'Enter' });
    expect(push).toHaveBeenCalledTimes(1);
    expect(String(push.mock.calls[0][0])).toMatch(/^\/docs\//);
    expect(store.isSearchOpen).toBe(false);
  });

  it('TC-VIZ-SEARCH-04 Esc 关闭；点遮罩关闭', async () => {
    const w = mountIt();
    const store = useSystemStore();
    store.openSearch();
    await flushPromises();
    await w.find('.sp-input').trigger('keydown', { key: 'Escape' });
    expect(store.isSearchOpen).toBe(false);
    store.openSearch();
    await flushPromises();
    await w.find('.search-overlay').trigger('click');
    expect(store.isSearchOpen).toBe(false);
  });

  it('TC-VIZ-SEARCH-05 空查询显示提示行', async () => {
    const w = mountIt();
    useSystemStore().openSearch();
    await flushPromises();
    expect(w.find('.sp-hint').exists()).toBe(true);
    expect(w.findAll('.sp-item')).toHaveLength(0);
  });

  it('TC-VIZ-SEARCH-06 无匹配显示空态', async () => {
    const w = mountIt();
    useSystemStore().openSearch();
    await flushPromises();
    await w.find('.sp-input').setValue('不存在的算法xyz');
    expect(w.find('.sp-empty').text()).toContain('没有匹配');
  });
});
