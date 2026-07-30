// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  getBrowserConsentStorage,
  readAnalyticsConsent,
  subscribeAnalyticsConsent,
  writeAnalyticsConsent,
} from './consent';

describe('analytics consent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('TC-ANL-GA4-135-06: 缺失、损坏或不可用存储一律失败关闭', () => {
    expect(readAnalyticsConsent(localStorage)).toBe('unset');

    localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, 'unexpected');
    expect(readAnalyticsConsent(localStorage)).toBe('unset');

    const brokenStorage = {
      getItem: vi.fn(() => {
        throw new Error('storage disabled');
      }),
      setItem: vi.fn(() => {
        throw new Error('storage disabled');
      }),
    };
    expect(readAnalyticsConsent(brokenStorage)).toBe('unset');
    expect(() => writeAnalyticsConsent('granted', brokenStorage, window)).not.toThrow();
  });

  it('TC-ANL-GA4-135-06: 只保存合法选择并广播同意变更', () => {
    const listener = vi.fn();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, listener);

    expect(getBrowserConsentStorage()).toBe(localStorage);
    expect(writeAnalyticsConsent('granted')).toBe(true);

    expect(readAnalyticsConsent(localStorage)).toBe('granted');
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toBe('granted');
  });

  it('TC-ANL-GA4-135-06: 订阅只接受合法 detail，且可安全销毁', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAnalyticsConsent(listener, window);

    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: 'denied' }));
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: 'unexpected' }));
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));

    expect(listener.mock.calls.map(([value]) => value)).toEqual(['denied', 'unset', 'unset']);

    unsubscribe();
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: 'granted' }));
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('TC-ANL-GA4-135-06: 无存储或事件分发失败时不抛错且失败关闭', () => {
    const throwingTarget = {
      dispatchEvent: vi.fn(() => {
        throw new Error('events disabled');
      }),
    } as unknown as EventTarget;

    expect(readAnalyticsConsent(null as unknown as undefined)).toBe('unset');
    expect(writeAnalyticsConsent('granted', null as unknown as undefined, window)).toBe(false);
    expect(writeAnalyticsConsent('denied', localStorage, throwingTarget)).toBe(true);
    const unsubscribe = subscribeAnalyticsConsent(vi.fn(), null as unknown as undefined);
    expect(unsubscribe).toBeTypeOf('function');
    expect(unsubscribe()).toBeUndefined();
  });

  it('TC-ANL-GA4-135-06: 浏览器拒绝访问 localStorage 时返回不可用', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });

    try {
      expect(getBrowserConsentStorage()).toBeUndefined();
    } finally {
      if (descriptor) Object.defineProperty(window, 'localStorage', descriptor);
    }
  });
});
