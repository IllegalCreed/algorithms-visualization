import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Item from './Item.vue';

// TC-VIEW-HOME-ITEM

const mockItem = {
  title: '数组',
  desc: '有序元素序列',
  icon: 'array.svg',
  url: 'array',
};

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a v-bind="$attrs"><slot /></a>',
};

const mountIt = (data = mockItem) =>
  mount(Item, {
    props: { data },
    global: { stubs: { RouterLink: RouterLinkStub } },
  });

describe('Home/Category/Item 组件', () => {
  it('TC-VIEW-HOME-ITEM-01: 渲染 item 标题', () => {
    const w = mountIt();
    expect(w.find('h3').text()).toBe('数组');
  });

  it('TC-VIEW-HOME-ITEM-02: 渲染 item 描述', () => {
    const w = mountIt();
    expect(w.find('span').text()).toBe('有序元素序列');
  });

  it('TC-VIEW-HOME-ITEM-03: 渲染 img 标签（icon）', () => {
    const w = mountIt();
    expect(w.find('img').exists()).toBe(true);
  });

  it('TC-VIEW-HOME-ITEM-04: img src 属性对应 icon 字段', () => {
    const w = mountIt();
    expect(w.find('img').attributes('src')).toBe('array.svg');
  });

  it('TC-VIEW-HOME-ITEM-05: 根元素是指向对应 url name 的 RouterLink', () => {
    const w = mountIt();
    expect(w.find('a.item').exists()).toBe(true);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'array' });
  });

  it('TC-VIEW-HOME-ITEM-06: 不同 url 链接到对应路由名', () => {
    const treeItem = { title: '树', desc: '树结构', icon: 'tree.svg', url: 'tree' };
    const w = mountIt(treeItem);
    expect(w.findComponent({ name: 'RouterLink' }).props('to')).toEqual({ name: 'tree' });
  });
});
