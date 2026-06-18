import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import Item from './Item.vue';

// TC-VIEW-DOCS-ITEM

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockItem = { title: '数组', url: 'array' };

describe('Docs/Menu/Header/Item 组件', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('TC-VIEW-DOCS-ITEM-01: 渲染 item span 文本', () => {
    const w = mount(Item, {
      props: { data: mockItem },
      global: { provide: { currentSelectMenuItemKey: null } },
    });
    expect(w.find('span').text()).toBe('数组');
  });

  it('TC-VIEW-DOCS-ITEM-02: 渲染 .item.btn class', () => {
    const w = mount(Item, {
      props: { data: mockItem },
      global: { provide: { currentSelectMenuItemKey: null } },
    });
    expect(w.find('.item.btn').exists()).toBe(true);
  });

  it('TC-VIEW-DOCS-ITEM-03: 点击调用 router.push 跳转到对应 url', async () => {
    const w = mount(Item, {
      props: { data: mockItem },
      global: { provide: { currentSelectMenuItemKey: null } },
    });
    await w.find('.item').trigger('click');
    expect(mockPush).toHaveBeenCalledOnce();
    expect(mockPush).toHaveBeenCalledWith({ name: 'array' });
  });

  it('TC-VIEW-DOCS-ITEM-04: url 匹配时 item 有 item-pressed class', () => {
    const key = ref('array');
    const w = mount(Item, {
      props: { data: mockItem },
      global: { provide: { currentSelectMenuItemKey: key } },
    });
    expect(w.find('.item-pressed').exists()).toBe(true);
  });

  it('TC-VIEW-DOCS-ITEM-05: url 不匹配时 item 无 item-pressed class', () => {
    const key = ref('link');
    const w = mount(Item, {
      props: { data: mockItem },
      global: { provide: { currentSelectMenuItemKey: key } },
    });
    expect(w.find('.item-pressed').exists()).toBe(false);
  });

  it('TC-VIEW-DOCS-ITEM-06: 不同 url 跳转对应路由', async () => {
    const stackItem = { title: '栈', url: 'stack' };
    const w = mount(Item, {
      props: { data: stackItem },
      global: { provide: { currentSelectMenuItemKey: null } },
    });
    await w.find('.item').trigger('click');
    expect(mockPush).toHaveBeenCalledWith({ name: 'stack' });
  });
});
