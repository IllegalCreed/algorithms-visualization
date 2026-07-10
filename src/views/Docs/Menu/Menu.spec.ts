import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import Menu from './Menu.vue';

// TC-VIEW-MENU
// 同时覆盖 useMenuSelect（provide + onBeforeRouteUpdate）

const mockRouteName = ref<string>('array');

// 捕获 onBeforeRouteUpdate 注册的回调，用于 I-3 测试
let capturedBeforeRouteUpdateCallback: ((to: { name: string }) => void) | null = null;

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: mockRouteName.value }),
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

  it('TC-VIEW-MENU-07: 子菜单项渲染为可导航 RouterLink', () => {
    const w = mountIt();
    const firstItem = w.find('.item.btn');
    expect(firstItem.exists()).toBe(true);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'array' });
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
});
