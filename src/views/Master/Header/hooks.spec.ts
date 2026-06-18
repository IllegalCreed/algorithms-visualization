import { describe, it, expect } from 'vitest';
import { useIconLink } from './hooks';

// TC-HOOK-05: Master/Header useIconLink

describe('Master/Header useIconLink', () => {
  const data = useIconLink();

  it('TC-HOOK-05-1: 返回 3 个社交链接（github/twitter/微博）', () => {
    expect(data).toHaveLength(3);
    const titles = data.map((item) => item.title);
    expect(titles).toContain('github');
    expect(titles).toContain('twitter');
    expect(titles).toContain('新浪微博');
  });

  it('TC-HOOK-05-2: 每项含 title/src/url 且均非空', () => {
    for (const item of data) {
      expect(item.title).toBeTruthy();
      expect(item.src).toBeTruthy();
      expect(item.url).toBeTruthy();
    }
  });

  it('TC-HOOK-05-3: 所有 url 为合法的 https 地址', () => {
    for (const item of data) {
      expect(item.url).toMatch(/^https:\/\//);
    }
  });
});
