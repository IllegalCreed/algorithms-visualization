import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  AUTOMATIC_CHANNEL_IDS,
  CHANNEL_REGISTRY,
  parseChannelRuntimeStates,
  resolveAuthorizedChannels,
  type ChannelGateDecision,
} from './channels.ts';
import { CampaignRenderError, renderChannelPackage, type RenderIssue } from './renderer.ts';
import { SITE_FACTS } from './site-facts.ts';
import { createCampaignIdempotencyKey, normalizeCampaignSpec } from './spec.ts';
import type { ChannelId, NormalizedCampaignSpec } from './types.ts';
import { MarketingInputError } from './validation.ts';

export interface DryRunOptions {
  specPath?: string;
  runtimePath?: string;
  help: boolean;
}

export interface DryRunManifestOptions {
  runtimeStates?: unknown;
}

export function parseDryRunOptions(argv: string[]): DryRunOptions {
  const result: DryRunOptions = { help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--') continue;
    if (argument === '--help') {
      result.help = true;
      continue;
    }
    if (argument !== '--spec' && argument !== '--runtime') {
      throw new MarketingInputError(`Unknown option: ${argument}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new MarketingInputError(`Missing value for ${argument}`);
    }
    if (argument === '--spec') result.specPath = value;
    else result.runtimePath = value;
    index += 1;
  }

  if (!result.help && !result.specPath) {
    throw new MarketingInputError('Missing required option: --spec');
  }
  return result;
}

function renderForManifest(
  spec: NormalizedCampaignSpec,
  channel: ChannelId,
): {
  content: ReturnType<typeof renderChannelPackage>;
  renderIssues: RenderIssue[];
} {
  try {
    return { content: renderChannelPackage(spec, channel), renderIssues: [] };
  } catch (error) {
    if (error instanceof CampaignRenderError) {
      return { content: null, renderIssues: error.issues };
    }
    throw error;
  }
}

export function buildDryRunManifest(value: unknown, options: DryRunManifestOptions = {}) {
  const spec = normalizeCampaignSpec(value);
  const runtimeStates = parseChannelRuntimeStates(options.runtimeStates ?? {});
  const resolution = resolveAuthorizedChannels(spec.channels, runtimeStates);
  const considered: readonly ChannelId[] =
    spec.channels === 'all-authorized' ? AUTOMATIC_CHANNEL_IDS : spec.channels;

  const channels = considered.map((channel) => {
    const decision = resolution.decisions[channel] as ChannelGateDecision;
    const rendered = renderForManifest(spec, channel);
    const selected =
      decision.allowed && rendered.content !== null && rendered.renderIssues.length === 0;
    return {
      channel,
      selected,
      decision,
      content: rendered.content,
      renderIssues: rendered.renderIssues,
    };
  });

  return {
    schemaVersion: 1 as const,
    mode: 'dry-run' as const,
    campaign: {
      id: spec.id,
      topic: spec.topic,
      campaign: spec.campaign,
      targetUrls: spec.targetUrls,
      locales: spec.locales,
      schedule: spec.schedule,
      idempotencyKey: createCampaignIdempotencyKey(value),
    },
    siteFacts: SITE_FACTS,
    summary: {
      selectedChannels: channels.filter((item) => item.selected).map((item) => item.channel),
      blockedChannels: channels
        .filter((item) => !item.selected && CHANNEL_REGISTRY[item.channel].status !== 'manual')
        .map((item) => item.channel),
      manualChannels: channels
        .filter((item) => CHANNEL_REGISTRY[item.channel].status === 'manual')
        .map((item) => item.channel),
    },
    channels,
    sideEffects: [] as [],
  };
}

function usage(): string {
  return [
    'Usage:',
    '  pnpm marketing:dry-run -- --spec <campaign.json> [--runtime <status.json>]',
    '',
    'The optional runtime file contains booleans only; credentials are never accepted.',
  ].join('\n');
}

async function readJson(path: string): Promise<unknown> {
  const text = await readFile(path, 'utf8');
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new MarketingInputError(`${path} must contain valid JSON`);
  }
}

async function main(): Promise<void> {
  const options = parseDryRunOptions(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const spec = await readJson(resolve(options.specPath as string));
  const runtimeStates = options.runtimePath
    ? await readJson(resolve(options.runtimePath))
    : undefined;
  const manifest = buildDryRunManifest(spec, { runtimeStates });
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

const entryPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (entryPath === import.meta.url) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n\n${usage()}\n`);
    process.exitCode = 1;
  });
}
