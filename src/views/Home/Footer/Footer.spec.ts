import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Footer from './Footer.vue';

// TC-VIEW-FOOTER

describe('Footer 组件', () => {
  it('TC-VIEW-FOOTER-01: 渲染 MIT Licensed 文案', () => {
    const w = mount(Footer);
    expect(w.text()).toContain('MIT Licensed');
  });

  it('TC-VIEW-FOOTER-02: 渲染 Copyright 文案', () => {
    const w = mount(Footer);
    expect(w.text()).toContain('Copyright');
  });

  it('TC-VIEW-FOOTER-03: 渲染 Zhang Xu 署名', () => {
    const w = mount(Footer);
    expect(w.text()).toContain('Zhang Xu');
  });

  it('TC-VIEW-FOOTER-04: 渲染 footer 根元素', () => {
    const w = mount(Footer);
    expect(w.find('#footer').exists()).toBe(true);
  });

  it('TC-ADS-ALGO-134-04: 隐私政策链接按 locale 指向个人站且不获得 opener', () => {
    const zhLink = mount(Footer).get('a');
    expect(zhLink.text()).toBe('隐私政策');
    expect(zhLink.attributes('href')).toBe('https://illegalscreed.cn/zh/privacy');

    const enLink = mount(Footer, { props: { locale: 'en' } }).get('a');
    expect(enLink.text()).toBe('Privacy');
    expect(enLink.attributes('href')).toBe('https://illegalscreed.cn/privacy');

    for (const link of [zhLink, enLink]) {
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
    }
  });
});
