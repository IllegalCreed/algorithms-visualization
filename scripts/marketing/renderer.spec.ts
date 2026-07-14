import { describe, expect, it } from 'vitest';
import { readCampaignParams } from '../../src/analytics/utm';
import { normalizeCampaignSpec } from './spec';
import { renderChannelPackage } from './renderer';
import { makeCampaignSpec } from './test-fixtures';

function expectRenderCodes(spec: Record<string, unknown>, channel: string): string[] {
  try {
    renderChannelPackage(normalizeCampaignSpec(spec), channel as never);
    return [];
  } catch (error) {
    return (error as { issues: Array<{ code: string }> }).issues.map((issue) => issue.code);
  }
}

describe('marketing channel renderer', () => {
  it('TC-AUTO-RENDER-127-01 按渠道/locale 生成原生候选与唯一 UTM 链接', () => {
    const spec = normalizeCampaignSpec(makeCampaignSpec());
    const packages = ['github', 'weibo', 'bluesky', 'dev', 'mastodon'].map((channel) =>
      renderChannelPackage(spec, channel as never),
    );

    expect(packages.map((item) => item?.format)).toEqual([
      'release',
      'post',
      'post',
      'article',
      'status',
    ]);
    expect(packages[0]?.variants.map((variant) => variant.locale)).toEqual(['zh-CN', 'en']);
    expect(packages[1]?.variants.map((variant) => variant.locale)).toEqual(['zh-CN']);
    expect(packages[3]?.variants.map((variant) => variant.locale)).toEqual(['en']);

    const trackedLinks = packages.flatMap(
      (item) => item?.variants.flatMap((variant) => variant.links) ?? [],
    );
    expect(new Set(trackedLinks).size).toBe(trackedLinks.length);
    for (const item of packages) {
      for (const variant of item?.variants ?? []) {
        for (const link of variant.links) {
          expect(readCampaignParams(new URL(link))).toEqual({
            source: item?.channel,
            medium: item?.utmMedium,
            campaign: 'launch-2026q3',
            content: `${item?.channel}-${variant.locale === 'zh-CN' ? 'zh' : 'en'}-link-${variant.links.indexOf(link) + 1}`,
          });
        }
      }
    }
  });

  it('TC-AUTO-RENDER-127-02 拒绝不支持的 locale/media、超长内容与不安全事实', () => {
    const englishOnly = makeCampaignSpec();
    englishOnly.locales = ['en'];
    (englishOnly.content as { variants: Record<string, unknown> }).variants = {
      en: (englishOnly.content as { variants: Record<string, unknown> }).variants.en,
    };
    expect(expectRenderCodes(englishOnly, 'weibo')).toContain('UNSUPPORTED_LOCALE');

    const unsupportedMedia = makeCampaignSpec();
    (unsupportedMedia.content as { media: string[] }).media = ['video'];
    expect(expectRenderCodes(unsupportedMedia, 'dev')).toContain('UNSUPPORTED_MEDIA');

    const tooLong = makeCampaignSpec();
    (tooLong.content as { variants: Record<string, { angle: string }> }).variants.en.angle =
      'a'.repeat(400);
    expect(expectRenderCodes(tooLong, 'bluesky')).toContain('CONTENT_TOO_LONG');

    const staleFact = makeCampaignSpec();
    (staleFact.content as { variants: Record<string, { angle: string }> }).variants.en.angle =
      'The site still has 105 indexable pages.';
    expect(expectRenderCodes(staleFact, 'dev')).toContain('STALE_SITE_FACT');
  });

  it('TC-AUTO-RENDER-127-03 人工渠道生成 manual package，禁用渠道不生成内容', () => {
    const spec = normalizeCampaignSpec(makeCampaignSpec());
    for (const channel of ['v2ex', 'hacker-news', 'product-hunt']) {
      expect(renderChannelPackage(spec, channel as never)?.format).toBe('manual-package');
    }
    expect(renderChannelPackage(spec, 'weibo')?.format).toBe('post');
    for (const channel of ['juejin', 'bilibili', 'zhihu', 'xiaohongshu', 'wechat', 'x']) {
      expect(renderChannelPackage(spec, channel as never)).toBeNull();
    }
  });
});
