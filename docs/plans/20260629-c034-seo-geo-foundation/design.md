# 设计：SEO + GEO 可检索地基（预渲染管线 + 路由级 meta 注入）

> Status: superseded
> Stable ID: C-20260629-034
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Implementation: ./implementation.md
> Test cases: ./test-cases.md
> Related plan: C-20260710-124（由 C-20260710-123 编排）

> 历史状态说明：本设计从未获批或实施，2026-07-10 已由 C-124 替代，仅供追溯。不得直接照此文件开发。

## 1. 架构概览

```
构建期（Node）                              运行期（浏览器）
─────────────                              ─────────────
vite build → dist/ (SPA 空壳)              用户访问 → 预渲染 HTML 首屏可见
   │                                          │  Vue mount('#app') 接管
   ▼                                          ▼  SPA 照常交互（动画等）
scripts/prerender.ts                       爬虫访问 → 直接读预渲染 HTML
   │  起 vite preview 指向 dist/              （title/正文/JSON-LD 齐全）
   │  Playwright chromium 逐路由访问
   │  抓 outerHTML → dist/<route>/index.html
   ▼
scripts/gen-seo.ts → dist/sitemap.xml + dist/llms.txt
   │
   └─ cp 404.html dist/（保留）

运行期 meta 注入（每个页面，含预渲染时）：
  App.vue → useSeoHead() ── 监听 route.name ──▶ @unhead/vue 注入
      └─ 数据源：src/seo/routes.ts（SEO_ROUTES）+ src/seo/pageMeta.ts（PAGE_META / SITE）
```

**单一事实源**：`src/seo/routes.ts` 的 `SEO_ROUTES` 同时喂给——① 运行期 meta 注入、② 预渲染脚本、③ sitemap 生成、④ llms 生成。一份测试守护它与 `router/index.ts` 同步。

## 2. 路由事实源与元数据 `src/seo/routes.ts` + `pageMeta.ts`

```ts
// src/seo/routes.ts —— 纯数据，不 import 任何 vue 组件（node 端可直接用）
export interface SeoRoute {
  path: string; // 不含 base，如 '/docs/array'、'/'
  name: string; // 与 router name 一致
}
export const SEO_ROUTES: SeoRoute[] = [
  { path: '/', name: 'home' },
  { path: '/docs/array', name: 'array' },
  // …全部数据结构（array/link/stack/queue/tree/heap/hash/graph/trie/union-find/lru/skip-list）
  // …全部排序（bubble/selection/insertion/shell/merge/quick/heap/counting -sort）
  { path: '/about', name: 'about' },
];
```

```ts
// src/seo/pageMeta.ts
export const SITE = {
  name: '算法可视化',
  origin: 'https://algo.illegalscreed.cn', // canonical 主站
  defaultDescription:
    '交互式数据结构与算法可视化：排序、树、图、哈希、堆…逐步动画演示，看得见的算法。',
  defaultOgImage: 'https://algo.illegalscreed.cn/og-default.png', // E1 可先用统一图
  author: 'IllegalCreed',
} as const;

export interface PageSeo {
  title: string; // 完整 <title>
  description: string; // 该页一句话概述（≤120 字）
  keywords?: string;
}
export const PAGE_META: Record<string, PageSeo> = {
  home: {
    title: '算法可视化 | 交互式数据结构与算法动画',
    description:
      '把排序、树、图、哈希、堆等数据结构与算法做成可交互的逐步动画，面试与考研复习看得见的算法。',
  },
  array: {
    title: '数组可视化 | 算法可视化',
    description:
      '数组的随机访问 O(1)、中部插入/删除的元素搬移，动态扩容翻倍与均摊 O(1)，逐步动画演示。',
  },
  'bubble-sort': {
    title: '冒泡排序可视化 | 算法可视化',
    description: '冒泡排序逐步动画：相邻比较交换、每轮把最大值冒泡到末尾，含多语言代码与单步播放。',
  },
  // …其余页各一条（implementation 给全量草稿，正文质量在落地时定稿）
};
```

- `PAGE_META` 每个 key 必须覆盖 `SEO_ROUTES` 的每个 `name`（L3 守护）；缺失时注入回落 `SITE.defaultDescription`。
- 描述是 E1 的「一句话概述」，非逐页长内容（那是 E2）。

## 3. head/meta 注入 `useSeoHead.ts` + `App.vue` + `main.ts`

```ts
// src/main.ts（改）
import { createHead } from '@unhead/vue/client';
const head = createHead();
app.use(router);
app.use(pinia);
app.use(head);
app.mount('#app');
```

```ts
// src/seo/useSeoHead.ts（新增）
import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { SITE, PAGE_META } from './pageMeta';
import { buildJsonLd } from './jsonld';

export function useSeoHead() {
  const route = useRoute();
  const meta = computed(
    () =>
      PAGE_META[route.name as string] ?? {
        title: SITE.name,
        description: SITE.defaultDescription,
      },
  );
  const canonical = computed(() => SITE.origin + route.path);
  useHead({
    title: () => meta.value.title,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: () => meta.value.description },
      { property: 'og:title', content: () => meta.value.title },
      { property: 'og:description', content: () => meta.value.description },
      { property: 'og:url', content: canonical },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: SITE.defaultOgImage },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: () => buildJsonLd(route.name as string, route.path),
      },
    ],
    htmlAttrs: { lang: 'zh-CN' },
  });
}
```

```vue
<!-- src/App.vue（改）-->
<script setup lang="ts">
import { useSeoHead } from '@/seo/useSeoHead';
useSeoHead();
</script>
<template><RouterView /></template>
```

- `@unhead/vue` 是 Vue 3 head 管理标准（vue-router 生态广泛使用），响应式 getter 让 meta 随路由变化。
- 预渲染时 Playwright 加载页面 → 路由就位 → `useSeoHead` 注入 → `page.content()` 抓到的 HTML 已含正确 title/meta/JSON-LD。
- **实施前用 context7 核实 `@unhead/vue` 在当前大版本（配 Vue 3.5 / Vite 8）的导入路径与 API**（`createHead` 位置、SSR/client 入口），不凭记忆写死。

## 4. JSON-LD 结构化数据 `src/seo/jsonld.ts`

```ts
// 站点级 SoftwareApplication + 每页 LearningResource + BreadcrumbList
export function buildJsonLd(name: string, path: string): string {
  const url = SITE.origin + path;
  const graph = [
    {
      '@type': 'SoftwareApplication',
      name: SITE.name,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0' },
      url: SITE.origin,
    },
    {
      '@type': 'LearningResource',
      name: PAGE_META[name]?.title ?? SITE.name,
      description: PAGE_META[name]?.description ?? SITE.defaultDescription,
      url,
      inLanguage: 'zh-CN',
      learningResourceType: '交互式可视化',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        /* 首页 → docs → 当前页 */
      ],
    },
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}
```

- AI 引擎特别吃结构化数据；`@graph` 一次给全。
- 纯函数，L3 可断言（含 schema.org、各 @type、url 正确）。

## 5. SEO 静态/生成文件

### 5.1 `public/robots.txt`（静态）

```
User-agent: *
Allow: /

# 显式放行主流 AI 爬虫（GEO）
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Bytespider
Allow: /

Sitemap: https://algo.illegalscreed.cn/sitemap.xml
```

### 5.2 `sitemap.xml`（构建生成 → `dist/`）

纯函数 `src/seo/sitemap.ts` 的 `buildSitemapXml(SEO_ROUTES, SITE.origin)` 生成标准 `<urlset>`（每路由一条 `<url><loc>`）；`scripts/gen-seo.ts` 调用它并写 `dist/sitemap.xml`。

### 5.3 `llms.txt`（构建生成 → `dist/`）

纯函数 `src/seo/llms.ts` 的 `buildLlmsTxt(PAGE_META, SITE)` 从 `PAGE_META` 生成站点说明书（Markdown，[llms.txt 提案](https://llmstxt.org) 格式），`scripts/gen-seo.ts` 写 `dist/llms.txt`：

```
# 算法可视化

> 交互式数据结构与算法可视化学习工具，逐步动画演示排序/树/图/哈希/堆等。

## 数据结构
- [数组](https://algo.illegalscreed.cn/docs/array): 随机访问 O(1)…
- …

## 排序算法
- [冒泡排序](https://algo.illegalscreed.cn/docs/bubble-sort): …
```

## 6. 预渲染管线 `scripts/prerender.ts`

```ts
import { chromium } from 'playwright'; // 复用 @playwright/test 已带的 chromium
import { preview } from 'vite';
import { SEO_ROUTES } from '../src/seo/routes';
// base 来自 VITE_BASE_URL（production '/algorithms-visualization/'、selfhost '/'）

async function run() {
  const base = process.env.VITE_BASE_URL || '/';
  const server = await preview({ preview: { port: 4173 } });
  const browser = await chromium.launch();
  for (const { path } of SEO_ROUTES) {
    const page = await browser.newPage();
    const url = `http://localhost:4173${base.replace(/\/$/, '')}${path}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('#app *'); // 首屏内容信号（不等动画跑完）
    const html = await page.content();
    writeToDist(path, html); // '/' → dist/index.html；'/docs/array' → dist/docs/array/index.html
    await page.close();
  }
  await browser.close();
  await server.httpServer.close();
}
```

- **写回规则**：`/` → 覆盖 `dist/index.html`；`/docs/array` → 新建 `dist/docs/array/index.html`（GitHub Pages 子路径与自有域名都能直接命中）。路径映射由纯函数 `src/seo/distPath.ts` 的 `routeToDistPath` 提供（`writeToDist` 调用它）。
- **只取首屏静态内容**：等 `#app` 有内容即抓，不等 `setTimeout` 动画——预渲染是给爬虫看的静态语义层。
- **失败即非零退出**：任一路由渲染异常 → 退出码非 0，卡住 `build-only`（防止发布空壳）。

## 7. 文件清单与改动面

| 文件                    | 类型     | 改动                                                               |
| ----------------------- | -------- | ------------------------------------------------------------------ |
| `src/seo/routes.ts`     | **新增** | `SEO_ROUTES` 单一事实源（纯数据）                                  |
| `src/seo/pageMeta.ts`   | **新增** | `SITE` + `PAGE_META`（各页一句话概述）                             |
| `src/seo/jsonld.ts`     | **新增** | `buildJsonLd` 结构化数据（纯函数）                                 |
| `src/seo/sitemap.ts`    | **新增** | `buildSitemapXml(routes, origin)`（纯函数）                        |
| `src/seo/llms.ts`       | **新增** | `buildLlmsTxt(meta, site)`（纯函数）                               |
| `src/seo/distPath.ts`   | **新增** | `routeToDistPath(path)` 路由→dist 路径映射（纯函数）               |
| `src/seo/useSeoHead.ts` | **新增** | 路由级 head 注入 composable                                        |
| `scripts/prerender.ts`  | **新增** | Playwright chromium 构建后预渲染                                   |
| `scripts/gen-seo.ts`    | **新增** | 生成 `dist/sitemap.xml` + `dist/llms.txt`                          |
| `public/robots.txt`     | **新增** | 放行 AI 爬虫 + Sitemap 指向                                        |
| `src/main.ts`           | 改       | `createHead()` + `app.use(head)`                                   |
| `src/App.vue`           | 改       | 调 `useSeoHead()`                                                  |
| `index.html`            | 改       | `lang="zh-CN"` + 默认 description/OG fallback                      |
| `package.json`          | 改       | `+@unhead/vue`；`build-only` 接预渲染+gen-seo；`+prerender` script |

**零改动**：所有 `views/Article/**` 页面 / `components/{structures,player,article}/**` / `store` / `router/index.ts` 的路由定义。**nginx（selfhost）**：需 `try_files $uri $uri/ /index.html`（属 C-002 部署侧，implementation 标注，不在本仓库代码内）。

## 8. 向后兼容论证

- 预渲染是 `build` 后处理，**运行时 SPA 行为不变**（用户访问照常 mount + 交互）。
- `@unhead/vue` + 根级注入为**纯增量**，不触碰任何现有组件 props/逻辑。
- `src/seo/routes.ts` 是**新增旁路事实源**，不改 `router/index.ts` 路由定义；用 `TC-SEO-ROUTES-*` 守护两者同步。
- 既有测试零回归：现无任何 Case 断言 `document.title`/`<html lang>`；`TC-VIEW-HEADER-04` 断言的是页面内 `<h1>算法可视化`，与 `document.title` 无关。
- 新增 Case：`TC-SEO-ROUTES-*`/`TC-SEO-META-*`/`TC-GEO-*`/`TC-SEO-SITEMAP-*`/`TC-VIEW-SEO-01`/`TC-E2E-SEO-01`。

## 9. 测试策略（详见 test-cases.md）

- **L3**：`SEO_ROUTES` 与 `router` 同步（守护，防漏页）；`PAGE_META` 覆盖每个 name、title 唯一/非空、description 非空；`buildJsonLd` 含 schema.org + 三 @type + 正确 url；`gen-seo` 生成 sitemap URL 集 = 路由集、llms 含全部页；`robots.txt` 含 5 个 AI UA + Sitemap。
- **L4**：挂 `App` + router，切换路由后 `document.title` / `<meta description>` / JSON-LD script 随 `PAGE_META` 更新。
- **L5**：预渲染产物校验——构建后读 `dist/docs/array/index.html` 等，断言含算法标题正文文本、正确 `<title>`、`application/ld+json`、`<html lang="zh-CN">`（作为构建后 verify，CI 与本地 `build-only` 后执行）。

## 变更历史

- 2026-07-10：C-124 建立后转 superseded；当前设计见 `../20260710-c124-seo-geo-foundation/design.md`。
- 2026-07-10：标记为 deprecated，仅保留原始方案供 C124 重新评审时参考。
