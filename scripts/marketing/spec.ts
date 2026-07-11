import { createHash } from 'node:crypto';
import { normalizeCampaignToken } from '../../src/analytics/utm.ts';
import { CHANNEL_IDS } from './channels.ts';
import { SITE_FACTS } from './site-facts.ts';
import {
  CAMPAIGN_LOCALES,
  CAMPAIGN_MEDIA_TYPES,
  type CampaignContentVariant,
  type CampaignLocale,
  type CampaignMediaType,
  type ChannelId,
  type NormalizedCampaignSpec,
  type RequestedChannels,
} from './types.ts';
import {
  assertExactKeys,
  assertNoUnsafeFields,
  MarketingInputError,
  requireBoolean,
  requirePlainRecord,
  requireString,
} from './validation.ts';

const ROOT_FIELDS = [
  'schemaVersion',
  'id',
  'topic',
  'targetUrls',
  'locales',
  'channels',
  'publishAt',
  'campaign',
  'content',
  'replies',
  'failureMode',
] as const;
const CONTENT_FIELDS = ['variants', 'media'] as const;
const VARIANT_FIELDS = ['title', 'angle', 'callToAction'] as const;
const REPLIES_FIELDS = ['mode', 'createBugIssues'] as const;
const PUBLISH_AT_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})$/;

export const CAMPAIGN_SPEC_JSON_SCHEMA = Object.freeze({
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'urn:algorithms-visualization:marketing:campaign-spec:v1',
  title: 'CampaignSpec v1',
  type: 'object',
  additionalProperties: false,
  required: [...ROOT_FIELDS],
  properties: {
    schemaVersion: { const: 1 },
    id: { type: 'string', pattern: '^[a-z0-9][a-z0-9._-]{0,63}$' },
    topic: { type: 'string', minLength: 1, maxLength: 200 },
    targetUrls: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      uniqueItems: true,
      items: { type: 'string', format: 'uri', pattern: '^https://' },
    },
    locales: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: { enum: [...CAMPAIGN_LOCALES] },
    },
    channels: {
      oneOf: [
        { const: 'all-authorized' },
        {
          type: 'array',
          minItems: 1,
          uniqueItems: true,
          items: { enum: [...CHANNEL_IDS] },
        },
      ],
    },
    publishAt: { type: 'string', pattern: PUBLISH_AT_PATTERN.source },
    campaign: { type: 'string', pattern: '^[a-z0-9][a-z0-9._-]{0,63}$' },
    content: {
      type: 'object',
      additionalProperties: false,
      required: [...CONTENT_FIELDS],
      properties: {
        variants: {
          type: 'object',
          additionalProperties: false,
          minProperties: 1,
          properties: Object.fromEntries(
            CAMPAIGN_LOCALES.map((locale) => [
              locale,
              {
                type: 'object',
                additionalProperties: false,
                required: [...VARIANT_FIELDS],
                properties: {
                  title: { type: 'string', minLength: 1, maxLength: 200 },
                  angle: { type: 'string', minLength: 1, maxLength: 2_000 },
                  callToAction: { type: 'string', minLength: 1, maxLength: 200 },
                },
              },
            ]),
          ),
        },
        media: {
          type: 'array',
          uniqueItems: true,
          items: { enum: [...CAMPAIGN_MEDIA_TYPES] },
        },
      },
    },
    replies: {
      type: 'object',
      additionalProperties: false,
      required: [...REPLIES_FIELDS],
      properties: {
        mode: { enum: ['off', 'faq-only'] },
        createBugIssues: { type: 'boolean' },
      },
    },
    failureMode: { enum: ['continue-supported', 'all-or-none'] },
  },
});

function normalizeToken(value: unknown, path: string): string {
  if (typeof value !== 'string') throw new MarketingInputError(`${path} must be a string`);
  const normalized = normalizeCampaignToken(value);
  if (!normalized) throw new MarketingInputError(`${path} is not a valid campaign token`);
  return normalized;
}

function normalizeTargetUrls(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 10) {
    throw new MarketingInputError('targetUrls must contain 1 to 10 URLs');
  }
  const urls: string[] = [];
  for (const [index, rawUrl] of value.entries()) {
    if (typeof rawUrl !== 'string') {
      throw new MarketingInputError(`targetUrls[${index}] must be a string`);
    }
    let url: URL;
    try {
      url = new URL(rawUrl.trim());
    } catch {
      throw new MarketingInputError(`targetUrls[${index}] must be a valid URL`);
    }
    if (url.protocol !== 'https:') {
      throw new MarketingInputError(`targetUrls[${index}] must use HTTPS`);
    }
    if (url.origin !== SITE_FACTS.origin) {
      throw new MarketingInputError(`targetUrls[${index}] origin must be ${SITE_FACTS.origin}`);
    }
    if (url.username || url.password) {
      throw new MarketingInputError(`targetUrls[${index}] must not contain credentials`);
    }
    if (!urls.includes(url.toString())) urls.push(url.toString());
  }
  return urls;
}

function normalizeLocales(value: unknown): CampaignLocale[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new MarketingInputError('locales must be a non-empty array');
  }
  const seen = new Set<CampaignLocale>();
  for (const locale of value) {
    if (!CAMPAIGN_LOCALES.includes(locale as CampaignLocale)) {
      throw new MarketingInputError(`locales contains unsupported locale "${String(locale)}"`);
    }
    seen.add(locale as CampaignLocale);
  }
  return CAMPAIGN_LOCALES.filter((locale) => seen.has(locale));
}

function normalizeChannels(value: unknown): RequestedChannels {
  if (value === 'all-authorized') return value;
  if (!Array.isArray(value) || value.length === 0) {
    throw new MarketingInputError('channels must be all-authorized or a non-empty array');
  }
  const seen = new Set<ChannelId>();
  for (const rawChannel of value) {
    if (typeof rawChannel !== 'string') {
      throw new MarketingInputError('channels must contain strings');
    }
    const channel = rawChannel.trim().toLowerCase() as ChannelId;
    if (!CHANNEL_IDS.includes(channel)) {
      throw new MarketingInputError(`channels contains unknown channel "${rawChannel}"`);
    }
    seen.add(channel);
  }
  return CHANNEL_IDS.filter((channel) => seen.has(channel));
}

function normalizeSchedule(value: unknown): NormalizedCampaignSpec['schedule'] {
  if (typeof value !== 'string') throw new MarketingInputError('publishAt must be a string');
  const original = value.trim();
  const match = PUBLISH_AT_PATTERN.exec(original);
  if (!match) throw new MarketingInputError('publishAt must be ISO 8601 with an explicit timezone');

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, , offset] = match;
  const [year, month, day, hour, minute, second] = [
    yearText,
    monthText,
    dayText,
    hourText,
    minuteText,
    secondText ?? '0',
  ].map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    throw new MarketingInputError('publishAt is not a valid calendar date');
  }

  if (offset !== 'Z') {
    const [hours, minutes] = offset.slice(1).split(':').map(Number);
    if (hours > 14 || minutes > 59 || (hours === 14 && minutes !== 0)) {
      throw new MarketingInputError('publishAt has an invalid timezone offset');
    }
  }

  const date = new Date(original);
  if (Number.isNaN(date.getTime())) throw new MarketingInputError('publishAt is not a valid date');
  return { original, utc: date.toISOString(), offset };
}

function normalizeVariant(value: unknown, path: string): CampaignContentVariant {
  const variant = requirePlainRecord(value, path);
  assertExactKeys(variant, VARIANT_FIELDS, path);
  return {
    title: requireString(variant.title, `${path}.title`, { maxLength: 200 }),
    angle: requireString(variant.angle, `${path}.angle`, {
      maxLength: 2_000,
      allowNewlines: true,
    }),
    callToAction: requireString(variant.callToAction, `${path}.callToAction`, {
      maxLength: 200,
    }),
  };
}

function normalizeContent(
  value: unknown,
  locales: readonly CampaignLocale[],
): NormalizedCampaignSpec['content'] {
  const content = requirePlainRecord(value, 'content');
  assertExactKeys(content, CONTENT_FIELDS, 'content');
  const variantsInput = requirePlainRecord(content.variants, 'content.variants');
  assertExactKeys(variantsInput, CAMPAIGN_LOCALES, 'content.variants');

  const variants: Partial<Record<CampaignLocale, CampaignContentVariant>> = {};
  for (const locale of CAMPAIGN_LOCALES) {
    const provided = Object.hasOwn(variantsInput, locale);
    const requested = locales.includes(locale);
    if (requested && !provided) {
      throw new MarketingInputError(`content.variants.${locale} is required by locales`);
    }
    if (!requested && provided) {
      throw new MarketingInputError(`content.variants.${locale} is not listed in locales`);
    }
    if (provided)
      variants[locale] = normalizeVariant(variantsInput[locale], `content.variants.${locale}`);
  }

  if (!Array.isArray(content.media)) {
    throw new MarketingInputError('content.media must be an array');
  }
  const mediaSeen = new Set<CampaignMediaType>();
  for (const media of content.media) {
    if (!CAMPAIGN_MEDIA_TYPES.includes(media as CampaignMediaType)) {
      throw new MarketingInputError(`content.media contains unsupported type "${String(media)}"`);
    }
    mediaSeen.add(media as CampaignMediaType);
  }

  return {
    variants,
    media: CAMPAIGN_MEDIA_TYPES.filter((media) => mediaSeen.has(media)),
  };
}

export function normalizeCampaignSpec(value: unknown): NormalizedCampaignSpec {
  assertNoUnsafeFields(value, 'CampaignSpec');
  const input = requirePlainRecord(value, 'CampaignSpec');
  assertExactKeys(input, ROOT_FIELDS, 'CampaignSpec');
  if (input.schemaVersion !== 1) {
    throw new MarketingInputError('schemaVersion must be 1');
  }

  const locales = normalizeLocales(input.locales);
  const replies = requirePlainRecord(input.replies, 'replies');
  assertExactKeys(replies, REPLIES_FIELDS, 'replies');
  if (replies.mode !== 'off' && replies.mode !== 'faq-only') {
    throw new MarketingInputError('replies.mode must be off or faq-only');
  }
  if (input.failureMode !== 'continue-supported' && input.failureMode !== 'all-or-none') {
    throw new MarketingInputError('failureMode must be continue-supported or all-or-none');
  }

  return {
    schemaVersion: 1,
    id: normalizeToken(input.id, 'id'),
    topic: requireString(input.topic, 'topic', { maxLength: 200 }),
    targetUrls: normalizeTargetUrls(input.targetUrls),
    locales,
    channels: normalizeChannels(input.channels),
    schedule: normalizeSchedule(input.publishAt),
    campaign: normalizeToken(input.campaign, 'campaign'),
    content: normalizeContent(input.content, locales),
    replies: {
      mode: replies.mode,
      createBugIssues: requireBoolean(replies.createBugIssues, 'replies.createBugIssues'),
    },
    failureMode: input.failureMode,
  };
}

export function createCampaignIdempotencyKey(value: unknown): string {
  const normalized = normalizeCampaignSpec(value);
  const digest = createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
  return `campaign-v1/${normalized.id}/${digest}`;
}
