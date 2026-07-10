import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { useRouteAnalytics } from './useRouteAnalytics';

const { initializeAnalytics, trackEvent } = vi.hoisted(() => ({
  initializeAnalytics: vi.fn(() => true),
  trackEvent: vi.fn(),
}));

vi.mock('./client', () => ({ initializeAnalytics, trackEvent }));

const Probe = defineComponent({
  setup() {
    useRouteAnalytics();
    return () => null;
  },
});

function createTestRouter() {
  const Empty = { template: '<div />' };
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Empty },
      { path: '/docs/complexity', name: 'complexity', component: Empty },
      { path: '/docs/:slug', name: 'algorithm', component: Empty },
      { path: '/about', name: 'about', component: Empty },
    ],
  });
}

async function mountAt(path: string) {
  const router = createTestRouter();
  await router.push(path);
  await router.isReady();
  const wrapper = mount(Probe, { global: { plugins: [router] } });
  await flushPromises();
  return { router, wrapper };
}

describe('useRouteAnalytics', () => {
  beforeEach(() => {
    initializeAnalytics.mockClear();
    initializeAnalytics.mockReturnValue(true);
    trackEvent.mockClear();
  });

  it('TC-ANL-ROUTE-125-01 首次内容页发送一次去 query 的 page_view', async () => {
    const { wrapper } = await mountAt('/docs/quick-sort?input=9,5,1&utm_source=v2ex');

    expect(initializeAnalytics).toHaveBeenCalledOnce();
    expect(trackEvent).toHaveBeenCalledOnce();
    expect(trackEvent).toHaveBeenCalledWith('page_view', {
      path: '/docs/quick-sort',
      page_name: 'algorithm',
      page_type: 'algorithm',
    });
    expect(JSON.stringify(trackEvent.mock.calls)).not.toContain('input');
    wrapper.unmount();
  });

  it('TC-ANL-ROUTE-125-02 SPA path 导航按顺序发送 page_view', async () => {
    const { router, wrapper } = await mountAt('/');
    await router.push('/docs/complexity');
    await flushPromises();
    await router.push('/docs/kmp');
    await flushPromises();

    expect(trackEvent.mock.calls).toEqual([
      ['page_view', { path: '/', page_name: 'home', page_type: 'home' }],
      ['page_view', { path: '/docs/complexity', page_name: 'complexity', page_type: 'guide' }],
      ['page_view', { path: '/docs/kmp', page_name: 'algorithm', page_type: 'algorithm' }],
    ]);
    wrapper.unmount();
  });

  it('TC-ANL-ROUTE-125-03 query/hash 变化不重复，同 route 重放不重复', async () => {
    const { router, wrapper } = await mountAt('/docs/kmp');
    await router.push('/docs/kmp?input=1,2,3');
    await flushPromises();
    await router.push('/docs/kmp?input=1,2,3#code');
    await flushPromises();
    await router.replace('/docs/kmp');
    await flushPromises();

    expect(trackEvent).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it('配置禁用时不建立 page view watcher', async () => {
    initializeAnalytics.mockReturnValue(false);
    const { router, wrapper } = await mountAt('/');
    await router.push('/about');
    await flushPromises();

    expect(trackEvent).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
