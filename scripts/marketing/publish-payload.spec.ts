import { describe, expect, it } from 'vitest';
import campaign from './example-campaign.json';
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
});
