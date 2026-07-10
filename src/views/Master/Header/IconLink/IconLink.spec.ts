import { beforeEach, describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import IconLink from './IconLink.vue';

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('@/analytics/client', () => ({ trackEvent }));

// TC-VIEW-ICONLINK

describe('Master/Header/IconLink 组件', () => {
  const mockData = {
    url: 'https://www.github.com',
    src: 'github.svg',
    title: 'github',
  };

  beforeEach(() => {
    trackEvent.mockClear();
  });

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

  it('TC-ANL-EVENTS-125-06 微博/X 发 share，普通外链不发送', async () => {
    const weibo = mount(IconLink, {
      props: {
        data: {
          url: 'https://service.weibo.com/share/share.php',
          src: 'weibo.svg',
          title: '分享到微博',
          share: { channel: 'weibo', path: '/docs/quick-sort' },
        },
      },
    });
    const x = mount(IconLink, {
      props: {
        data: {
          url: 'https://twitter.com/intent/tweet',
          src: 'x.svg',
          title: '分享到 X',
          share: { channel: 'x', path: '/docs/quick-sort' },
        },
      },
    });
    const ordinary = mount(IconLink, { props: { data: mockData } });

    await weibo.find('a').trigger('click');
    await x.find('a').trigger('click');
    await ordinary.find('a').trigger('click');
    expect(trackEvent.mock.calls).toEqual([
      ['share', { channel: 'weibo', path: '/docs/quick-sort' }],
      ['share', { channel: 'x', path: '/docs/quick-sort' }],
    ]);
  });
});
