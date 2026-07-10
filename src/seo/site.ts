import { useCategoryData } from '@/views/Home/Main/hooks';

export const SITE_ORIGIN = 'https://algo.illegalscreed.cn';
export const SITE_NAME = '数据结构和算法可视化';
export const OG_IMAGE_URL = `${SITE_ORIGIN}/og-cover.png`;
export const INDEX_ROBOTS = 'index,follow,max-image-preview:large';
export const NO_INDEX_ROBOTS = 'noindex,nofollow';

const DEFAULT_DESCRIPTION =
  '交互式数据结构与算法可视化：92 个算法逐步动画、四语言代码同步高亮、自定义输入、测验模式、复杂度速查与学习路径。';

export interface SeoPage {
  name: string;
  path: string;
  heading: string;
  title: string;
  description: string;
  canonical: string;
  category?: string;
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

function createIndexablePage(page: Omit<SeoPage, 'canonical' | 'indexable' | 'robots'>): SeoPage {
  return {
    ...page,
    canonical: canonicalFor(page.path),
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
  }),
  createIndexablePage({
    name: 'complexity',
    path: '/docs/complexity',
    heading: '算法复杂度速查',
    title: `算法复杂度速查 | ${SITE_NAME}`,
    description:
      '按九大类查找常见数据结构与算法的时间复杂度、空间复杂度和适用说明，并支持关键词与分类筛选。',
    category: '学习工具',
  }),
  createIndexablePage({
    name: 'paths',
    path: '/docs/paths',
    heading: '算法学习路径',
    title: `算法学习路径 | ${SITE_NAME}`,
    description: '提供新手入门、面试高频、图论专线与进阶专题四条算法学习路径，按前置关系逐站学习。',
    category: '学习工具',
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
    }),
  ),
);

const indexablePages = Object.freeze([...featurePages, ...catalogPages]);
const pagesByName = new Map(indexablePages.map((page) => [page.name, page] as const));

export function getIndexablePages(): readonly SeoPage[] {
  return indexablePages;
}

export function resolveSeoPage(routeName: unknown, routePath: string): SeoPage {
  const name = typeof routeName === 'string' ? routeName : String(routeName ?? 'unknown');
  const page = pagesByName.get(name);

  if (page) return page;

  const path = routePath.split(/[?#]/, 1)[0] || '/';
  return {
    name,
    path,
    heading: SITE_NAME,
    title: `未收录页面 | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    canonical: canonicalFor(path),
    indexable: false,
    robots: NO_INDEX_ROBOTS,
  };
}

function breadcrumbItems(page: SeoPage): Array<Record<string, unknown>> {
  const items: Array<Record<string, unknown>> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首页',
      item: `${SITE_ORIGIN}/`,
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

  if (page.name === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_ORIGIN}/#website`,
          name: SITE_NAME,
          url: `${SITE_ORIGIN}/`,
          description: page.description,
          inLanguage: 'zh-CN',
        },
        {
          '@type': 'SoftwareApplication',
          '@id': `${SITE_ORIGIN}/#application`,
          name: SITE_NAME,
          url: `${SITE_ORIGIN}/`,
          description: page.description,
          inLanguage: 'zh-CN',
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
        inLanguage: 'zh-CN',
        learningResourceType: 'Interactive visualization',
        educationalUse: 'Self study',
        isAccessibleForFree: true,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
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
