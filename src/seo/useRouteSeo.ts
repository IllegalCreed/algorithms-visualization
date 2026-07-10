import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { buildJsonLd, OG_IMAGE_URL, resolveSeoPage, SITE_NAME, type SeoPage } from './site';
import { ENGLISH_SITE_NAME } from '@/i18n/pilot';

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

function syncAlternates(page: SeoPage): void {
  for (const element of document.head.querySelectorAll('link[rel="alternate"][hreflang]')) {
    element.remove();
  }

  for (const alternate of page.alternates) {
    const element = document.createElement('link');
    element.rel = 'alternate';
    element.hreflang = alternate.hreflang;
    element.href = alternate.href;
    document.head.append(element);
  }
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
  const english = page.locale === 'en';
  const siteName = english ? ENGLISH_SITE_NAME : SITE_NAME;
  const isHome = page.name === 'home' || page.name === 'en-home';

  document.documentElement.lang = page.locale;
  document.title = page.title;

  upsertMeta('name', 'description', page.description);
  upsertMeta('name', 'robots', page.robots);
  upsertMeta('property', 'og:type', isHome ? 'website' : 'article');
  upsertMeta('property', 'og:site_name', siteName);
  upsertMeta('property', 'og:locale', english ? 'en_US' : 'zh_CN');
  upsertMeta('property', 'og:title', page.title);
  upsertMeta('property', 'og:description', page.description);
  upsertMeta('property', 'og:url', page.canonical);
  upsertMeta('property', 'og:image', OG_IMAGE_URL);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', page.title);
  upsertMeta('name', 'twitter:description', page.description);
  upsertMeta('name', 'twitter:image', OG_IMAGE_URL);
  upsertCanonical(page.canonical);
  syncAlternates(page);
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
