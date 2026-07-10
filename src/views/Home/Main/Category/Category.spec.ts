import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Category from './Category.vue';

// TC-VIEW-CATEGORY

const mockCategory = {
  title: '数据结构',
  desc: '常见数据结构介绍',
  children: [
    { title: '数组', desc: '有序元素序列', icon: 'array.svg', url: 'array' },
    { title: '链表', desc: '链式存储结构', icon: 'link.svg', url: 'link' },
  ],
};

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a v-bind="$attrs"><slot /></a>',
};

const mountIt = (data = mockCategory) =>
  mount(Category, {
    props: { data },
    global: { stubs: { RouterLink: RouterLinkStub } },
  });

describe('Category 组件', () => {
  it('TC-VIEW-CATEGORY-01: 渲染分类标题', () => {
    const w = mountIt();
    expect(w.find('h2').text()).toBe('数据结构');
  });

  it('TC-VIEW-CATEGORY-02: 渲染分类描述', () => {
    const w = mountIt();
    expect(w.find('span').text()).toBe('常见数据结构介绍');
  });

  it('TC-VIEW-CATEGORY-03: 渲染 children 数量对应的 Item', () => {
    const w = mountIt();
    // 每个 Item 内部有 h3 标题
    const items = w.findAll('h3');
    expect(items).toHaveLength(2);
  });

  it('TC-VIEW-CATEGORY-04: 渲染第一个 Item 标题「数组」', () => {
    const w = mountIt();
    expect(w.text()).toContain('数组');
  });

  it('TC-VIEW-CATEGORY-05: 渲染第二个 Item 标题「链表」', () => {
    const w = mountIt();
    expect(w.text()).toContain('链表');
  });

  it('TC-VIEW-CATEGORY-06: children 为空时无 Item 渲染', () => {
    const w = mountIt({ title: '空分类', desc: '无内容', children: [] });
    expect(w.findAll('h3')).toHaveLength(0);
  });
});
