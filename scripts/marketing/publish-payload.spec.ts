import { describe, expect, it } from 'vitest';
import campaign from './example-campaign.json';
import devSmokeCampaign from './campaigns/c127-dev-smoke.json';
import devSmokePreflight from './campaigns/c127-dev-smoke.preflight.json';
import { buildDryRunManifest } from './dry-run';
import { buildPublishCampaignPayload } from './publish-payload';

const READY_GITHUB = {
  github: {
    executionApproved: true,
    adapterReady: true,
    authorized: true,
    quotaAvailable: true,
  },
};

describe('publish campaign MCP v2 payload bridge', () => {
  it('TC-AUTO-MCP-127-07 直接复用 renderer package 与 campaign 幂等键', () => {
    const payload = buildPublishCampaignPayload(
      { ...campaign, channels: ['github'], content: { ...campaign.content, media: [] } },
      {
        runtimeStates: READY_GITHUB,
        authorizedAt: '2026-07-11T10:00:00+09:00',
      },
    );

    expect(payload).toMatchObject({
      campaignId: 'quick-sort-launch',
      authorization: { source: 'owner-prompt', authorizedAt: '2026-07-11T01:00:00.000Z' },
      spec: { publishAt: '2026-07-12T20:00:00+09:00', channels: ['github'] },
      packages: [{ channel: 'github', format: 'release', utmMedium: 'community' }],
    });
    expect(payload.idempotencyKey).toMatch(/^campaign-v1\/quick-sort-launch\/[a-f0-9]{64}$/);
    expect(payload.packages[0]?.variants[0]?.links[0]).toContain('utm_source=github');
  });

  it('TC-AUTO-DISPATCH-127-02 all-or-none 有任一阻塞时不生成可写 payload', () => {
    expect(() =>
      buildPublishCampaignPayload(
        {
          ...campaign,
          channels: ['github', 'dev'],
          failureMode: 'all-or-none',
          content: { ...campaign.content, media: [] },
        },
        { runtimeStates: READY_GITHUB, authorizedAt: '2026-07-11T01:00:00.000Z' },
      ),
    ).toThrow(/all-or-none/i);
  });

  it('TC-AUTO-UX-127-01 无可执行渠道或非法授权时间时失败关闭', () => {
    expect(() =>
      buildPublishCampaignPayload(
        { ...campaign, channels: ['github'], content: { ...campaign.content, media: [] } },
        { runtimeStates: {}, authorizedAt: '2026-07-11T01:00:00.000Z' },
      ),
    ).toThrow(/no authorized/i);
    expect(() =>
      buildPublishCampaignPayload(
        { ...campaign, channels: ['github'], content: { ...campaign.content, media: [] } },
        { runtimeStates: READY_GITHUB, authorizedAt: 'not-a-date' },
      ),
    ).toThrow(/authorizedAt/i);
  });

  it('TC-AUTO-DEVSMOKE-127-01 固定 DEV 候选在写授权前保持零副作用', () => {
    const manifest = buildDryRunManifest(devSmokeCampaign, {
      runtimeStates: devSmokePreflight,
    });

    expect(manifest).toMatchObject({
      mode: 'dry-run',
      summary: { selectedChannels: [], blockedChannels: ['dev'] },
      sideEffects: [],
      channels: [
        {
          channel: 'dev',
          selected: false,
          decision: {
            reasons: ['EXECUTION_NOT_APPROVED'],
          },
          renderIssues: [],
          content: {
            format: 'article',
            canonicalUrl: 'https://algo.illegalscreed.cn/en/docs/quick-sort/',
            variants: [{ locale: 'en', media: [] }],
          },
        },
      ],
    });
    const articleBody = manifest.channels.find((item) => item.channel === 'dev')?.content
      ?.variants[0]?.body;
    expect(articleBody).toContain('## What the visualization shows');
    expect(articleBody).toContain('## Try these inputs');
    expect(articleBody?.length).toBeGreaterThan(1_000);

    const payload = buildPublishCampaignPayload(devSmokeCampaign, {
      runtimeStates: {
        dev: {
          executionApproved: true,
          adapterReady: true,
          authorized: true,
          quotaAvailable: true,
        },
      },
      authorizedAt: '2026-07-15T12:00:00+09:00',
    });
    expect(payload).toMatchObject({
      campaignId: 'marketing-ops-t3d3-smoke-127',
      packages: [
        {
          channel: 'dev',
          format: 'article',
          canonicalUrl: 'https://algo.illegalscreed.cn/en/docs/quick-sort/',
          variants: [{ locale: 'en' }],
        },
      ],
    });
  });
});
