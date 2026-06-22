import { describe, it, expect } from 'vitest';
import {
  SITE_ORIGIN,
  GITHUB_REPO_URL,
  SHARE_TEXT,
  buildShareTargetUrl,
  buildWeiboShareUrl,
  buildXShareUrl,
} from './share';

// TC-SHARE: Master/Header 分享 URL 纯函数（C-009）

describe('Master/Header share 纯函数', () => {
  it('TC-SHARE-01: buildShareTargetUrl 把 fullPath 拼到线上域名后', () => {
    expect(buildShareTargetUrl('/sort/bubble-sort')).toBe(
      'https://algo.illegalscreed.cn/sort/bubble-sort',
    );
  });

  it('TC-SHARE-02: buildShareTargetUrl 保留 query/hash', () => {
    expect(buildShareTargetUrl('/sort/bubble-sort?lang=py')).toBe(
      'https://algo.illegalscreed.cn/sort/bubble-sort?lang=py',
    );
  });

  it('TC-SHARE-03: buildWeiboShareUrl 指向微博分享页且含 url/title', () => {
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort';
    const url = buildWeiboShareUrl(target, '测试文案');
    expect(url).toContain('https://service.weibo.com/share/share.php?');
    const qs = new URL(url).searchParams;
    expect(qs.get('url')).toBe(target);
    expect(qs.get('title')).toBe('测试文案');
  });

  it('TC-SHARE-04: buildXShareUrl 指向 X 分享页且含 url/text', () => {
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort';
    const url = buildXShareUrl(target, '测试文案');
    expect(url).toContain('https://twitter.com/intent/tweet?');
    const qs = new URL(url).searchParams;
    expect(qs.get('url')).toBe(target);
    expect(qs.get('text')).toBe('测试文案');
  });

  it('TC-SHARE-05: 链接与中文文案经 URLSearchParams 正确编码（round-trip 还原）', () => {
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort?a=1&b=2';
    const text = '算法 & 可视化';
    const url = buildWeiboShareUrl(target, text);
    expect(url).toContain('%3A%2F%2F'); // :// 被编码，不破坏外层 URL
    expect(url).not.toContain('算法'); // 中文被百分号编码
    const qs = new URL(url).searchParams;
    expect(qs.get('url')).toBe(target); // 解析回来与原值一致
    expect(qs.get('title')).toBe(text);
  });

  it('TC-SHARE-06: 常量 GITHUB_REPO_URL / SITE_ORIGIN / SHARE_TEXT 校验', () => {
    expect(GITHUB_REPO_URL).toBe('https://github.com/IllegalCreed/algorithms-visualization');
    expect(SITE_ORIGIN).toBe('https://algo.illegalscreed.cn');
    expect(SHARE_TEXT).toBeTruthy();
  });
});
