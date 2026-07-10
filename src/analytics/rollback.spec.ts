/// <reference types="node" />

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import packageSource from '../../package.json?raw';
import playwrightSource from '../../playwright.config.ts?raw';
import appSource from '../App.vue?raw';
import searchSource from '../components/SearchPalette.vue?raw';
import playerSource from '../components/player/AlgorithmPlayer.vue?raw';
import footerSource from '../views/Home/Footer/Footer.vue?raw';
import iconLinkSource from '../views/Master/Header/IconLink/IconLink.vue?raw';
import { buildCampaignUrl } from './utm';

const productionEnv = readFileSync(resolve(process.cwd(), '.env.production'), 'utf8');
const selfhostEnv = readFileSync(resolve(process.cwd(), '.env.selfhost'), 'utf8');

describe('third-party analytics rollback', () => {
  it('TC-ANL-ROLLBACK-129-01 双环境不再配置第三方分析', () => {
    const envSource = `${productionEnv}\n${selfhostEnv}`;
    expect(envSource).not.toMatch(/VITE_(?:ANALYTICS|UMAMI)/);
    expect(envSource).not.toContain('cloud.umami.is');
  });

  it('TC-ANL-ROLLBACK-129-02 应用和交互源码不再加载或发送统计', () => {
    const runtimeSource = [
      appSource,
      searchSource,
      playerSource,
      footerSource,
      iconLinkSource,
      playwrightSource,
    ].join('\n');
    expect(runtimeSource).not.toMatch(/useRouteAnalytics|trackEvent|analytics\/client/);
    expect(runtimeSource).not.toMatch(/analytics\.e2e|VITE_UMAMI/);

    for (const path of [
      '.env.analytics.example',
      'e2e/analytics.e2e.ts',
      'public/privacy.html',
      'src/analytics/client.ts',
      'src/analytics/attribution.ts',
      'src/analytics/useRouteAnalytics.ts',
    ]) {
      expect(existsSync(resolve(process.cwd(), path)), path).toBe(false);
    }
  });

  it('TC-ANL-ROLLBACK-129-03 保留零成本 UTM 生成能力', () => {
    expect(packageSource).toContain('"marketing:link"');
    expect(
      buildCampaignUrl('https://algo.illegalscreed.cn/', {
        source: 'v2ex',
        medium: 'community',
        campaign: 'launch-2026q3',
        content: 'project-intro',
      }),
    ).toContain('utm_source=v2ex');
  });
});
