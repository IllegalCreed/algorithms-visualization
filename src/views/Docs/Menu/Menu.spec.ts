import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import Menu from './Menu.vue';
import { useCategoryData, useEnglishCategoryData } from './hooks';

// TC-VIEW-MENU
// 同时覆盖 useMenuSelect（provide + onBeforeRouteUpdate）

const mockRouteName = ref<string>('array');
const mockRoutePath = ref<string>('/docs/array');

// 捕获 onBeforeRouteUpdate 注册的回调，用于 I-3 测试
let capturedBeforeRouteUpdateCallback: ((to: { name: string }) => void) | null = null;

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: mockRouteName.value, path: mockRoutePath.value, query: {} }),
  onBeforeRouteUpdate: vi.fn((cb) => {
    capturedBeforeRouteUpdateCallback = cb;
  }),
}));

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a v-bind="$attrs"><slot /></a>',
};

const mountIt = () => mount(Menu, { global: { stubs: { RouterLink: RouterLinkStub } } });

describe('Docs/Menu 组件（含 useMenuSelect 覆盖）', () => {
  beforeEach(() => {
    capturedBeforeRouteUpdateCallback = null;
    mockRouteName.value = 'array';
    mockRoutePath.value = '/docs/array';
  });

  it('TC-VIEW-MENU-01: 挂载成功，渲染 #menu 根元素', () => {
    const w = mountIt();
    expect(w.find('#menu').exists()).toBe(true);
  });

  it('TC-VIEW-MENU-02: 渲染「数据结构」分类标题', () => {
    const w = mountIt();
    expect(w.text()).toContain('数据结构');
  });

  it('TC-VIEW-MENU-03: 渲染「经典排序算法」分类标题', () => {
    const w = mountIt();
    expect(w.text()).toContain('经典排序算法');
  });

  it('TC-VIEW-MENU-04: 渲染所有数据结构子项（如「数组」「链表」）', () => {
    const w = mountIt();
    expect(w.text()).toContain('数组');
    expect(w.text()).toContain('链表');
  });

  it('TC-VIEW-MENU-05: 渲染排序算法子项「冒泡排序」', () => {
    const w = mountIt();
    expect(w.text()).toContain('冒泡排序');
  });

  it('TC-MENU-TOOLS-132-02: 中文菜单渲染两个学习工具并高亮当前复杂度页', () => {
    mockRouteName.value = 'complexity';
    mockRoutePath.value = '/docs/complexity';
    const w = mountIt();

    expect(w.findAll('.item')).toHaveLength(94);
    expect(w.text()).toContain('学习工具');
    expect(w.text()).toContain('算法复杂度速查');
    expect(w.text()).toContain('算法学习路径');
    expect(w.find('.item-pressed').text()).toBe('算法复杂度速查');
  });

  it('TC-VIEW-MENU-06: useMenuSelect 通过 provide 注入 currentSelectMenuItemKey，初始路由 array 使对应 Item 有 item-pressed class', () => {
    // 设置当前路由名为 'array'
    mockRouteName.value = 'array';
    const w = mountIt();
    // useMenuSelect 读取 route.name 初始化 currentSelectMenuItemKey 并 provide 给子组件
    // Item.vue 中当 currentSelectMenuItemKey == data.url 时添加 item-pressed class
    // 因此 url='array'（标题「数组」）对应的 Item 应有 item-pressed class
    const pressedItems = w.findAll('.item-pressed');
    expect(pressedItems.length).toBe(1);
    expect(pressedItems[0].text()).toBe('数组');
  });

  it('TC-VIEW-MENU-07: 首个子菜单项渲染为可导航 RouterLink', () => {
    const w = mountIt();
    const firstItem = w.find('.item.btn');
    expect(firstItem.exists()).toBe(true);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'complexity' });
  });

  it('TC-VIEW-MENU-08: onBeforeRouteUpdate 回调触发后 currentSelectMenuItemKey 更新，Item 的 item-pressed class 随之变化', async () => {
    // onBeforeRouteUpdate 是 vue-router 导航守卫，无法在单元测试中真实触发。
    // 策略：mock 实现捕获注册的回调，手动调用后断言 provide 的 ref 更新影响渲染。
    mockRouteName.value = 'array';
    const w = mountIt();

    // 初始：array 对应 Item 有 item-pressed
    expect(w.findAll('.item-pressed')[0].text()).toBe('数组');

    // 模拟路由切换到 'link'：手动调用捕获到的 onBeforeRouteUpdate 回调
    expect(capturedBeforeRouteUpdateCallback).not.toBeNull();
    await capturedBeforeRouteUpdateCallback!({ name: 'link' });
    await nextTick();

    // 切换后：link 对应 Item（「链表」）应有 item-pressed，array 不再有
    const pressedItems = w.findAll('.item-pressed');
    expect(pressedItems.length).toBe(1);
    expect(pressedItems[0].text()).toBe('链表');
  });

  it('TC-I18N-UI-131-03: 英文 Docs 菜单渲染 94 个内容页并高亮当前项', () => {
    mockRouteName.value = 'en-quick-sort';
    mockRoutePath.value = '/en/docs/quick-sort';
    const w = mountIt();

    expect(w.findAll('.item')).toHaveLength(94);
    expect(w.text()).toContain('Learning Tools');
    expect(w.text()).toContain('Quick Sort');
    expect(w.text()).toContain('Convex Hull');
    expect(w.text()).toContain('Topological Sort');
    expect(w.text()).toContain('Closest Pair of Points');
    expect(w.text()).toContain('Longest Common Subsequence');
    expect(w.text()).toContain('N-Queens');
    expect(w.text()).toContain('Rabin-Karp String Matching');
    expect(w.text()).toContain('Euclidean Algorithm');
    expect(w.text()).not.toContain('冒泡排序');
    expect(w.find('.item-pressed').text()).toBe('Quick Sort');
  });

  it('TC-I18N-UI-131-08: 英文学习目录与中文目录保持同分类、同条目顺序', () => {
    const chineseCategories = useCategoryData();
    const englishCategories = useEnglishCategoryData();

    expect(englishCategories.map((category) => category.title)).toEqual([
      'Learning Tools',
      'Data Structures',
      'Sorting',
      'Graph Algorithms',
      'Dynamic Programming',
      'Backtracking and Search',
      'Strings',
      'Math and Number Theory',
      'Computational Geometry',
      'Searching',
    ]);
    expect(englishCategories[0].children.map((item) => item.url)).toEqual([
      'en-complexity',
      'en-paths',
    ]);
    expect(
      englishCategories
        .slice(1)
        .map((category) => category.children.map((item) => item.url.replace(/^en-/, ''))),
    ).toEqual(
      chineseCategories.slice(1).map((category) => category.children.map((item) => item.url)),
    );
  });

  it('TC-MENU-TOOLS-132-03: 中英文完整侧边栏均为十组并保持条目同序', () => {
    const chineseCategories = useCategoryData();
    const englishCategories = useEnglishCategoryData();

    expect(chineseCategories.map((category) => category.title)).toEqual([
      '学习工具',
      '数据结构',
      '经典排序算法',
      '图算法',
      '动态规划',
      '回溯与搜索',
      '字符串',
      '数学与数论',
      '计算几何',
      '查找',
    ]);
    expect(
      englishCategories.map((category) =>
        category.children.map((item) => item.url.replace(/^en-/, '')),
      ),
    ).toEqual(chineseCategories.map((category) => category.children.map((item) => item.url)));
  });
});
