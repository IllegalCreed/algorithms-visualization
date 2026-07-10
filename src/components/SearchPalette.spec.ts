// src/components/SearchPalette.spec.ts —— 全站搜索命令面板（C-113，M11-S1）
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SearchPalette from './SearchPalette.vue';
import { pinyinInitials } from './searchIndex';
import { useSystemStore } from '@/store/modules/system';
import { useCategoryData } from '@/views/Home/Main/hooks';

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

  it('TC-VIZ-SEARCH-09 支持英文名、别名与拼音首字母静态索引（C-119）', async () => {
    const w = mountIt();
    const store = useSystemStore();
    store.openSearch();
    await flushPromises();

    await w.find('.sp-input').setValue('quick sort');
    expect(w.findAll('.sp-item').some((item) => item.text().includes('快速排序'))).toBe(true);

    await w.find('.sp-input').setValue('kspx');
    expect(w.findAll('.sp-item').some((item) => item.text().includes('快速排序'))).toBe(true);

    await w.find('.sp-input').setValue('bit');
    expect(w.findAll('.sp-item').some((item) => item.text().includes('树状数组'))).toBe(true);
  });

  it('TC-VIZ-SEARCH-11 首页全部标题与分类均具备完整拼音首字母索引（C-119）', () => {
    const categories = useCategoryData();
    const labels = categories.flatMap((category) => [
      category.title,
      ...category.children.map((item) => item.title),
    ]);
    const incomplete = labels.filter((label) => {
      const searchableCharacterCount = Array.from(label).filter(
        (char) => /[\da-z]/i.test(char) || /[\u3400-\u9fff]/.test(char),
      ).length;
      return pinyinInitials(label).length !== searchableCharacterCount;
    });

    expect(incomplete).toEqual([]);
  });

  it('TC-VIZ-SEARCH-12 多音字按算法标题中的实际读音生成首字母（C-119）', () => {
    expect(pinyinInitials('双调排序')).toBe('sdpx');
    expect(pinyinInitials('最长公共子序列')).toBe('zcggzxl');
  });

  it('TC-VIZ-SEARCH-10 面板具备 dialog 与表单可访问性语义（C-119）', async () => {
    const w = mountIt();
    useSystemStore().openSearch();
    await flushPromises();
    expect(w.find('.search-palette').attributes('role')).toBe('dialog');
    expect(w.find('.search-palette').attributes('aria-modal')).toBe('true');
    const input = w.find('.sp-input');
    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('aria-label')).toBe('搜索算法');
    expect(input.attributes('aria-expanded')).toBe('false');
    expect(input.attributes('aria-describedby')).toBe('search-palette-hint');
    expect(input.attributes('aria-activedescendant')).toBeUndefined();

    await input.setValue('快速排序');
    expect(w.find('.sp-results').attributes('role')).toBe('listbox');
    const refreshedInput = w.find('.sp-input');
    const item = w.find('.sp-item');
    expect(refreshedInput.attributes('aria-expanded')).toBe('true');
    expect(refreshedInput.attributes('aria-controls')).toBe('search-results');
    expect(refreshedInput.attributes('aria-describedby')).toBeUndefined();
    expect(refreshedInput.attributes('aria-activedescendant')).toBe(item.attributes('id'));
    expect(item.attributes('role')).toBe('option');
    expect(item.attributes('aria-selected')).toBe('true');
    expect(item.attributes('id')).toMatch(/^search-option-/);
    expect(item.element.tagName).toBe('BUTTON');
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
    expect(w.find('.sp-input').attributes('aria-expanded')).toBe('false');
    expect(w.find('.sp-input').attributes('aria-activedescendant')).toBeUndefined();
    expect(w.find('.sp-empty').text()).toContain('没有匹配');
  });

  it('TC-VIZ-SEARCH-07 空态含复杂度速查快捷行，点击跳转并关闭（C-114）', async () => {
    const w = mountIt();
    const store = useSystemStore();
    store.openSearch();
    await flushPromises();
    const sc = w.find('.sp-shortcut');
    expect(sc.text()).toContain('复杂度速查');
    await sc.trigger('click');
    expect(push).toHaveBeenCalledWith('/docs/complexity');
    expect(store.isSearchOpen).toBe(false);
  });

  it('TC-VIZ-SEARCH-08 空态含学习路径快捷行，点击跳转并关闭（C-115）', async () => {
    const w = mountIt();
    const store = useSystemStore();
    store.openSearch();
    await flushPromises();
    const shortcuts = w.findAll('.sp-shortcut');
    expect(shortcuts).toHaveLength(2);
    expect(shortcuts[1].text()).toContain('学习路径');
    await shortcuts[1].trigger('click');
    expect(push).toHaveBeenCalledWith('/docs/paths');
    expect(store.isSearchOpen).toBe(false);
  });
});
