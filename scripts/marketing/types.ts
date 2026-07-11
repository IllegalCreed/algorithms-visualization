export const CHANNEL_IDS = [
  'juejin',
  'v2ex',
  'bilibili',
  'zhihu',
  'xiaohongshu',
  'wechat',
  'hacker-news',
  'reddit',
  'product-hunt',
  'github',
  'weibo',
  'bluesky',
  'dev',
  'mastodon',
  'x',
] as const;

export const CAMPAIGN_LOCALES = ['zh-CN', 'en'] as const;
export const CAMPAIGN_MEDIA_TYPES = ['image', 'gif', 'video'] as const;

export type ChannelId = (typeof CHANNEL_IDS)[number];
export type CampaignLocale = (typeof CAMPAIGN_LOCALES)[number];
export type CampaignMediaType = (typeof CAMPAIGN_MEDIA_TYPES)[number];
export type RequestedChannels = ChannelId[] | 'all-authorized';

export interface CampaignContentVariant {
  title: string;
  angle: string;
  callToAction: string;
}

export interface CampaignSpec {
  schemaVersion: 1;
  id: string;
  topic: string;
  targetUrls: string[];
  locales: CampaignLocale[];
  channels: RequestedChannels;
  publishAt: string;
  campaign: string;
  content: {
    variants: Partial<Record<CampaignLocale, CampaignContentVariant>>;
    media: CampaignMediaType[];
  };
  replies: {
    mode: 'off' | 'faq-only';
    createBugIssues: boolean;
  };
  failureMode: 'continue-supported' | 'all-or-none';
}

export interface NormalizedCampaignSpec extends Omit<
  CampaignSpec,
  'publishAt' | 'content' | 'locales' | 'channels'
> {
  locales: CampaignLocale[];
  channels: RequestedChannels;
  schedule: {
    original: string;
    utc: string;
    offset: string;
  };
  content: {
    variants: Partial<Record<CampaignLocale, CampaignContentVariant>>;
    media: CampaignMediaType[];
  };
}
