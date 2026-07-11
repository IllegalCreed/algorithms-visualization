import { describe, expect, it } from 'vitest';
import {
  AUTOMATIC_CHANNEL_IDS,
  CHANNEL_IDS,
  CHANNEL_REGISTRY,
  DISABLED_CHANNEL_IDS,
  MANUAL_BRIDGE_CHANNEL_IDS,
  evaluateChannelAction,
  resolveAuthorizedChannels,
} from './channels';
import { READY_RUNTIME_STATE } from './test-fixtures';

describe('marketing channel registry', () => {
  it('TC-AUTO-CHANNEL-127-01 注册表包含审计中的 15 个唯一渠道', () => {
    expect(CHANNEL_IDS).toEqual([
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
    ]);
    expect(new Set(CHANNEL_IDS).size).toBe(15);
    for (const channel of Object.values(CHANNEL_REGISTRY)) {
      expect(channel.evidence.length).toBeGreaterThan(0);
    }
  });

  it('TC-AUTO-CHANNEL-127-02 首批五渠道均为免费个人 API 路径', () => {
    expect(AUTOMATIC_CHANNEL_IDS).toEqual(['github', 'weibo', 'bluesky', 'dev', 'mastodon']);
    for (const id of AUTOMATIC_CHANNEL_IDS) {
      expect(CHANNEL_REGISTRY[id]).toMatchObject({
        tier: 'A',
        execution: 'api',
        publish: true,
        cost: 'free',
        personalAvailable: true,
        enabled: true,
      });
    }
  });

  it('TC-AUTO-CHANNEL-127-03 条件、人工桥接与硬禁用集合固定', () => {
    expect(CHANNEL_REGISTRY.reddit).toMatchObject({
      tier: 'B',
      execution: 'api',
      cost: 'conditional',
      enabled: false,
      status: 'conditional',
    });
    expect(MANUAL_BRIDGE_CHANNEL_IDS).toEqual(['v2ex', 'hacker-news', 'product-hunt']);
    expect(DISABLED_CHANNEL_IDS).toEqual([
      'juejin',
      'bilibili',
      'zhihu',
      'xiaohongshu',
      'wechat',
      'x',
    ]);
  });

  it('TC-AUTO-CHANNEL-127-04 任一 capability/runtime/cost/主体 gate 缺失都失败关闭', () => {
    expect(evaluateChannelAction('github', 'publish', READY_RUNTIME_STATE)).toEqual({
      allowed: true,
      reasons: [],
    });
    expect(evaluateChannelAction('dev', 'reply', READY_RUNTIME_STATE).reasons).toContain(
      'ACTION_UNSUPPORTED',
    );
    expect(
      evaluateChannelAction('github', 'publish', {
        ...READY_RUNTIME_STATE,
        executionApproved: false,
      }).reasons,
    ).toContain('EXECUTION_NOT_APPROVED');
    expect(
      evaluateChannelAction('github', 'publish', {
        ...READY_RUNTIME_STATE,
        adapterReady: false,
      }).reasons,
    ).toContain('ADAPTER_UNAVAILABLE');
    expect(
      evaluateChannelAction('github', 'publish', {
        ...READY_RUNTIME_STATE,
        authorized: false,
      }).reasons,
    ).toContain('AUTH_REQUIRED');
    expect(
      evaluateChannelAction('github', 'publish', {
        ...READY_RUNTIME_STATE,
        quotaAvailable: false,
      }).reasons,
    ).toContain('QUOTA_UNAVAILABLE');
    expect(evaluateChannelAction('v2ex', 'publish', READY_RUNTIME_STATE).reasons).toContain(
      'MANUAL_EXECUTION_REQUIRED',
    );
    expect(evaluateChannelAction('wechat', 'publish', READY_RUNTIME_STATE).reasons).toContain(
      'PERSONAL_SUBJECT_UNAVAILABLE',
    );
    expect(evaluateChannelAction('x', 'publish', READY_RUNTIME_STATE).reasons).toContain(
      'PAID_CHANNEL',
    );
  });

  it('TC-AUTO-CHANNEL-127-05 all-authorized 只展开全部 runtime gate 通过的渠道', () => {
    const result = resolveAuthorizedChannels('all-authorized', {
      github: READY_RUNTIME_STATE,
      weibo: { ...READY_RUNTIME_STATE, authorized: false },
      bluesky: READY_RUNTIME_STATE,
      dev: { ...READY_RUNTIME_STATE, adapterReady: false },
      mastodon: { ...READY_RUNTIME_STATE, quotaAvailable: false },
      x: READY_RUNTIME_STATE,
    });

    expect(result.selected).toEqual(['github', 'bluesky']);
    expect(result.decisions.weibo.reasons).toContain('AUTH_REQUIRED');
    expect(result.decisions.dev.reasons).toContain('ADAPTER_UNAVAILABLE');
    expect(result.decisions.mastodon.reasons).toContain('QUOTA_UNAVAILABLE');
    expect(result.decisions.x).toBeUndefined();
  });
});
