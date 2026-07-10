import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { buildJsonLd, OG_IMAGE_URL, resolveSeoPage, SITE_NAME, type SeoPage } from './site';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  const matches = [...document.head.querySelectorAll<HTMLMetaElement>(selector)];
  const element = matches.shift() ?? document.createElement('meta');

  element.setAttribute(attribute, key);
  element.content = content;
  if (!element.isConnected) document.head.append(element);
  for (const duplicate of matches) duplicate.remove();
}

function upsertCanonical(canonical: string): void {
  const matches = [...document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')];
  const element = matches.shift() ?? document.createElement('link');

  element.rel = 'canonical';
  element.href = canonical;
  if (!element.isConnected) document.head.append(element);
  for (const duplicate of matches) duplicate.remove();
}

function upsertJsonLd(page: SeoPage): void {
  const matches = [
    ...document.head.querySelectorAll<HTMLScriptElement>(
      'script#seo-json-ld[type="application/ld+json"]',
    ),
  ];
  const element = matches.shift() ?? document.createElement('script');

  element.id = 'seo-json-ld';
  element.type = 'application/ld+json';
  element.textContent = JSON.stringify(buildJsonLd(page));
  if (!element.isConnected) document.head.append(element);
  for (const duplicate of matches) duplicate.remove();
}

export function applyPageSeo(page: SeoPage): void {
  document.documentElement.lang = 'zh-CN';
  document.title = page.title;

  upsertMeta('name', 'description', page.description);
  upsertMeta('name', 'robots', page.robots);
  upsertMeta('property', 'og:type', page.name === 'home' ? 'website' : 'article');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', 'zh_CN');
  upsertMeta('property', 'og:title', page.title);
  upsertMeta('property', 'og:description', page.description);
  upsertMeta('property', 'og:url', page.canonical);
  upsertMeta('property', 'og:image', OG_IMAGE_URL);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', page.title);
  upsertMeta('name', 'twitter:description', page.description);
  upsertMeta('name', 'twitter:image', OG_IMAGE_URL);
  upsertCanonical(page.canonical);
  upsertJsonLd(page);

  document.documentElement.dataset.seoReady = page.name;
}

export function useRouteSeo(): void {
  const route = useRoute();

  watch(
    [() => route.name, () => route.path],
    ([name, path]) => applyPageSeo(resolveSeoPage(name, String(path))),
    { immediate: true },
  );
}
