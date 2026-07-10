import type { AttributionState, AttributionTouch } from './types';
import { normalizeCampaignToken, readCampaignParams } from './utm';

export const ATTRIBUTION_STORAGE_KEY = 'algo.analytics.attribution.v1';
const FIRST_PARTY_HOSTNAMES = new Set(['algo.illegalscreed.cn', 'illegalcreed.github.io']);

type AttributionStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isTouch(value: unknown): value is AttributionTouch {
  if (!value || typeof value !== 'object') return false;
  const touch = value as Record<string, unknown>;
  if (
    typeof touch.source !== 'string' ||
    normalizeCampaignToken(touch.source) !== touch.source ||
    typeof touch.medium !== 'string' ||
    normalizeCampaignToken(touch.medium) !== touch.medium
  ) {
    return false;
  }
  for (const field of ['campaign', 'content'] as const) {
    const item = touch[field];
    if (item !== undefined && (typeof item !== 'string' || normalizeCampaignToken(item) !== item)) {
      return false;
    }
  }
  return true;
}

function isAttributionState(value: unknown): value is AttributionState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Record<string, unknown>;
  return state.version === 1 && isTouch(state.first) && isTouch(state.current);
}

function campaignTouch(url: URL): AttributionTouch | undefined {
  const campaign = readCampaignParams(url);
  if (!campaign.source || !campaign.medium) return undefined;
  return {
    source: campaign.source,
    medium: campaign.medium,
    ...(campaign.campaign ? { campaign: campaign.campaign } : {}),
    ...(campaign.content ? { content: campaign.content } : {}),
  };
}

function referrerTouch(referrer: string, siteHostname: string): AttributionTouch | undefined {
  if (!referrer) return undefined;
  try {
    const url = new URL(referrer);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    const hostname = normalizeCampaignToken(url.hostname);
    if (
      !hostname ||
      hostname === siteHostname.toLowerCase() ||
      FIRST_PARTY_HOSTNAMES.has(hostname)
    ) {
      return undefined;
    }
    return { source: hostname, medium: 'referral' };
  } catch {
    return undefined;
  }
}

export function createAttributionTracker(storage?: AttributionStorage) {
  let memory: AttributionState | undefined;
  let referrerAvailable = true;

  function readStored(): AttributionState | undefined {
    if (!storage) return memory;
    try {
      const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
      if (!raw) return memory;
      const parsed: unknown = JSON.parse(raw);
      if (isAttributionState(parsed)) {
        memory = parsed;
        return parsed;
      }
      storage.removeItem(ATTRIBUTION_STORAGE_KEY);
    } catch {
      // Browser privacy settings may disable storage; the in-memory session still works.
    }
    return memory;
  }

  function writeStored(state: AttributionState): void {
    memory = state;
    if (!storage) return;
    try {
      storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Analytics must never make the product path fail.
    }
  }

  function capture(url: URL, referrer: string, siteHostname: string): AttributionState {
    const existing = readStored();
    const referral = referrerAvailable ? referrerTouch(referrer, siteHostname) : undefined;
    referrerAvailable = false;
    const incoming = campaignTouch(url) ?? referral;
    if (existing && !incoming) return existing;

    const touch = incoming ?? { source: 'direct', medium: 'none' };
    const next: AttributionState = {
      version: 1,
      first: existing?.first ?? touch,
      current: touch,
    };
    writeStored(next);
    return next;
  }

  return { capture };
}
