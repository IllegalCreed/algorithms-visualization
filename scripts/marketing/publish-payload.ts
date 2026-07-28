import { buildDryRunManifest } from './dry-run.ts';
import { MANUAL_BRIDGE_CHANNEL_IDS } from './channels.ts';
import { normalizeCampaignSpec } from './spec.ts';
import type { CampaignSpec, ChannelId } from './types.ts';
import { MarketingInputError } from './validation.ts';

export interface BuildPublishCampaignPayloadOptions {
  runtimeStates: unknown;
  authorizedAt: string;
}

export interface AssistedPublicationConfirmation {
  channel: ChannelId;
  publicUrl: string;
}

export interface BuildAssistedPublishCampaignPayloadOptions {
  authorizedAt: string;
  confirmations?: AssistedPublicationConfirmation[];
}

export const MARKETING_PROJECT_ID = 'algorithm-visualizer' as const;

function normalizeAuthorizationTime(value: string): string {
  if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(value) || Number.isNaN(Date.parse(value))) {
    throw new MarketingInputError('authorizedAt must be ISO 8601 with an explicit timezone');
  }
  return new Date(value).toISOString();
}

export function buildPublishCampaignPayload(
  value: unknown,
  options: BuildPublishCampaignPayloadOptions,
) {
  const normalized = normalizeCampaignSpec(value);
  const manifest = buildDryRunManifest(value, { runtimeStates: options.runtimeStates });
  const packages = manifest.channels.flatMap((item) =>
    item.selected && item.content ? [item.content] : [],
  );

  if (normalized.failureMode === 'all-or-none' && packages.length !== manifest.channels.length) {
    throw new MarketingInputError('all-or-none campaign has blocked or invalid channels');
  }
  if (packages.length === 0) {
    throw new MarketingInputError('No authorized channels are ready for publication');
  }

  const spec: CampaignSpec = {
    schemaVersion: 1,
    id: normalized.id,
    topic: normalized.topic,
    targetUrls: normalized.targetUrls,
    locales: normalized.locales,
    channels: normalized.channels,
    publishAt: normalized.schedule.original,
    campaign: normalized.campaign,
    content: normalized.content,
    replies: normalized.replies,
    failureMode: normalized.failureMode,
  };

  return {
    projectId: MARKETING_PROJECT_ID,
    campaignId: normalized.id,
    spec,
    packages,
    idempotencyKey: manifest.campaign.idempotencyKey,
    authorization: {
      source: 'owner-prompt' as const,
      authorizedAt: normalizeAuthorizationTime(options.authorizedAt),
    },
  };
}

export function buildAssistedPublishCampaignPayload(
  value: unknown,
  options: BuildAssistedPublishCampaignPayloadOptions,
) {
  const normalized = normalizeCampaignSpec(value);
  const manifest = buildDryRunManifest(value);
  const assistedChannels = new Set<ChannelId>(MANUAL_BRIDGE_CHANNEL_IDS);
  const packages = manifest.channels.flatMap((item) =>
    assistedChannels.has(item.channel) && item.content ? [item.content] : [],
  );

  if (packages.length === 0) {
    throw new MarketingInputError('No assisted channels have a renderable content package');
  }
  if (
    packages.some((packageValue) =>
      packageValue.variants.some((variant) => variant.media.length > 0),
    )
  ) {
    throw new MarketingInputError('Assisted handoff requires resolved media assets');
  }
  if (normalized.failureMode === 'all-or-none' && packages.length !== manifest.channels.length) {
    throw new MarketingInputError('all-or-none campaign has an unrenderable assisted channel');
  }

  const spec: CampaignSpec = {
    schemaVersion: 1,
    id: normalized.id,
    topic: normalized.topic,
    targetUrls: normalized.targetUrls,
    locales: normalized.locales,
    channels: normalized.channels,
    publishAt: normalized.schedule.original,
    campaign: normalized.campaign,
    content: normalized.content,
    replies: normalized.replies,
    failureMode: normalized.failureMode,
  };
  const execution = options.confirmations
    ? {
        mode: 'assisted-confirm' as const,
        confirmations: options.confirmations,
      }
    : { mode: 'assisted-prepare' as const };

  return {
    projectId: MARKETING_PROJECT_ID,
    campaignId: normalized.id,
    spec,
    packages,
    idempotencyKey: manifest.campaign.idempotencyKey,
    authorization: {
      source: 'owner-prompt' as const,
      authorizedAt: normalizeAuthorizationTime(options.authorizedAt),
    },
    execution,
  };
}
