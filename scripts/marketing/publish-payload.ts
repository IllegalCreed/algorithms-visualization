import { buildDryRunManifest } from './dry-run.ts';
import { normalizeCampaignSpec } from './spec.ts';
import type { CampaignSpec } from './types.ts';
import { MarketingInputError } from './validation.ts';

export interface BuildPublishCampaignPayloadOptions {
  runtimeStates: unknown;
  authorizedAt: string;
}

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
