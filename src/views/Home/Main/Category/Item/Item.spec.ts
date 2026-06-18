import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Item from './Item.vue';

// TC-VIEW-HOME-ITEM

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockItem = {
  title: '数组',
  desc: '有序元素序列',
  icon: 'array.svg',
  url: 'array',
};

describe('Home/Category/Item 组件', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('TC-VIEW-HOME-ITEM-01: 渲染 item 标题', () => {
    const w = mount(Item, { props: { data: mockItem } });
    expect(w.find('h3').text()).toBe('数组');
  });

  it('TC-VIEW-HOME-ITEM-02: 渲染 item 描述', () => {
    const w = mount(Item, { props: { data: mockItem } });
    expect(w.find('span').text()).toBe('有序元素序列');
  });

  it('TC-VIEW-HOME-ITEM-03: 渲染 img 标签（icon）', () => {
    const w = mount(Item, { props: { data: mockItem } });
    expect(w.find('img').exists()).toBe(true);
  });

  it('TC-VIEW-HOME-ITEM-04: img src 属性对应 icon 字段', () => {
    const w = mount(Item, { props: { data: mockItem } });
    expect(w.find('img').attributes('src')).toBe('array.svg');
  });

  it('TC-VIEW-HOME-ITEM-05: 点击元素调用 router.push，跳转到对应 url name', async () => {
    const w = mount(Item, { props: { data: mockItem } });
    await w.find('.item').trigger('click');
    expect(mockPush).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith({ name: 'array' });
  });

  it('TC-VIEW-HOME-ITEM-06: 不同 url 跳转到对应路由名', async () => {
    const treeItem = { title: '树', desc: '树结构', icon: 'tree.svg', url: 'tree' };
    const w = mount(Item, { props: { data: treeItem } });
    await w.find('.item').trigger('click');
    expect(mockPush).toHaveBeenCalledWith({ name: 'tree' });
  });
});
