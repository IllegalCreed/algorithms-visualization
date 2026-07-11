export type MarketingFactIssueCode = 'STALE_SITE_FACT' | 'EPHEMERAL_TEST_FACT';

export const SITE_FACTS = Object.freeze({
  snapshotVersion: 1,
  lastVerified: '2026-07-11',
  origin: 'https://algo.illegalscreed.cn',
  siteName: '数据结构和算法可视化',
  categoryCount: 9,
  catalogEntryCount: 92,
  indexablePageCount: 125,
  chinesePageCount: 95,
  englishPageCount: 30,
  localizedPairCount: 30,
  englishAlgorithmCount: 27,
  analyticsMode: 'utm-only',
  sources: [
    'src/seo/site.ts',
    'src/i18n/catalog.ts',
    'src/views/Home/Main/hooks.ts',
    'src/analytics/utm.ts',
  ],
});

const EPHEMERAL_TEST_FACT_PATTERNS = [
  /\b\d[\d,]*\s+(?:tests?|test files?)\b/i,
  /\d[\d,]*\s*个?(?:测试文件|测试用例|用例)/,
];

const STALE_SITE_FACT_PATTERNS = [
  /\b(?:english\s+)?pilot\b[^.\n]*\b10\s+pages?\b/i,
  /\benglish\b[^.\n]*\b10\s+pages?\b/i,
  /\b105\s+(?:indexable\s+)?pages?\b/i,
  /(?:共|总计|全站)?\s*105\s*个?(?:可索引)?(?:页面|页)/,
];

const COUNTED_SITE_FACTS = [
  { pattern: /\b(\d+)\s+english\s+pages?\b/i, expected: SITE_FACTS.englishPageCount },
  {
    pattern: /\benglish\b[^.\n]{0,60}\b(\d+)\s+pages?\b/i,
    expected: SITE_FACTS.englishPageCount,
  },
  { pattern: /\b(\d+)\s+chinese\s+pages?\b/i, expected: SITE_FACTS.chinesePageCount },
  {
    pattern: /\b(\d+)\s+indexable\s+pages?\b/i,
    expected: SITE_FACTS.indexablePageCount,
  },
  {
    pattern: /(?:英文|英语)[^.。\n]{0,30}?(\d+)\s*(?:个)?页/,
    expected: SITE_FACTS.englishPageCount,
  },
  { pattern: /中文[^.。\n]{0,30}?(\d+)\s*(?:个)?页/, expected: SITE_FACTS.chinesePageCount },
  {
    pattern: /(?:全站|总计|共)[^.。\n]{0,20}?(\d+)\s*(?:个)?(?:可索引)?(?:页面|页)/,
    expected: SITE_FACTS.indexablePageCount,
  },
] as const;

export function validateMarketingFactClaims(text: string): MarketingFactIssueCode[] {
  const issues = new Set<MarketingFactIssueCode>();
  if (EPHEMERAL_TEST_FACT_PATTERNS.some((pattern) => pattern.test(text))) {
    issues.add('EPHEMERAL_TEST_FACT');
  }
  if (STALE_SITE_FACT_PATTERNS.some((pattern) => pattern.test(text))) {
    issues.add('STALE_SITE_FACT');
  }
  for (const fact of COUNTED_SITE_FACTS) {
    const match = fact.pattern.exec(text);
    if (match && Number(match[1]) !== fact.expected) issues.add('STALE_SITE_FACT');
  }
  return [...issues];
}
