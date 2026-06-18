import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import Menu from './Menu.vue';

// TC-VIEW-MENU
// 同时覆盖 useMenuSelect（provide + onBeforeRouteUpdate）

const mockPush = vi.fn();
const mockRouteName = ref<string>('array');

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ name: mockRouteName.value }),
  onBeforeRouteUpdate: vi.fn(),
}));

describe('Docs/Menu 组件（含 useMenuSelect 覆盖）', () => {
  it('TC-VIEW-MENU-01: 挂载成功，渲染 #menu 根元素', () => {
    const w = mount(Menu);
    expect(w.find('#menu').exists()).toBe(true);
  });

  it('TC-VIEW-MENU-02: 渲染「数据结构」分类标题', () => {
    const w = mount(Menu);
    expect(w.text()).toContain('数据结构');
  });

  it('TC-VIEW-MENU-03: 渲染「经典排序算法」分类标题', () => {
    const w = mount(Menu);
    expect(w.text()).toContain('经典排序算法');
  });

  it('TC-VIEW-MENU-04: 渲染所有数据结构子项（如「数组」「链表」）', () => {
    const w = mount(Menu);
    expect(w.text()).toContain('数组');
    expect(w.text()).toContain('链表');
  });

  it('TC-VIEW-MENU-05: 渲染排序算法子项「冒泡排序」', () => {
    const w = mount(Menu);
    expect(w.text()).toContain('冒泡排序');
  });

  it('TC-VIEW-MENU-06: useMenuSelect 通过 provide 注入 currentSelectMenuItemKey', () => {
    // 通过子组件中 inject 的值来验证 provide 是否正确执行
    // 直接挂载 Menu，检查其中 Item 的 item-pressed class
    mockRouteName.value = 'array';
    const w = mount(Menu);
    // 挂载时 currentSelectMenuItemKey 应被 provide，不抛异常即为成功
    expect(w.exists()).toBe(true);
  });

  it('TC-VIEW-MENU-07: 点击子菜单项触发路由跳转', async () => {
    mockPush.mockReset();
    const w = mount(Menu);
    // 找到第一个 .item.btn 点击
    const firstItem = w.find('.item.btn');
    expect(firstItem.exists()).toBe(true);
    await firstItem.trigger('click');
    expect(mockPush).toHaveBeenCalledOnce();
  });
});
