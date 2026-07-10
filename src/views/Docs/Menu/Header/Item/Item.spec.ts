import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import Item from './Item.vue';

// TC-VIEW-DOCS-ITEM

const mockItem = { title: '数组', url: 'array' };

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a v-bind="$attrs"><slot /></a>',
};

const mountIt = (data = mockItem, currentSelectMenuItemKey: unknown = null) =>
  mount(Item, {
    props: { data },
    global: {
      provide: { currentSelectMenuItemKey },
      stubs: { RouterLink: RouterLinkStub },
    },
  });

describe('Docs/Menu/Header/Item 组件', () => {
  it('TC-VIEW-DOCS-ITEM-01: 渲染 item span 文本', () => {
    const w = mountIt();
    expect(w.find('span').text()).toBe('数组');
  });

  it('TC-VIEW-DOCS-ITEM-02: 渲染 .item.btn class', () => {
    const w = mountIt();
    expect(w.find('.item.btn').exists()).toBe(true);
  });

  it('TC-VIEW-DOCS-ITEM-03: 渲染指向对应 url name 的 RouterLink', () => {
    const w = mountIt();
    expect(w.find('a.item').exists()).toBe(true);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'array' });
  });

  it('TC-VIEW-DOCS-ITEM-04: url 匹配时 item 有 item-pressed class', () => {
    const key = ref('array');
    const w = mountIt(mockItem, key);
    expect(w.find('.item-pressed').exists()).toBe(true);
  });

  it('TC-VIEW-DOCS-ITEM-05: url 不匹配时 item 无 item-pressed class', () => {
    const key = ref('link');
    const w = mountIt(mockItem, key);
    expect(w.find('.item-pressed').exists()).toBe(false);
  });

  it('TC-VIEW-DOCS-ITEM-06: 不同 url 链接到对应路由', () => {
    const stackItem = { title: '栈', url: 'stack' };
    const w = mountIt(stackItem);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'stack' });
  });
});
