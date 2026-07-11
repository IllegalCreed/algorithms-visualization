import { CHANNEL_IDS, type ChannelId, type RequestedChannels } from './types.ts';
import {
  assertExactKeys,
  assertNoUnsafeFields,
  MarketingInputError,
  requireBoolean,
  requirePlainRecord,
} from './validation.ts';

export { CHANNEL_IDS };
export type ChannelAction = 'publish' | 'metrics' | 'comments' | 'reply' | 'delete';
export type ChannelGateReason =
  | 'ACTION_UNSUPPORTED'
  | 'CHANNEL_DISABLED'
  | 'CONDITIONAL_APPROVAL_REQUIRED'
  | 'MANUAL_EXECUTION_REQUIRED'
  | 'PAID_CHANNEL'
  | 'PERSONAL_SUBJECT_UNAVAILABLE'
  | 'EXECUTION_NOT_APPROVED'
  | 'ADAPTER_UNAVAILABLE'
  | 'AUTH_REQUIRED'
  | 'QUOTA_UNAVAILABLE';

export interface ChannelCapabilities {
  id: ChannelId;
  label: string;
  tier: 'A' | 'B' | 'C' | 'D';
  execution: 'api' | 'rpa' | 'manual' | 'disabled';
  publish: boolean;
  metrics: boolean;
  comments: boolean;
  reply: boolean;
  delete: boolean;
  auth: 'github-token' | 'oauth' | 'app-password' | 'api-key' | 'manual';
  cost: 'free' | 'conditional' | 'paid';
  personalAvailable: boolean;
  enabled: boolean;
  status: 'enabled' | 'conditional' | 'manual' | 'disabled';
  evidence: readonly string[];
}

export interface ChannelRuntimeState {
  executionApproved: boolean;
  adapterReady: boolean;
  authorized: boolean;
  quotaAvailable: boolean;
}

export interface ChannelGateDecision {
  allowed: boolean;
  reasons: ChannelGateReason[];
}

const AUDIT_DOC = 'docs/marketing/channel-automation-audit.md';
const OFFICIAL = {
  juejin: ['https://juejin.cn/terms'],
  v2ex: ['https://www.v2ex.com/help/api'],
  bilibili: ['https://openhome.bilibili.com/doc'],
  zhihu: ['https://www.zhihu.com/term/zhihu-terms'],
  xiaohongshu: ['https://agora.xiaohongshu.com/doc'],
  wechat: ['https://developers.weixin.qq.com/doc/offiaccount/Publish/Publish.html'],
  'hacker-news': ['https://github.com/HackerNews/API'],
  reddit: ['https://developers.reddit.com/docs/capabilities/server/userActions'],
  'product-hunt': ['https://api.producthunt.com/v2/docs'],
  github: ['https://docs.github.com/en/rest/releases/releases'],
  weibo: ['https://open.weibo.com/cli'],
  bluesky: ['https://docs.bsky.app/docs/get-started'],
  dev: ['https://developers.forem.com/api/'],
  mastodon: ['https://docs.joinmastodon.org/methods/statuses/'],
  x: ['https://docs.x.com/x-api/getting-started/pricing'],
} satisfies Record<ChannelId, readonly string[]>;

function evidence(id: ChannelId): readonly string[] {
  return [`${AUDIT_DOC}#官方依据`, ...OFFICIAL[id]];
}

export const CHANNEL_REGISTRY = Object.freeze({
  juejin: {
    id: 'juejin',
    label: '掘金',
    tier: 'D',
    execution: 'disabled',
    publish: false,
    metrics: false,
    comments: false,
    reply: false,
    delete: false,
    auth: 'manual',
    cost: 'free',
    personalAvailable: true,
    enabled: false,
    status: 'disabled',
    evidence: evidence('juejin'),
  },
  v2ex: {
    id: 'v2ex',
    label: 'V2EX',
    tier: 'C',
    execution: 'manual',
    publish: false,
    metrics: true,
    comments: true,
    reply: false,
    delete: false,
    auth: 'manual',
    cost: 'free',
    personalAvailable: true,
    enabled: false,
    status: 'manual',
    evidence: evidence('v2ex'),
  },
  bilibili: {
    id: 'bilibili',
    label: 'B站',
    tier: 'B',
    execution: 'disabled',
    publish: true,
    metrics: true,
    comments: false,
    reply: false,
    delete: false,
    auth: 'oauth',
    cost: 'conditional',
    personalAvailable: false,
    enabled: false,
    status: 'disabled',
    evidence: evidence('bilibili'),
  },
  zhihu: {
    id: 'zhihu',
    label: '知乎',
    tier: 'D',
    execution: 'disabled',
    publish: false,
    metrics: false,
    comments: false,
    reply: false,
    delete: false,
    auth: 'manual',
    cost: 'free',
    personalAvailable: true,
    enabled: false,
    status: 'disabled',
    evidence: evidence('zhihu'),
  },
  xiaohongshu: {
    id: 'xiaohongshu',
    label: '小红书',
    tier: 'D',
    execution: 'disabled',
    publish: false,
    metrics: false,
    comments: false,
    reply: false,
    delete: false,
    auth: 'manual',
    cost: 'free',
    personalAvailable: true,
    enabled: false,
    status: 'disabled',
    evidence: evidence('xiaohongshu'),
  },
  wechat: {
    id: 'wechat',
    label: '微信公众号',
    tier: 'B',
    execution: 'disabled',
    publish: true,
    metrics: true,
    comments: true,
    reply: true,
    delete: true,
    auth: 'api-key',
    cost: 'conditional',
    personalAvailable: false,
    enabled: false,
    status: 'disabled',
    evidence: evidence('wechat'),
  },
  'hacker-news': {
    id: 'hacker-news',
    label: 'Hacker News',
    tier: 'C',
    execution: 'manual',
    publish: false,
    metrics: true,
    comments: true,
    reply: false,
    delete: false,
    auth: 'manual',
    cost: 'free',
    personalAvailable: true,
    enabled: false,
    status: 'manual',
    evidence: evidence('hacker-news'),
  },
  reddit: {
    id: 'reddit',
    label: 'Reddit',
    tier: 'B',
    execution: 'api',
    publish: true,
    metrics: true,
    comments: true,
    reply: true,
    delete: true,
    auth: 'oauth',
    cost: 'conditional',
    personalAvailable: true,
    enabled: false,
    status: 'conditional',
    evidence: evidence('reddit'),
  },
  'product-hunt': {
    id: 'product-hunt',
    label: 'Product Hunt',
    tier: 'C',
    execution: 'manual',
    publish: false,
    metrics: true,
    comments: true,
    reply: false,
    delete: false,
    auth: 'manual',
    cost: 'free',
    personalAvailable: true,
    enabled: false,
    status: 'manual',
    evidence: evidence('product-hunt'),
  },
  github: {
    id: 'github',
    label: 'GitHub',
    tier: 'A',
    execution: 'api',
    publish: true,
    metrics: true,
    comments: true,
    reply: true,
    delete: true,
    auth: 'github-token',
    cost: 'free',
    personalAvailable: true,
    enabled: true,
    status: 'enabled',
    evidence: evidence('github'),
  },
  weibo: {
    id: 'weibo',
    label: '微博',
    tier: 'A',
    execution: 'api',
    publish: true,
    metrics: true,
    comments: true,
    reply: true,
    delete: false,
    auth: 'oauth',
    cost: 'free',
    personalAvailable: true,
    enabled: true,
    status: 'enabled',
    evidence: evidence('weibo'),
  },
  bluesky: {
    id: 'bluesky',
    label: 'Bluesky',
    tier: 'A',
    execution: 'api',
    publish: true,
    metrics: true,
    comments: true,
    reply: true,
    delete: true,
    auth: 'app-password',
    cost: 'free',
    personalAvailable: true,
    enabled: true,
    status: 'enabled',
    evidence: evidence('bluesky'),
  },
  dev: {
    id: 'dev',
    label: 'DEV Community',
    tier: 'A',
    execution: 'api',
    publish: true,
    metrics: true,
    comments: true,
    reply: false,
    delete: false,
    auth: 'api-key',
    cost: 'free',
    personalAvailable: true,
    enabled: true,
    status: 'enabled',
    evidence: evidence('dev'),
  },
  mastodon: {
    id: 'mastodon',
    label: 'Mastodon',
    tier: 'A',
    execution: 'api',
    publish: true,
    metrics: true,
    comments: true,
    reply: true,
    delete: true,
    auth: 'oauth',
    cost: 'free',
    personalAvailable: true,
    enabled: true,
    status: 'enabled',
    evidence: evidence('mastodon'),
  },
  x: {
    id: 'x',
    label: 'X',
    tier: 'A',
    execution: 'disabled',
    publish: true,
    metrics: true,
    comments: true,
    reply: true,
    delete: true,
    auth: 'oauth',
    cost: 'paid',
    personalAvailable: true,
    enabled: false,
    status: 'disabled',
    evidence: evidence('x'),
  },
} satisfies Record<ChannelId, ChannelCapabilities>);

export const AUTOMATIC_CHANNEL_IDS = Object.freeze([
  'github',
  'weibo',
  'bluesky',
  'dev',
  'mastodon',
] as const satisfies readonly ChannelId[]);

export const MANUAL_BRIDGE_CHANNEL_IDS = Object.freeze([
  'v2ex',
  'hacker-news',
  'product-hunt',
] as const satisfies readonly ChannelId[]);

export const DISABLED_CHANNEL_IDS = Object.freeze([
  'juejin',
  'bilibili',
  'zhihu',
  'xiaohongshu',
  'wechat',
  'x',
] as const satisfies readonly ChannelId[]);

const RUNTIME_FIELDS = [
  'executionApproved',
  'adapterReady',
  'authorized',
  'quotaAvailable',
] as const;

function parseRuntimeState(value: unknown, path: string): ChannelRuntimeState {
  const state = requirePlainRecord(value, path);
  assertExactKeys(state, RUNTIME_FIELDS, path);
  return {
    executionApproved: requireBoolean(state.executionApproved, `${path}.executionApproved`),
    adapterReady: requireBoolean(state.adapterReady, `${path}.adapterReady`),
    authorized: requireBoolean(state.authorized, `${path}.authorized`),
    quotaAvailable: requireBoolean(state.quotaAvailable, `${path}.quotaAvailable`),
  };
}

export function parseChannelRuntimeStates(
  value: unknown = {},
): Partial<Record<ChannelId, ChannelRuntimeState>> {
  assertNoUnsafeFields(value, 'runtimeStates');
  const input = requirePlainRecord(value, 'runtimeStates');
  const result: Partial<Record<ChannelId, ChannelRuntimeState>> = {};
  for (const [id, state] of Object.entries(input)) {
    if (!CHANNEL_IDS.includes(id as ChannelId)) {
      throw new MarketingInputError(`Unknown channel "${id}" at runtimeStates`);
    }
    result[id as ChannelId] = parseRuntimeState(state, `runtimeStates.${id}`);
  }
  return result;
}

function capabilitySupported(channel: ChannelCapabilities, action: ChannelAction): boolean {
  return channel[action];
}

export function evaluateChannelAction(
  id: ChannelId,
  action: ChannelAction,
  runtimeState: ChannelRuntimeState,
): ChannelGateDecision {
  const channel = CHANNEL_REGISTRY[id];
  const reasons: ChannelGateReason[] = [];

  if (!capabilitySupported(channel, action)) reasons.push('ACTION_UNSUPPORTED');
  if (channel.status === 'manual') reasons.push('MANUAL_EXECUTION_REQUIRED');
  if (channel.status === 'conditional') reasons.push('CONDITIONAL_APPROVAL_REQUIRED');
  if (channel.status === 'disabled') reasons.push('CHANNEL_DISABLED');
  if (channel.cost === 'paid') reasons.push('PAID_CHANNEL');
  if (!channel.personalAvailable) reasons.push('PERSONAL_SUBJECT_UNAVAILABLE');

  if (reasons.length === 0) {
    if (!runtimeState.executionApproved) reasons.push('EXECUTION_NOT_APPROVED');
    if (!runtimeState.adapterReady) reasons.push('ADAPTER_UNAVAILABLE');
    if (!runtimeState.authorized) reasons.push('AUTH_REQUIRED');
    if (!runtimeState.quotaAvailable) reasons.push('QUOTA_UNAVAILABLE');
  }

  return { allowed: reasons.length === 0, reasons };
}

const CLOSED_RUNTIME_STATE: ChannelRuntimeState = Object.freeze({
  executionApproved: false,
  adapterReady: false,
  authorized: false,
  quotaAvailable: false,
});

export function resolveAuthorizedChannels(
  requested: RequestedChannels,
  runtimeStatesInput: unknown = {},
  action: ChannelAction = 'publish',
): {
  selected: ChannelId[];
  decisions: Partial<Record<ChannelId, ChannelGateDecision>>;
} {
  const runtimeStates = parseChannelRuntimeStates(runtimeStatesInput);
  const considered: readonly ChannelId[] =
    requested === 'all-authorized' ? AUTOMATIC_CHANNEL_IDS : requested;
  const selected: ChannelId[] = [];
  const decisions: Partial<Record<ChannelId, ChannelGateDecision>> = {};

  for (const id of considered) {
    const decision = evaluateChannelAction(id, action, runtimeStates[id] ?? CLOSED_RUNTIME_STATE);
    decisions[id] = decision;
    if (decision.allowed) selected.push(id);
  }

  return { selected, decisions };
}
