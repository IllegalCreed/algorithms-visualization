import { describe, expect, it } from 'vitest';
import router from '@/router';
import {
  ENGLISH_PILOT_PAGES,
  PILOT_PAGE_PAIRS,
  getLanguageSwitchRoute,
  getPilotPairByRouteName,
  siteLocaleFromPath,
} from './pilot';

describe('English pilot registry', () => {
  it('TC-I18N-REGISTRY-126-01: 十组页面与 7/2/1 类型边界唯一', () => {
    expect(PILOT_PAGE_PAIRS).toHaveLength(10);
    expect(ENGLISH_PILOT_PAGES).toHaveLength(10);
    expect(PILOT_PAGE_PAIRS.filter((page) => page.kind === 'algorithm')).toHaveLength(7);
    expect(PILOT_PAGE_PAIRS.filter((page) => page.kind === 'tool')).toHaveLength(2);
    expect(PILOT_PAGE_PAIRS.filter((page) => page.kind === 'home')).toHaveLength(1);

    for (const field of ['name', 'path'] as const) {
      expect(new Set(PILOT_PAGE_PAIRS.map((page) => page.zh[field])).size).toBe(10);
      expect(new Set(PILOT_PAGE_PAIRS.map((page) => page.en[field])).size).toBe(10);
    }

    const routeNames = new Set(router.getRoutes().map((route) => String(route.name ?? '')));
    for (const pair of PILOT_PAGE_PAIRS) {
      expect(routeNames.has(pair.zh.name), pair.zh.name).toBe(true);
      expect(routeNames.has(pair.en.name), pair.en.name).toBe(true);
      expect(pair.en.heading.length).toBeGreaterThan(2);
      expect(pair.en.description.length).toBeGreaterThan(40);
    }
  });

  it('TC-I18N-REGISTRY-126-02: 成对页面切换语言并保留安全 query', () => {
    const query = { input: '9,5,1' };

    expect(getLanguageSwitchRoute('quick-sort', 'en', query)).toEqual({
      name: 'en-quick-sort',
      query,
    });
    expect(getLanguageSwitchRoute('en-quick-sort', 'zh-CN', query)).toEqual({
      name: 'quick-sort',
      query,
    });
    expect(getPilotPairByRouteName('en-kmp')?.zh.name).toBe('kmp');
    expect(siteLocaleFromPath('/en')).toBe('en');
    expect(siteLocaleFromPath('/en/docs/kmp')).toBe('en');
    expect(siteLocaleFromPath('/docs/kmp')).toBe('zh-CN');
  });

  it('TC-I18N-REGISTRY-126-03: 未翻译与未知页面回退目标语言 Home', () => {
    expect(getLanguageSwitchRoute('array', 'en', { input: 'secret' })).toEqual({
      name: 'en-home',
    });
    expect(getLanguageSwitchRoute('unknown', 'zh-CN', { q: 'x' })).toEqual({ name: 'home' });
    expect(getPilotPairByRouteName('array')).toBeUndefined();
  });
});
