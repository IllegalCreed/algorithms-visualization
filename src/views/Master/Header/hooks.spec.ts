import { describe, it, expect, vi } from 'vitest';
import { useIconLink } from './hooks';
import { HOME_PAGE_URL } from './share';

// TC-HOOK-05: Master/Header useIconLink（C-009 起：分享/仓库按钮；C-030 增个人主页外链）

vi.mock('vue-router', () => ({
  useRoute: () => ({ fullPath: '/sort/bubble-sort' }),
}));

describe('Master/Header useIconLink', () => {
  it('TC-HOOK-05-1: 返回 4 项，顺序 微博/X/GitHub/个人主页，title 为新行为文案', () => {
    const data = useIconLink().value;
    expect(data).toHaveLength(4);
    expect(data.map((d) => d.title)).toEqual(['分享到微博', '分享到 X', 'GitHub 仓库', '个人主页']);
  });

  it('TC-HOOK-05-2: 每项 title/src/url 非空且 url 为 https', () => {
    const data = useIconLink().value;
    for (const item of data) {
      expect(item.title).toBeTruthy();
      expect(item.src).toBeTruthy();
      expect(item.url).toMatch(/^https:\/\//);
    }
  });

  it('TC-HOOK-05-3: 微博/X url 含线上域名+当前 path；GitHub url=仓库地址', () => {
    const [weibo, x, github] = useIconLink().value;
    const target = 'https://algo.illegalscreed.cn/sort/bubble-sort';
    expect(weibo.url).toContain('service.weibo.com/share/share.php');
    expect(new URL(weibo.url).searchParams.get('url')).toBe(target);
    expect(x.url).toContain('twitter.com/intent/tweet');
    expect(new URL(x.url).searchParams.get('url')).toBe(target);
    expect(github.url).toBe('https://github.com/IllegalCreed/algorithms-visualization');
  });

  it('TC-HOOK-05-4: 个人主页项 url 指向 HOME_PAGE_URL（C-030）', () => {
    const home = useIconLink().value.find((d) => d.title === '个人主页');
    expect(home?.url).toBe(HOME_PAGE_URL);
  });
});
