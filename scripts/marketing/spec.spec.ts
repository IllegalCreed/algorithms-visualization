import { describe, expect, it } from 'vitest';
import {
  CAMPAIGN_SPEC_JSON_SCHEMA,
  createCampaignIdempotencyKey,
  normalizeCampaignSpec,
} from './spec';
import { makeCampaignSpec } from './test-fixtures';

describe('marketing CampaignSpec', () => {
  it('TC-AUTO-SPEC-127-01 规范化 token、集合、URL 与含时区排期', () => {
    const input = makeCampaignSpec();
    input.id = '  QUICK-SORT-LAUNCH  ';
    input.campaign = ' Launch-2026Q3 ';
    input.channels = ['mastodon', 'github', 'github', 'dev', 'weibo', 'bluesky'];
    input.locales = ['en', 'zh-CN', 'en'];
    const content = input.content as { media: string[] };
    content.media = ['image', 'image'];

    const result = normalizeCampaignSpec(input);

    expect(result.id).toBe('quick-sort-launch');
    expect(result.campaign).toBe('launch-2026q3');
    expect(result.channels).toEqual(['github', 'weibo', 'bluesky', 'dev', 'mastodon']);
    expect(result.locales).toEqual(['zh-CN', 'en']);
    expect(result.content.media).toEqual(['image']);
    expect(result.targetUrls[0]).toBe('https://algo.illegalscreed.cn/');
    expect(result.schedule).toEqual({
      original: '2026-07-12T20:00:00+09:00',
      utc: '2026-07-12T11:00:00.000Z',
      offset: '+09:00',
    });
  });

  it('TC-AUTO-SPEC-127-02 严格拒绝额外字段与凭据/任意执行字段', () => {
    expect(CAMPAIGN_SPEC_JSON_SCHEMA.additionalProperties).toBe(false);

    for (const field of ['password', 'token', 'Cookie', 'script', 'selector']) {
      expect(() =>
        normalizeCampaignSpec({ ...makeCampaignSpec(), [field]: 'do-not-store' }),
      ).toThrow(new RegExp(field, 'i'));
    }

    expect(() => normalizeCampaignSpec({ ...makeCampaignSpec(), unexpected: true })).toThrow(
      /unexpected/i,
    );
  });

  it('TC-AUTO-SPEC-127-03 拒绝非法 URL、渠道、locale、排期与 campaign token', () => {
    const invalidSpecs: Array<[string, () => Record<string, unknown>]> = [
      [
        'targetUrls',
        () => ({ ...makeCampaignSpec(), targetUrls: ['http://algo.illegalscreed.cn/'] }),
      ],
      ['origin', () => ({ ...makeCampaignSpec(), targetUrls: ['https://example.com/'] })],
      ['channels', () => ({ ...makeCampaignSpec(), channels: ['unknown-channel'] })],
      ['locales', () => ({ ...makeCampaignSpec(), locales: ['fr'] })],
      ['publishAt', () => ({ ...makeCampaignSpec(), publishAt: '2026-07-12T20:00:00' })],
      ['publishAt', () => ({ ...makeCampaignSpec(), publishAt: '2026-02-31T20:00:00+09:00' })],
      ['campaign', () => ({ ...makeCampaignSpec(), campaign: 'launch with spaces' })],
    ];

    for (const [message, createSpec] of invalidSpecs) {
      expect(() => normalizeCampaignSpec(createSpec())).toThrow(new RegExp(message, 'i'));
    }
  });

  it('TC-AUTO-SPEC-127-04 locale 与内容变体一一对应且不修改输入', () => {
    const input = makeCampaignSpec();
    const snapshot = structuredClone(input);
    normalizeCampaignSpec(input);
    expect(input).toEqual(snapshot);

    const missingVariant = makeCampaignSpec();
    (missingVariant.content as { variants: Record<string, unknown> }).variants = {
      'zh-CN': {
        title: '只有中文',
        angle: '缺少英文变体。',
        callToAction: '查看',
      },
    };
    expect(() => normalizeCampaignSpec(missingVariant)).toThrow(/variants.*en/i);

    const extraVariant = makeCampaignSpec();
    extraVariant.locales = ['zh-CN'];
    expect(() => normalizeCampaignSpec(extraVariant)).toThrow(/variants.*en/i);
  });

  it('TC-AUTO-IDEMP-127-01 语义等价 spec 生成同一 SHA-256 幂等键', () => {
    const first = makeCampaignSpec();
    first.id = ' QUICK-SORT-LAUNCH ';
    first.campaign = ' Launch-2026Q3 ';
    first.channels = ['mastodon', 'dev', 'bluesky', 'weibo', 'github'];
    first.locales = ['en', 'zh-CN'];

    const second = makeCampaignSpec();
    const firstKey = createCampaignIdempotencyKey(first);
    const secondKey = createCampaignIdempotencyKey(second);

    expect(firstKey).toBe(secondKey);
    expect(firstKey).toMatch(/^campaign-v1\/quick-sort-launch\/[a-f0-9]{64}$/);
  });

  it('TC-AUTO-IDEMP-127-02 文案、目标 URL 或排期变化都会更换幂等键', () => {
    const base = makeCampaignSpec();
    const changedContent = structuredClone(base);
    (changedContent.content as { variants: Record<string, { angle: string }> }).variants.en.angle +=
      ' Updated.';
    const changedUrl = { ...makeCampaignSpec(), targetUrls: ['https://algo.illegalscreed.cn/en/'] };
    const changedSchedule = { ...makeCampaignSpec(), publishAt: '2026-07-13T20:00:00+09:00' };

    const keys = [base, changedContent, changedUrl, changedSchedule].map(
      createCampaignIdempotencyKey,
    );
    expect(new Set(keys).size).toBe(4);
  });
});
