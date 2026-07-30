/// <reference types="node" />

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import packageSource from '../../package.json?raw';
import rollbackRequirements from '../../docs/plans/20260710-c129-analytics-rollback/requirements.md?raw';
import mainSource from '../main.ts?raw';
import searchSource from '../components/SearchPalette.vue?raw';
import playerSource from '../components/player/AlgorithmPlayer.vue?raw';
import footerSource from '../views/Home/Footer/Footer.vue?raw';
import iconLinkSource from '../views/Master/Header/IconLink/IconLink.vue?raw';
import { buildCampaignUrl } from './utm';

const productionEnv = readFileSync(resolve(process.cwd(), '.env.production'), 'utf8');
const selfhostEnv = readFileSync(resolve(process.cwd(), '.env.selfhost'), 'utf8');
const developmentEnv = readFileSync(resolve(process.cwd(), '.env.development'), 'utf8');

describe('minimal analytics boundaries', () => {
  it('TC-ANL-GA4-135-09 production/selfhost 使用同一公开 ID，开发环境无 ID', () => {
    const readId = (source: string) => source.match(/^VITE_GA_MEASUREMENT_ID=(G-[A-Z0-9]+)$/m)?.[1];

    expect(readId(productionEnv)).toMatch(/^G-[A-Z0-9]+$/);
    expect(readId(selfhostEnv)).toBe(readId(productionEnv));
    expect(readId(developmentEnv)).toBeUndefined();
    expect(mainSource.indexOf("app.mount('#app')")).toBeLessThan(
      mainSource.indexOf('router.isReady().then'),
    );
    expect(mainSource.match(/await nextTick\(\)/g)).toHaveLength(2);
  });

  it('TC-ANL-GA4-135-10 核心交互组件不导入分析或发送自定义事件', () => {
    const interactionSource = [searchSource, playerSource, footerSource, iconLinkSource].join('\n');
    expect(interactionSource).not.toMatch(/googleAnalytics|trackEvent|gtag|page_view/);
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

  it('TC-DOC-ANL-135-01 C129 明确由 C135 替代', () => {
    expect(rollbackRequirements).toContain('Status: superseded');
    expect(rollbackRequirements).toContain('Replaced by: C-20260730-135');
  });
});
