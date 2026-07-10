import { describe, expect, it } from 'vitest';
import launchPosts from '../../docs/marketing/launch-posts.md?raw';
import { buildCampaignUrl, normalizeCampaignToken, readCampaignParams } from './utm';

describe('analytics UTM', () => {
  it('TC-ATTR-UTM-125-01 合法 token 去空白并统一小写', () => {
    expect(normalizeCampaignToken('  ChatGPT.COM  ')).toBe('chatgpt.com');
    expect(normalizeCampaignToken('Launch_2026-Q3')).toBe('launch_2026-q3');

    const params = readCampaignParams(
      new URL(
        'https://algo.illegalscreed.cn/?utm_source=JUEJIN&utm_medium=Community&utm_campaign=Launch-2026Q3&utm_content=Quick-Sort',
      ),
    );
    expect(params).toEqual({
      source: 'juejin',
      medium: 'community',
      campaign: 'launch-2026q3',
      content: 'quick-sort',
    });
  });

  it('TC-ATTR-UTM-125-02 拒绝空白、自由文本、邮箱/路径与超长 token', () => {
    expect(normalizeCampaignToken('')).toBeUndefined();
    expect(normalizeCampaignToken('quick sort')).toBeUndefined();
    expect(normalizeCampaignToken('用户输入')).toBeUndefined();
    expect(normalizeCampaignToken('person@example.com')).toBeUndefined();
    expect(normalizeCampaignToken('../private')).toBeUndefined();
    expect(normalizeCampaignToken('a'.repeat(65))).toBeUndefined();

    const params = readCampaignParams(
      new URL(
        'https://algo.illegalscreed.cn/?utm_source=%E7%94%A8%E6%88%B7&utm_medium=social&utm_campaign=hello%20world&utm_content=x',
      ),
    );
    expect(params).toEqual({ medium: 'social', content: 'x' });
  });

  it('TC-MARKETING-LINKS-125-01 campaign URL 保留原 query/hash 并规范写入 UTM', () => {
    const result = buildCampaignUrl(
      'https://algo.illegalscreed.cn/docs/quick-sort?input=9,5,1#player',
      {
        source: ' V2EX ',
        medium: 'Community',
        campaign: 'Launch-2026Q3',
        content: 'Quick-Sort-Post',
      },
    );
    const url = new URL(result);

    expect(url.searchParams.get('input')).toBe('9,5,1');
    expect(url.searchParams.get('utm_source')).toBe('v2ex');
    expect(url.searchParams.get('utm_medium')).toBe('community');
    expect(url.searchParams.get('utm_campaign')).toBe('launch-2026q3');
    expect(url.searchParams.get('utm_content')).toBe('quick-sort-post');
    expect(url.hash).toBe('#player');
    expect([...url.searchParams.keys()]).toEqual([
      'input',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
    ]);
  });

  it('TC-MARKETING-LINKS-125-02 launch-posts 中每个站点目标都能生成可反解析链接', () => {
    const targets = [
      ...new Set(launchPosts.match(/https:\/\/algo\.illegalscreed\.cn[^\s）]*/g) ?? []),
    ];
    expect(targets.length).toBeGreaterThanOrEqual(2);

    for (const [index, target] of targets.entries()) {
      const result = new URL(
        buildCampaignUrl(target, {
          source: 'launch-docs',
          medium: 'community',
          campaign: 'launch-2026q3',
          content: `target-${index + 1}`,
        }),
      );
      expect(result.protocol).toBe('https:');
      expect(readCampaignParams(result)).toEqual({
        source: 'launch-docs',
        medium: 'community',
        campaign: 'launch-2026q3',
        content: `target-${index + 1}`,
      });
    }
  });

  it('campaign 链接缺字段或字段非法时拒绝生成', () => {
    expect(() =>
      buildCampaignUrl('https://algo.illegalscreed.cn', {
        source: 'juejin',
        medium: 'community',
        campaign: 'launch-2026q3',
        content: '含自由文本',
      }),
    ).toThrow(/content/);
    expect(() =>
      buildCampaignUrl('javascript:alert(1)', {
        source: 'juejin',
        medium: 'community',
        campaign: 'launch-2026q3',
        content: 'root',
      }),
    ).toThrow(/https/i);
  });
});
