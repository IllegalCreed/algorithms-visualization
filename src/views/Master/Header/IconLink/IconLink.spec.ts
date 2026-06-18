import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import IconLink from './IconLink.vue';

// TC-VIEW-ICONLINK

const mockWindowOpen = vi.fn();

describe('Master/Header/IconLink 组件', () => {
  beforeEach(() => {
    vi.stubGlobal('open', mockWindowOpen);
    mockWindowOpen.mockReset();
  });

  const mockData = {
    url: 'https://www.github.com',
    src: 'github.svg',
    title: 'github',
  };

  it('TC-VIEW-ICONLINK-01: 渲染 .icon-link 根元素', () => {
    const w = mount(IconLink, { props: { data: mockData } });
    expect(w.find('.icon-link').exists()).toBe(true);
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

  it('TC-VIEW-ICONLINK-05: 点击调用 window.open 打开对应 url', async () => {
    const w = mount(IconLink, { props: { data: mockData } });
    await w.find('.icon-link').trigger('click');
    expect(mockWindowOpen).toHaveBeenCalledOnce();
    expect(mockWindowOpen).toHaveBeenCalledWith('https://www.github.com');
  });

  it('TC-VIEW-ICONLINK-06: 不同 url 也能正确打开', async () => {
    const twitterData = {
      url: 'https://www.twitter.com',
      src: 'twitter.svg',
      title: 'twitter',
    };
    const w = mount(IconLink, { props: { data: twitterData } });
    await w.find('.icon-link').trigger('click');
    expect(mockWindowOpen).toHaveBeenCalledWith('https://www.twitter.com');
  });
});
