import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconLink from './IconLink.vue';

// TC-VIEW-ICONLINK

describe('Master/Header/IconLink 组件', () => {
  const mockData = {
    url: 'https://www.github.com',
    src: 'github.svg',
    title: 'github',
  };

  it('TC-VIEW-ICONLINK-01: 渲染 .icon-link 根元素', () => {
    const w = mount(IconLink, { props: { data: mockData } });
    expect(w.find('a.icon-link').exists()).toBe(true);
  });

  it('TC-VIEW-ICONLINK-02: 渲染 img 标签', () => {
    const w = mount(IconLink, { props: { data: mockData } });
    expect(w.find('img').exists()).toBe(true);
  });

  it('TC-VIEW-ICONLINK-03: img src 属性正确', () => {
    const w = mount(IconLink, { props: { data: mockData } });
    expect(w.find('img').attributes('src')).toBe('github.svg');
  });

  it('TC-VIEW-ICONLINK-04: title 属性渲染到元素上', () => {
    const w = mount(IconLink, { props: { data: mockData } });
    expect(w.find('.icon-link').attributes('title')).toBe('github');
  });

  it('TC-VIEW-ICONLINK-05: 外链使用新标签页安全属性打开对应 url', () => {
    const w = mount(IconLink, { props: { data: mockData } });
    const link = w.find('a.icon-link');
    expect(link.attributes('href')).toBe('https://www.github.com');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
    expect(link.attributes('aria-label')).toBe('github');
  });

  it('TC-VIEW-ICONLINK-06: 不同 url 也能正确渲染 href', () => {
    const twitterData = {
      url: 'https://www.twitter.com',
      src: 'twitter.svg',
      title: 'twitter',
    };
    const w = mount(IconLink, { props: { data: twitterData } });
    expect(w.find('a.icon-link').attributes('href')).toBe('https://www.twitter.com');
  });
});
