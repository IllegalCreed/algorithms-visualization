import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAnalyticsClient, type AnalyticsRuntime, type UmamiTracker } from './client';
import type { AnalyticsConfig } from './types';

class MemoryStorage implements Storage {
  private readonly data = new Map<string, string>();
  get length(): number {
    return this.data.size;
  }
  clear(): void {
    this.data.clear();
  }
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

const umamiConfig: AnalyticsConfig = {
  provider: 'umami',
  deployment: 'selfhost',
  scriptUrl: 'https://stats.example.com/script.js',
  websiteId: '123e4567-e89b-12d3-a456-426614174000',
};

function createRuntime(href = 'https://algo.illegalscreed.cn/utm-test') {
  let umami: UmamiTracker | undefined;
  const storage = new MemoryStorage();
  const location = new URL(href);
  const runtime: AnalyticsRuntime = {
    document,
    location: { href, hostname: location.hostname },
    referrer: '',
    storage,
    getUmami: () => umami,
  };
  return {
    runtime,
    storage,
    setUmami(value: UmamiTracker): void {
      umami = value;
    },
  };
}

describe('analytics client', () => {
  beforeEach(() => {
    document.querySelector('#analytics-umami-script')?.remove();
    document.title = '算法可视化测试';
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (window as typeof window & { umami?: UmamiTracker }).umami;
    document.querySelector('#analytics-umami-script')?.remove();
  });

  it('TC-ANL-CLIENT-125-01 none 或配置缺失时不插 script、不读写归因', async () => {
    const { runtime, storage } = createRuntime();
    const getItem = vi.spyOn(storage, 'getItem');
    const setItem = vi.spyOn(storage, 'setItem');
    const none = createAnalyticsClient({ provider: 'none', deployment: 'development' }, runtime);

    expect(none.initialize()).toBe(false);
    none.track('search', { action: 'no_result', query_length: 3, result_count: 0 });
    expect(document.querySelector('#analytics-umami-script')).toBeNull();
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();

    const incomplete = createAnalyticsClient(
      {
        provider: 'umami',
        deployment: 'selfhost',
        scriptUrl: '',
        websiteId: '',
      },
      runtime,
    );
    expect(incomplete.initialize()).toBe(false);
    expect(document.querySelector('#analytics-umami-script')).toBeNull();

    vi.stubEnv('VITE_ANALYTICS_PROVIDER', 'none');
    vi.resetModules();
    const browserClient = await import('./client');
    expect(browserClient.initializeAnalytics()).toBe(false);
    expect(() =>
      browserClient.trackEvent('search', {
        action: 'no_result',
        query_length: 1,
        result_count: 0,
      }),
    ).not.toThrow();
  });

  it('TC-ANL-CLIENT-125-02 完整配置只插一次手动追踪 script', async () => {
    const { runtime } = createRuntime();
    const client = createAnalyticsClient(umamiConfig, runtime);

    expect(client.initialize()).toBe(true);
    expect(client.initialize()).toBe(true);
    const scripts = document.querySelectorAll<HTMLScriptElement>('#analytics-umami-script');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe('https://stats.example.com/script.js');
    expect(scripts[0].defer).toBe(true);
    expect(scripts[0].dataset.websiteId).toBe(umamiConfig.websiteId);
    expect(scripts[0].dataset.autoTrack).toBe('false');
    expect(scripts[0].dataset.doNotTrack).toBe('true');
    expect(scripts[0].dataset.domains).toBe('algo.illegalscreed.cn,illegalcreed.github.io');

    scripts[0].remove();
    vi.stubEnv('VITE_ANALYTICS_PROVIDER', 'umami');
    vi.stubEnv('VITE_UMAMI_SCRIPT_URL', 'https://stats.example.com/browser.js');
    vi.stubEnv('VITE_UMAMI_WEBSITE_ID', '123e4567-e89b-12d3-a456-426614174000');
    vi.resetModules();
    const browserClient = await import('./client');
    const browserTrack = vi.fn();
    (window as typeof window & { umami?: UmamiTracker }).umami = { track: browserTrack };

    expect(browserClient.initializeAnalytics()).toBe(true);
    const browserScript = document.querySelector<HTMLScriptElement>('#analytics-umami-script');
    expect(browserScript?.src).toBe('https://stats.example.com/browser.js');
    browserScript?.dispatchEvent(new Event('load'));
    browserClient.trackEvent('play', {
      algorithm: 'quick-sort',
      trigger: 'control',
      step_index: 0,
    });
    expect(browserTrack).toHaveBeenCalledOnce();
  });

  it('TC-ANL-CLIENT-125-03 load 前 FIFO 最多 50 条，load 后按顺序 flush', () => {
    const { runtime, setUmami } = createRuntime();
    const track = vi.fn();
    const client = createAnalyticsClient(umamiConfig, runtime);
    client.initialize();

    document.title = '入队时标题';
    for (let i = 0; i < 55; i += 1) {
      client.track('search', { action: 'no_result', query_length: i, result_count: 0 });
    }
    document.title = '脚本加载后的标题';
    setUmami({ track });
    document
      .querySelector<HTMLScriptElement>('#analytics-umami-script')
      ?.dispatchEvent(new Event('load'));

    expect(track).toHaveBeenCalledTimes(50);
    const first = track.mock.calls[0][0]({ url: '/unsafe?input=private', referrer: '' });
    const last = track.mock.calls[49][0]({ url: '/unsafe?input=private', referrer: '' });
    expect(first.name).toBe('search');
    expect(first.title).toBe('入队时标题');
    expect(first.data.query_length).toBe(5);
    expect(last.data.query_length).toBe(54);
    expect(JSON.stringify(first)).not.toContain('input=private');
  });

  it('TC-ANL-CLIENT-125-04 script error 或 tracker 抛错时静默失败', () => {
    const first = createRuntime();
    const client = createAnalyticsClient(umamiConfig, first.runtime);
    client.initialize();
    document
      .querySelector<HTMLScriptElement>('#analytics-umami-script')
      ?.dispatchEvent(new Event('error'));
    expect(() =>
      client.track('search', { action: 'no_result', query_length: 2, result_count: 0 }),
    ).not.toThrow();

    document.querySelector('#analytics-umami-script')?.remove();
    const second = createRuntime();
    const brokenTrack = vi.fn(() => {
      throw new Error('tracker failed');
    });
    const secondClient = createAnalyticsClient(umamiConfig, second.runtime);
    secondClient.initialize();
    second.setUmami({ track: brokenTrack });
    document
      .querySelector<HTMLScriptElement>('#analytics-umami-script')
      ?.dispatchEvent(new Event('load'));
    expect(() =>
      secondClient.track('play', { algorithm: 'quick-sort', trigger: 'control', step_index: 0 }),
    ).not.toThrow();
    expect(brokenTrack).toHaveBeenCalledOnce();
  });

  it('TC-ANL-CLIENT-125-05 只发送白名单属性，page path 去自由 query/hash', () => {
    const { runtime, setUmami } = createRuntime(
      'https://algo.illegalscreed.cn/docs/quick-sort?input=9,5,1&utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort#player',
    );
    const track = vi.fn();
    const client = createAnalyticsClient(umamiConfig, runtime);
    client.initialize();
    setUmami({ track });
    document
      .querySelector<HTMLScriptElement>('#analytics-umami-script')
      ?.dispatchEvent(new Event('load'));

    client.track('search', {
      action: 'select',
      query_length: 4,
      result_count: 1,
      selected_slug: 'quick-sort',
      query: '用户自由文本',
      unknown: { nested: true },
    } as never);
    const customEventBuilder = track.mock.calls.at(-1)?.[0];
    expect(customEventBuilder).toBeTypeOf('function');
    const customEvent = customEventBuilder({
      url: '/docs/quick-sort?input=private',
      referrer: 'https://ref.example/private?email=person@example.com',
      title: 'old',
    });
    expect(customEvent.name).toBe('search');
    expect(customEvent.url).toBe(
      '/docs/quick-sort?utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort',
    );
    expect(customEvent.referrer).toBe('');
    expect(customEvent.data).toEqual({
      action: 'select',
      query_length: 4,
      result_count: 1,
      selected_slug: 'quick-sort',
      deployment: 'selfhost',
    });
    expect(JSON.stringify(customEvent)).not.toContain('input=private');
    expect(JSON.stringify(customEvent)).not.toContain('person@example.com');

    client.track('page_view', {
      path: '/docs/quick-sort?input=9,5,1#player',
      page_name: 'quick-sort',
      page_type: 'algorithm',
    });
    const pageViewBuilder = track.mock.calls.at(-1)?.[0];
    expect(pageViewBuilder).toBeTypeOf('function');
    const pageView = pageViewBuilder({
      hostname: 'algo.illegalscreed.cn',
      language: 'zh-CN',
      referrer: 'https://ref.example/private/path?email=person@example.com',
      screen: '1280x720',
      title: 'old',
      url: '/old?secret=1',
      website: umamiConfig.websiteId,
    });
    expect(pageView.url).toBe(
      '/docs/quick-sort?utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort',
    );
    expect(pageView.title).toBe(document.title);
    expect(pageView.referrer).toBe('');
    expect(JSON.stringify(pageView)).not.toContain('9,5,1');
    expect(JSON.stringify(pageView)).not.toContain('person@example.com');

    document.querySelector('#analytics-umami-script')?.remove();
    const referral = createRuntime('https://algo.illegalscreed.cn/docs/kmp');
    referral.runtime.referrer = 'https://news.ycombinator.com/item?id=private';
    const referralTrack = vi.fn();
    const referralClient = createAnalyticsClient(umamiConfig, referral.runtime);
    referralClient.initialize();
    referral.setUmami({ track: referralTrack });
    document
      .querySelector<HTMLScriptElement>('#analytics-umami-script')
      ?.dispatchEvent(new Event('load'));
    referralClient.track('page_view', {
      path: '/docs/kmp',
      page_name: 'kmp',
      page_type: 'algorithm',
    });
    const referralBuilder = referralTrack.mock.calls.at(-1)?.[0];
    const referralPageView = referralBuilder({ referrer: referral.runtime.referrer });
    expect(referralPageView.referrer).toBe('https://news.ycombinator.com/');
    expect(JSON.stringify(referralPageView)).not.toContain('id=private');

    document.querySelector('#analytics-umami-script')?.remove();
    const pages = createRuntime(
      'https://illegalcreed.github.io/algorithms-visualization/docs/kmp?input=private',
    );
    const pagesTrack = vi.fn();
    const pagesClient = createAnalyticsClient(
      { ...umamiConfig, deployment: 'pages' },
      pages.runtime,
    );
    pagesClient.initialize();
    pages.setUmami({ track: pagesTrack });
    document
      .querySelector<HTMLScriptElement>('#analytics-umami-script')
      ?.dispatchEvent(new Event('load'));
    pagesClient.track('play', { algorithm: 'kmp', trigger: 'control', step_index: 0 });
    const pagesBuilder = pagesTrack.mock.calls.at(-1)?.[0];
    const pagesEvent = pagesBuilder({ url: '/unsafe?input=private' });
    expect(pagesEvent.url).toBe('/docs/kmp');
    expect(pagesEvent.data.deployment).toBe('pages');

    pages.runtime.location.href = 'not a URL';
    pagesClient.track('play', { algorithm: 'kmp', trigger: 'control', step_index: 1 });
    expect(pagesTrack).toHaveBeenCalledOnce();
  });
});
