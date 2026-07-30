// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import { ANALYTICS_CONSENT_STORAGE_KEY, readAnalyticsConsent } from '@/analytics/consent';
import AnalyticsConsent from './AnalyticsConsent.vue';

async function mountFor(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/en', component: { template: '<div />' } },
    ],
  });
  await router.push(path);
  await router.isReady();

  return mount(AnalyticsConsent, {
    global: {
      plugins: [router],
    },
  });
}

describe('AnalyticsConsent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('TC-ANL-GA4-135-07: 中文首次提示可拒绝，英文首次提示可接受', async () => {
    const zh = await mountFor('/');
    expect(zh.get('[data-testid="analytics-consent-panel"]').text()).toContain('仅统计页面浏览');
    await zh.get('[data-choice="denied"]').trigger('click');
    expect(readAnalyticsConsent(localStorage)).toBe('denied');
    zh.unmount();

    localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
    const en = await mountFor('/en');
    expect(en.get('[data-testid="analytics-consent-panel"]').text()).toContain('page views only');
    await en.get('[data-choice="granted"]').trigger('click');
    expect(readAnalyticsConsent(localStorage)).toBe('granted');
  });

  it('TC-ANL-GA4-135-08: 已选择后可重新打开隐私设置并修改', async () => {
    localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'denied');
    const wrapper = await mountFor('/');

    expect(wrapper.find('[data-testid="analytics-consent-panel"]').exists()).toBe(false);
    await wrapper.get('[data-testid="analytics-preferences"]').trigger('click');
    await wrapper.get('[data-choice="granted"]').trigger('click');

    expect(readAnalyticsConsent(localStorage)).toBe('granted');
  });
});
