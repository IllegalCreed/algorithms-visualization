import { describe, expect, it } from 'vitest';
import { buildDryRunManifest, parseDryRunOptions } from './dry-run';
import { makeCampaignSpec, READY_RUNTIME_STATE } from './test-fixtures';

describe('marketing dry-run', () => {
  it('TC-AUTO-DRYRUN-127-01 manifest 确定且显式声明零副作用', () => {
    const runtimeStates = {
      github: READY_RUNTIME_STATE,
      weibo: READY_RUNTIME_STATE,
      bluesky: READY_RUNTIME_STATE,
      dev: READY_RUNTIME_STATE,
      mastodon: READY_RUNTIME_STATE,
    };

    const first = buildDryRunManifest(makeCampaignSpec(), { runtimeStates });
    const second = buildDryRunManifest(makeCampaignSpec(), { runtimeStates });

    expect(first).toEqual(second);
    expect(first).toMatchObject({ schemaVersion: 1, mode: 'dry-run', sideEffects: [] });
    expect(first.summary.selectedChannels).toEqual([
      'github',
      'weibo',
      'bluesky',
      'dev',
      'mastodon',
    ]);
  });

  it('TC-AUTO-DRYRUN-127-02 manifest 分离 selected、blocked 与 manual', () => {
    const spec = makeCampaignSpec();
    spec.channels = ['github', 'v2ex', 'x', 'dev'];
    const manifest = buildDryRunManifest(spec, {
      runtimeStates: {
        github: READY_RUNTIME_STATE,
        dev: { ...READY_RUNTIME_STATE, adapterReady: false },
      },
    });

    expect(manifest.summary).toMatchObject({
      selectedChannels: ['github'],
      blockedChannels: ['dev', 'x'],
      manualChannels: ['v2ex'],
    });
    expect(manifest.channels.find((item) => item.channel === 'github')).toMatchObject({
      selected: true,
      decision: { allowed: true, reasons: [] },
    });
    expect(manifest.channels.find((item) => item.channel === 'v2ex')?.content?.format).toBe(
      'manual-package',
    );
    expect(manifest.channels.find((item) => item.channel === 'x')).toMatchObject({
      selected: false,
      content: null,
    });
    expect(manifest.channels.find((item) => item.channel === 'dev')?.decision.reasons).toContain(
      'ADAPTER_UNAVAILABLE',
    );
  });

  it('TC-AUTO-DRYRUN-127-03 schema、runtime 与 CLI 均拒绝 secret/任意执行输入', () => {
    expect(() => buildDryRunManifest({ ...makeCampaignSpec(), token: 'secret-value' })).toThrow(
      /token/i,
    );
    expect(() =>
      buildDryRunManifest(makeCampaignSpec(), {
        runtimeStates: {
          github: { ...READY_RUNTIME_STATE, Cookie: 'secret-value' },
        },
      }),
    ).toThrow(/cookie/i);

    for (const option of ['--token', '--script', '--selector', '--profile']) {
      expect(() => parseDryRunOptions([option, 'unsafe'])).toThrow(/unknown option/i);
    }

    const manifestText = JSON.stringify(
      buildDryRunManifest(makeCampaignSpec(), {
        runtimeStates: { github: READY_RUNTIME_STATE },
      }),
    );
    expect(manifestText).not.toMatch(/secret-value|cookie|selector|profile|password/i);
  });
});
