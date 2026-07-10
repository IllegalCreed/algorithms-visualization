import { h, nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter, RouterView, type RouteRecordRaw } from 'vue-router';
import { resolveSeoPage } from './site';
import { useRouteSeo } from './useRouteSeo';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: { template: '<h1>首页</h1>' } },
  {
    path: '/docs/quick-sort',
    name: 'quick-sort',
    component: { template: '<h1>快速排序</h1>' },
  },
  {
    path: '/docs/dijkstra',
    name: 'dijkstra',
    component: { template: '<h1>Dijkstra 最短路</h1>' },
  },
  { path: '/docs', name: 'docs', component: { template: '<main />' } },
  { path: '/about', name: 'about', component: { template: '<main />' } },
];

function queryMeta(selector: string): HTMLMetaElement {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  expect(element, selector).not.toBeNull();
  return element!;
}

async function mountSeoAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes });
  await router.push(path);
  await router.isReady();

  const wrapper = mount(
    {
      setup() {
        useRouteSeo();
        return () => h(RouterView);
      },
    },
    { global: { plugins: [router] } },
  );
  await flushPromises();
  await nextTick();

  return { router, wrapper };
}

beforeEach(() => {
  document.head.innerHTML = '';
  document.documentElement.lang = '';
  delete document.documentElement.dataset.seoReady;
});

describe('useRouteSeo', () => {
  it('TC-SEO-HEAD-124-01: 首次进入 quick-sort 写入完整且唯一的页面 head', async () => {
    const { wrapper } = await mountSeoAt('/docs/quick-sort');
    const page = resolveSeoPage('quick-sort', '/docs/quick-sort');

    expect(document.documentElement.lang).toBe('zh-CN');
    expect(document.documentElement.dataset.seoReady).toBe('quick-sort');
    expect(document.title).toBe(page.title);
    expect(queryMeta('meta[name="description"]').content).toBe(page.description);
    expect(queryMeta('meta[name="robots"]').content).toBe(page.robots);
    expect(queryMeta('meta[property="og:title"]').content).toBe(page.title);
    expect(queryMeta('meta[property="og:url"]').content).toBe(page.canonical);
    expect(queryMeta('meta[name="twitter:title"]').content).toBe(page.title);
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      page.canonical,
    );

    const jsonLd = JSON.parse(
      document.head.querySelector<HTMLScriptElement>('#seo-json-ld')?.textContent ?? '',
    ) as { '@graph': Array<{ '@type': string }> };
    expect(jsonLd['@graph'].map((item) => item['@type'])).toEqual([
      'LearningResource',
      'BreadcrumbList',
    ]);

    wrapper.unmount();
  });

  it('TC-SEO-HEAD-124-02: SPA 切路由原地更新且不累计重复标签', async () => {
    const { router, wrapper } = await mountSeoAt('/docs/quick-sort');
    await router.push('/docs/dijkstra');
    await flushPromises();
    await nextTick();

    const page = resolveSeoPage('dijkstra', '/docs/dijkstra');
    expect(document.title).toBe(page.title);
    expect(document.documentElement.dataset.seoReady).toBe('dijkstra');
    expect(queryMeta('meta[property="og:url"]').content).toBe(page.canonical);

    for (const selector of [
      'meta[name="description"]',
      'meta[name="robots"]',
      'meta[property="og:title"]',
      'meta[property="og:url"]',
      'meta[name="twitter:title"]',
      'link[rel="canonical"]',
      'script#seo-json-ld',
    ]) {
      expect(document.head.querySelectorAll(selector), selector).toHaveLength(1);
    }

    wrapper.unmount();
  });

  it('TC-SEO-HEAD-124-03: docs/about 等非索引路由使用 noindex fallback', async () => {
    const { router, wrapper } = await mountSeoAt('/docs');
    expect(queryMeta('meta[name="robots"]').content).toBe('noindex,nofollow');
    expect(document.documentElement.dataset.seoReady).toBe('docs');

    await router.push('/about');
    await flushPromises();
    await nextTick();
    expect(queryMeta('meta[name="robots"]').content).toBe('noindex,nofollow');
    expect(document.documentElement.dataset.seoReady).toBe('about');

    wrapper.unmount();
  });
});
