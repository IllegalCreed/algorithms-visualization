// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AnalyticsConsent } from './consent';
import { sanitizePageViewUrl, startGoogleAnalytics } from './googleAnalytics';

interface TestPage {
  path: string;
  title: string;
}

function createHarness(options?: {
  enabled?: boolean;
  measurementId?: string;
  consent?: AnalyticsConsent;
  page?: TestPage;
}) {
  let consent = options?.consent ?? 'unset';
  let page = options?.page ?? {
    path: '/docs/quick-sort?utm_source=DEV&input=9,5,1#player',
    title: '快速排序',
  };
  let consentListener: ((value: AnalyticsConsent) => void) | undefined;
  let pageListener: ((value: TestPage) => void) | undefined;

  const stop = startGoogleAnalytics({
    enabled: options?.enabled ?? true,
    measurementId: options?.measurementId ?? 'G-TEST12345',
    window,
    document,
    readConsent: () => consent,
    subscribeConsent: (listener) => {
      consentListener = listener;
      return () => {
        consentListener = undefined;
      };
    },
    readPage: () => page,
    subscribePage: (listener) => {
      pageListener = listener;
      return () => {
        pageListener = undefined;
      };
    },
  });

  return {
    stop,
    grant() {
      consent = 'granted';
      consentListener?.(consent);
    },
    deny() {
      consent = 'denied';
      consentListener?.(consent);
    },
    navigate(nextPage: TestPage) {
      page = nextPage;
      pageListener?.(page);
    },
  };
}

function dataLayerEvents(): unknown[][] {
  return ((window as unknown as { dataLayer?: Array<ArrayLike<unknown>> }).dataLayer ?? [])
    .map((entry) => Array.from(entry))
    .filter((entry) => entry[0] === 'event');
}

describe('minimal Google Analytics page views', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    delete (window as unknown as { dataLayer?: unknown[][] }).dataLayer;
    delete (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  });

  it('TC-ANL-GA4-135-01: 非生产或 Measurement ID 非法时零副作用', () => {
    const disabledHarness = createHarness({ enabled: false, consent: 'granted' });
    createHarness({ measurementId: 'invalid', consent: 'granted' });
    createHarness({ measurementId: '   ', consent: 'granted' });
    disabledHarness.stop();

    expect(document.querySelector('script[data-ga4-measurement-id]')).toBeNull();
    expect((window as unknown as { dataLayer?: unknown[][] }).dataLayer).toBeUndefined();
  });

  it('TC-ANL-GA4-135-02: unset/denied 不加载脚本且导航不发送', () => {
    const unsetHarness = createHarness();
    unsetHarness.navigate({ path: '/docs/dijkstra', title: 'Dijkstra' });
    unsetHarness.stop();

    const deniedHarness = createHarness({ consent: 'denied' });
    deniedHarness.navigate({ path: '/docs/kmp', title: 'KMP' });

    expect(document.querySelector('script[data-ga4-measurement-id]')).toBeNull();
    expect(dataLayerEvents()).toHaveLength(0);
  });

  it('TC-ANL-GA4-135-03: 同意后只加载一次并发送一次当前页', () => {
    const harness = createHarness();

    harness.grant();
    harness.grant();

    expect(document.querySelectorAll('script[data-ga4-measurement-id]')).toHaveLength(1);
    expect(dataLayerEvents()).toHaveLength(1);
    expect(dataLayerEvents()[0]?.[1]).toBe('page_view');
  });

  it('TC-ANL-GA4-135-03: 复用既有 script 与 gtag，不重复注入', () => {
    const script = document.createElement('script');
    script.dataset.ga4MeasurementId = 'G-TEST12345';
    document.head.append(script);
    const gtag = vi.fn();
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag = gtag;

    createHarness({ consent: 'granted' });

    expect(document.querySelectorAll('script[data-ga4-measurement-id]')).toHaveLength(1);
    expect(gtag).toHaveBeenCalledWith('config', 'G-TEST12345', {
      send_page_view: false,
      anonymize_ip: true,
    });
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({ page_path: '/docs/quick-sort' }),
    );
  });

  it('TC-ANL-GA4-136-01: 标签加载失败后可重试且不重复排队当前页', () => {
    const harness = createHarness();

    harness.grant();
    const failedScript = document.querySelector<HTMLScriptElement>(
      'script[data-ga4-measurement-id]',
    );
    failedScript?.dispatchEvent(new Event('error'));
    harness.grant();

    const retryScript = document.querySelector<HTMLScriptElement>(
      'script[data-ga4-measurement-id]',
    );
    expect(retryScript).not.toBe(failedScript);
    expect(document.querySelectorAll('script[data-ga4-measurement-id]')).toHaveLength(1);
    expect(dataLayerEvents()).toHaveLength(1);
  });

  it('TC-ANL-GA4-136-02: 内建 gtag 使用官方 arguments 命令形态', () => {
    createHarness({ consent: 'granted' });

    const commands = (window as unknown as { dataLayer?: Array<ArrayLike<unknown>> }).dataLayer;
    expect(commands).toBeDefined();
    expect(Array.isArray(commands?.[0])).toBe(false);
    expect(Array.from(commands?.[1] ?? []).slice(0, 2)).toEqual(['config', 'G-TEST12345']);
  });

  it('TC-ANL-GA4-135-04: 页面位置丢弃自由 query/hash，只保留合法 UTM', () => {
    expect(
      sanitizePageViewUrl(
        '/docs/quick-sort?utm_source=DEV&utm_medium=Community&utm_campaign=Launch-2026Q3&utm_content=Quick-Sort&input=9,5,1&query=秘密#player',
        'https://algo.illegalscreed.cn',
      ),
    ).toBe(
      'https://algo.illegalscreed.cn/docs/quick-sort?utm_source=dev&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort',
    );
  });

  it('TC-ANL-GA4-135-05: pathname 导航计页，同路径 query/hash 去重，撤回后停发', () => {
    const harness = createHarness({ consent: 'granted' });

    harness.navigate({ path: '/docs/quick-sort?input=1,2,3#code', title: '快速排序' });
    harness.navigate({ path: '/docs/dijkstra?input=private', title: 'Dijkstra' });
    harness.deny();
    harness.navigate({ path: '/docs/kmp', title: 'KMP' });

    expect(dataLayerEvents()).toHaveLength(2);
    expect(dataLayerEvents()[1]?.[2]).toMatchObject({
      page_path: '/docs/dijkstra',
      page_location: 'http://localhost:3000/docs/dijkstra',
    });
  });

  it('TC-ANL-GA4-135-05: 非法页面 URL 被隔离且不影响后续合法导航', () => {
    const harness = createHarness({
      consent: 'granted',
      page: { path: 'https://[invalid', title: 'invalid' },
    });

    harness.navigate({ path: '/docs/kmp', title: 'KMP' });

    expect(dataLayerEvents()).toHaveLength(1);
    expect(dataLayerEvents()[0]?.[2]).toMatchObject({ page_path: '/docs/kmp' });
  });
});
