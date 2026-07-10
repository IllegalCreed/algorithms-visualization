import { useCategoryData } from '@/views/Home/Main/hooks';
import {
  ENGLISH_PILOT_PAGES,
  ENGLISH_SITE_NAME,
  PILOT_PAGE_PAIRS,
  siteLocaleFromPath,
  type SiteLocale,
} from '@/i18n/pilot';

export const SITE_ORIGIN = 'https://algo.illegalscreed.cn';
export const SITE_NAME = '数据结构和算法可视化';
export const OG_IMAGE_URL = `${SITE_ORIGIN}/og-cover.png`;
export const INDEX_ROBOTS = 'index,follow,max-image-preview:large';
export const NO_INDEX_ROBOTS = 'noindex,nofollow';

const DEFAULT_DESCRIPTION =
  '交互式数据结构与算法可视化：92 个算法逐步动画、四语言代码同步高亮、自定义输入、测验模式、复杂度速查与学习路径。';

const ENGLISH_DEFAULT_DESCRIPTION =
  'Interactive algorithm visualizations with step-by-step playback, synchronized code, complexity references, and guided learning paths.';

export interface SeoAlternate {
  hreflang: 'zh-CN' | 'en' | 'x-default';
  href: string;
}

export interface SeoPage {
  name: string;
  path: string;
  heading: string;
  title: string;
  description: string;
  canonical: string;
  category?: string;
  locale: SiteLocale;
  alternates: SeoAlternate[];
  indexable: boolean;
  robots: typeof INDEX_ROBOTS | typeof NO_INDEX_ROBOTS;
}

export interface JsonLdDocument {
  '@context': 'https://schema.org';
  '@graph': Array<Record<string, unknown>>;
}

function canonicalFor(path: string): string {
  const canonicalPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  return new URL(canonicalPath, `${SITE_ORIGIN}/`).toString();
}

function createIndexablePage(
  page: Omit<SeoPage, 'canonical' | 'alternates' | 'indexable' | 'robots'>,
): SeoPage {
  return {
    ...page,
    canonical: canonicalFor(page.path),
    alternates: [],
    indexable: true,
    robots: INDEX_ROBOTS,
  };
}

const featurePages: SeoPage[] = [
  createIndexablePage({
    name: 'home',
    path: '/',
    heading: SITE_NAME,
    title: `${SITE_NAME} | 92 个交互式学习条目`,
    description: DEFAULT_DESCRIPTION,
    locale: 'zh-CN',
  }),
  createIndexablePage({
    name: 'complexity',
    path: '/docs/complexity',
    heading: '算法复杂度速查',
    title: `算法复杂度速查 | ${SITE_NAME}`,
    description:
      '按九大类查找常见数据结构与算法的时间复杂度、空间复杂度和适用说明，并支持关键词与分类筛选。',
    category: '学习工具',
    locale: 'zh-CN',
  }),
  createIndexablePage({
    name: 'paths',
    path: '/docs/paths',
    heading: '算法学习路径',
    title: `算法学习路径 | ${SITE_NAME}`,
    description: '提供新手入门、面试高频、图论专线与进阶专题四条算法学习路径，按前置关系逐站学习。',
    category: '学习工具',
    locale: 'zh-CN',
  }),
];

const catalogPages: SeoPage[] = useCategoryData().flatMap((category) =>
  category.children.map((item) =>
    createIndexablePage({
      name: item.url,
      path: `/docs/${item.url}`,
      heading: item.title,
      title: `${item.title}可视化 | ${SITE_NAME}`,
      description: item.desc,
      category: category.title,
      locale: 'zh-CN',
    }),
  ),
);

const englishPages = ENGLISH_PILOT_PAGES.map((page) =>
  createIndexablePage({
    name: page.name,
    path: page.path,
    heading: page.heading,
    title: page.title,
    description: page.description,
    category: page.category,
    locale: 'en',
  }),
);

const pagePairByName = new Map(
  PILOT_PAGE_PAIRS.flatMap((pair) => [
    [pair.zh.name, pair] as const,
    [pair.en.name, pair] as const,
  ]),
);

const indexablePages = Object.freeze(
  [...featurePages, ...catalogPages, ...englishPages].map((page) => {
    const pair = pagePairByName.get(page.name);
    if (!pair) return page;

    const zhCanonical = canonicalFor(pair.zh.path);
    const enCanonical = canonicalFor(pair.en.path);
    return {
      ...page,
      alternates: [
        { hreflang: 'zh-CN', href: zhCanonical },
        { hreflang: 'en', href: enCanonical },
        { hreflang: 'x-default', href: zhCanonical },
      ],
    } satisfies SeoPage;
  }),
);
const pagesByName = new Map(indexablePages.map((page) => [page.name, page] as const));

export function getIndexablePages(): readonly SeoPage[] {
  return indexablePages;
}

export function resolveSeoPage(routeName: unknown, routePath: string): SeoPage {
  const name = typeof routeName === 'string' ? routeName : String(routeName ?? 'unknown');
  const page = pagesByName.get(name);

  if (page) return page;

  const path = routePath.split(/[?#]/, 1)[0] || '/';
  const locale = siteLocaleFromPath(path);
  const siteName = locale === 'en' ? ENGLISH_SITE_NAME : SITE_NAME;
  return {
    name,
    path,
    heading: siteName,
    title: locale === 'en' ? `Unlisted Page | ${siteName}` : `未收录页面 | ${siteName}`,
    description: locale === 'en' ? ENGLISH_DEFAULT_DESCRIPTION : DEFAULT_DESCRIPTION,
    canonical: canonicalFor(path),
    locale,
    alternates: [],
    indexable: false,
    robots: NO_INDEX_ROBOTS,
  };
}

function breadcrumbItems(page: SeoPage): Array<Record<string, unknown>> {
  const english = page.locale === 'en';
  const items: Array<Record<string, unknown>> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: english ? 'Home' : '首页',
      item: english ? `${SITE_ORIGIN}/en/` : `${SITE_ORIGIN}/`,
    },
  ];

  if (page.category) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: page.category,
    });
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: page.heading,
    item: page.canonical,
  });

  return items;
}

export function buildJsonLd(page: SeoPage): JsonLdDocument {
  if (!page.indexable) {
    return { '@context': 'https://schema.org', '@graph': [] };
  }

  const english = page.locale === 'en';
  const siteName = english ? ENGLISH_SITE_NAME : SITE_NAME;
  const websiteUrl = english ? `${SITE_ORIGIN}/en/` : `${SITE_ORIGIN}/`;
  const websiteId = `${websiteUrl}#website`;

  if (page.name === 'home' || page.name === 'en-home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': websiteId,
          name: siteName,
          url: websiteUrl,
          description: page.description,
          inLanguage: page.locale,
        },
        {
          '@type': 'SoftwareApplication',
          '@id': `${websiteUrl}#application`,
          name: siteName,
          url: websiteUrl,
          description: page.description,
          inLanguage: page.locale,
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web',
          isAccessibleForFree: true,
        },
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${page.canonical}#learning-resource`,
        name: page.heading,
        description: page.description,
        url: page.canonical,
        inLanguage: page.locale,
        learningResourceType: 'Interactive visualization',
        educationalUse: 'Self study',
        isAccessibleForFree: true,
        isPartOf: { '@id': websiteId, name: siteName, url: websiteUrl },
        ...(page.category ? { about: page.category } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${page.canonical}#breadcrumb`,
        itemListElement: breadcrumbItems(page),
      },
    ],
  };
}
