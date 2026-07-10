export interface CampaignParams {
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

const MAX_CAMPAIGN_TOKEN_LENGTH = 64;
const CAMPAIGN_TOKEN_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;

const UTM_FIELDS = [
  ['source', 'utm_source'],
  ['medium', 'utm_medium'],
  ['campaign', 'utm_campaign'],
  ['content', 'utm_content'],
] as const;

export function normalizeCampaignToken(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  const normalized = value.trim().toLowerCase();
  if (
    !normalized ||
    normalized.length > MAX_CAMPAIGN_TOKEN_LENGTH ||
    !CAMPAIGN_TOKEN_PATTERN.test(normalized)
  ) {
    return undefined;
  }
  return normalized;
}

export function readCampaignParams(url: URL): Partial<CampaignParams> {
  const result: Partial<CampaignParams> = {};
  for (const [field, queryKey] of UTM_FIELDS) {
    const value = normalizeCampaignToken(url.searchParams.get(queryKey));
    if (value) result[field] = value;
  }
  return result;
}

export function buildCampaignUrl(target: string, params: CampaignParams): string {
  const url = new URL(target);
  if (url.protocol !== 'https:') throw new TypeError('Campaign target must use HTTPS');

  const normalized = {} as CampaignParams;
  for (const [field, queryKey] of UTM_FIELDS) {
    const value = normalizeCampaignToken(params[field]);
    if (!value) throw new TypeError(`Invalid campaign ${field}`);
    normalized[field] = value;
    url.searchParams.delete(queryKey);
  }

  for (const [field, queryKey] of UTM_FIELDS) {
    url.searchParams.append(queryKey, normalized[field]);
  }
  return url.toString();
}
