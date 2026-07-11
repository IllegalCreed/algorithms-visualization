import { buildCampaignUrl } from '../../src/analytics/utm.ts';
import { CHANNEL_REGISTRY } from './channels.ts';
import { validateMarketingFactClaims, type MarketingFactIssueCode } from './site-facts.ts';
import {
  type CampaignContentVariant,
  type CampaignLocale,
  type CampaignMediaType,
  type ChannelId,
  type NormalizedCampaignSpec,
} from './types.ts';

export type RenderFormat = 'release' | 'post' | 'article' | 'status' | 'manual-package';
export type RenderIssueCode =
  | 'UNSUPPORTED_LOCALE'
  | 'UNSUPPORTED_MEDIA'
  | 'CONTENT_TOO_LONG'
  | MarketingFactIssueCode;

export interface RenderIssue {
  code: RenderIssueCode;
  path: string;
  message: string;
}

export interface RenderedChannelVariant {
  locale: CampaignLocale;
  title: string;
  body: string;
  links: string[];
  media: CampaignMediaType[];
}

export interface RenderedChannelPackage {
  channel: ChannelId;
  format: RenderFormat;
  utmMedium: string;
  canonicalUrl?: string;
  variants: RenderedChannelVariant[];
}

interface RenderProfile {
  format: RenderFormat;
  utmMedium: 'community' | 'social';
  locales: readonly CampaignLocale[];
  media: readonly CampaignMediaType[];
  maxTitleLength: number;
  maxBodyLength: number;
  bodyStyle: 'markdown' | 'social';
}

export class CampaignRenderError extends TypeError {
  readonly issues: RenderIssue[];

  constructor(channel: ChannelId, issues: RenderIssue[]) {
    super(`Cannot render ${channel}: ${issues.map((issue) => issue.code).join(', ')}`);
    this.name = 'CampaignRenderError';
    this.issues = issues;
  }
}

const ALL_MEDIA = ['image', 'gif', 'video'] as const satisfies readonly CampaignMediaType[];
const RENDER_PROFILES: Partial<Record<ChannelId, RenderProfile>> = {
  v2ex: {
    format: 'manual-package',
    utmMedium: 'community',
    locales: ['zh-CN'],
    media: ALL_MEDIA,
    maxTitleLength: 120,
    maxBodyLength: 20_000,
    bodyStyle: 'markdown',
  },
  'hacker-news': {
    format: 'manual-package',
    utmMedium: 'community',
    locales: ['en'],
    media: ALL_MEDIA,
    maxTitleLength: 80,
    maxBodyLength: 5_000,
    bodyStyle: 'markdown',
  },
  reddit: {
    format: 'post',
    utmMedium: 'community',
    locales: ['zh-CN', 'en'],
    media: ALL_MEDIA,
    maxTitleLength: 300,
    maxBodyLength: 40_000,
    bodyStyle: 'markdown',
  },
  'product-hunt': {
    format: 'manual-package',
    utmMedium: 'community',
    locales: ['en'],
    media: ALL_MEDIA,
    maxTitleLength: 60,
    maxBodyLength: 260,
    bodyStyle: 'markdown',
  },
  github: {
    format: 'release',
    utmMedium: 'community',
    locales: ['zh-CN', 'en'],
    media: ALL_MEDIA,
    maxTitleLength: 256,
    maxBodyLength: 100_000,
    bodyStyle: 'markdown',
  },
  weibo: {
    format: 'post',
    utmMedium: 'social',
    locales: ['zh-CN'],
    media: ALL_MEDIA,
    maxTitleLength: 100,
    maxBodyLength: 2_000,
    bodyStyle: 'social',
  },
  bluesky: {
    format: 'post',
    utmMedium: 'social',
    locales: ['zh-CN', 'en'],
    media: ['image'],
    maxTitleLength: 200,
    maxBodyLength: 300,
    bodyStyle: 'social',
  },
  dev: {
    format: 'article',
    utmMedium: 'community',
    locales: ['en'],
    media: ['image', 'gif'],
    maxTitleLength: 128,
    maxBodyLength: 100_000,
    bodyStyle: 'markdown',
  },
  mastodon: {
    format: 'status',
    utmMedium: 'social',
    locales: ['zh-CN', 'en'],
    media: ALL_MEDIA,
    maxTitleLength: 200,
    maxBodyLength: 500,
    bodyStyle: 'social',
  },
};

function graphemeLength(value: string, locale: CampaignLocale): number {
  return [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(value)].length;
}

function markdownLabel(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/([\[\]])/g, '\\$1');
}

function renderBody(
  profile: RenderProfile,
  variant: CampaignContentVariant,
  primaryLink: string,
): string {
  if (profile.bodyStyle === 'social') {
    return `${variant.title}\n\n${variant.angle}\n\n${variant.callToAction}: ${primaryLink}`;
  }
  return `${variant.angle}\n\n[${markdownLabel(variant.callToAction)}](${primaryLink})`;
}

function factIssues(locale: CampaignLocale, variant: CampaignContentVariant): RenderIssue[] {
  const text = `${variant.title}\n${variant.angle}\n${variant.callToAction}`;
  return validateMarketingFactClaims(text).map((code) => ({
    code,
    path: `content.variants.${locale}`,
    message:
      code === 'EPHEMERAL_TEST_FACT'
        ? 'Marketing content must not quote volatile test counts'
        : 'Marketing content contains a stale site-size claim',
  }));
}

export function renderChannelPackage(
  spec: NormalizedCampaignSpec,
  channel: ChannelId,
): RenderedChannelPackage | null {
  const capability = CHANNEL_REGISTRY[channel];
  if (capability.status === 'disabled') return null;

  const profile = RENDER_PROFILES[channel];
  if (!profile) return null;
  const issues: RenderIssue[] = [];
  const locales = spec.locales.filter((locale) => profile.locales.includes(locale));
  if (locales.length === 0) {
    issues.push({
      code: 'UNSUPPORTED_LOCALE',
      path: 'locales',
      message: `${channel} does not support any requested locale`,
    });
  }

  for (const media of spec.content.media) {
    if (!profile.media.includes(media)) {
      issues.push({
        code: 'UNSUPPORTED_MEDIA',
        path: 'content.media',
        message: `${channel} does not support ${media} in this renderer`,
      });
    }
  }

  const variants: RenderedChannelVariant[] = [];
  for (const locale of locales) {
    const content = spec.content.variants[locale];
    if (!content) continue;
    issues.push(...factIssues(locale, content));
    const localeToken = locale === 'zh-CN' ? 'zh' : 'en';
    const links = spec.targetUrls.map((target, index) =>
      buildCampaignUrl(target, {
        source: channel,
        medium: profile.utmMedium,
        campaign: spec.campaign,
        content: `${channel}-${localeToken}-link-${index + 1}`,
      }),
    );
    const body = renderBody(profile, content, links[0]);

    if (graphemeLength(content.title, locale) > profile.maxTitleLength) {
      issues.push({
        code: 'CONTENT_TOO_LONG',
        path: `content.variants.${locale}.title`,
        message: `${channel} title exceeds ${profile.maxTitleLength} graphemes`,
      });
    }
    if (graphemeLength(body, locale) > profile.maxBodyLength) {
      issues.push({
        code: 'CONTENT_TOO_LONG',
        path: `content.variants.${locale}.body`,
        message: `${channel} body exceeds ${profile.maxBodyLength} graphemes`,
      });
    }

    variants.push({
      locale,
      title: content.title,
      body,
      links,
      media: [...spec.content.media],
    });
  }

  if (issues.length > 0) throw new CampaignRenderError(channel, issues);
  return {
    channel,
    format: profile.format,
    utmMedium: profile.utmMedium,
    ...(profile.format === 'article' ? { canonicalUrl: spec.targetUrls[0] } : {}),
    variants,
  };
}
