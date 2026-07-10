import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import privacyHtml from '../../public/privacy.html?raw';

describe('public analytics privacy notice', () => {
  it('TC-ANL-PRIVACY-125-02 声明 provider、无 Cookie、会话归因与自由文本边界', () => {
    const dom = new JSDOM(privacyHtml);
    const text = (dom.window.document.body.textContent ?? '').replace(/\s+/g, ' ');

    expect(dom.window.document.documentElement.lang).toBe('zh-CN');
    expect(text).toContain('Umami Cloud');
    expect(text).toContain('不使用统计 Cookie');
    expect(text).toContain('sessionStorage');
    expect(text).toContain('搜索词原文');
    expect(text).toContain('算法输入值');
    expect(text).toContain('Do Not Track');
  });

  it('隐私页在 Cloud 区域/保留期确认前明确不启用生产统计', () => {
    const dom = new JSDOM(privacyHtml);
    const document = dom.window.document;
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex,follow',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://algo.illegalscreed.cn/privacy.html',
    );
    expect(document.body.textContent).toContain('确认前不会启用生产统计');
  });
});
