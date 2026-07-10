# 测试用例：SEO + GEO 可检索地基（预渲染 + meta + 结构化数据）

> Status: deprecated
> Stable ID: C-20260629-034
> Owner: IllegalCreed
> Created: 2026-06-29
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md
> Related plan: C-20260710-123

> 历史状态说明：本文件中的 24 个 Case 只是不曾执行的草案，不得登记为 active 自动化。C124 将重新选择有效 Case ID 与覆盖范围。

## 概览

| 层级          | 文件                         | 编号区间                 | 数量 |
| ------------- | ---------------------------- | ------------------------ | ---- |
| L3 路由事实源 | `src/seo/routes.spec.ts`     | `TC-SEO-ROUTES-01..03`   | 3    |
| L3 元数据表   | `src/seo/pageMeta.spec.ts`   | `TC-SEO-META-01..04`     | 4    |
| L3 JSON-LD    | `src/seo/jsonld.spec.ts`     | `TC-GEO-JSONLD-01..04`   | 4    |
| L3 sitemap    | `src/seo/sitemap.spec.ts`    | `TC-SEO-SITEMAP-01..03`  | 3    |
| L3 llms       | `src/seo/llms.spec.ts`       | `TC-GEO-LLMS-01..02`     | 2    |
| L3 robots     | `src/seo/robots.spec.ts`     | `TC-GEO-ROBOTS-01..02`   | 2    |
| L3 dist 路径  | `src/seo/distPath.spec.ts`   | `TC-SEO-DISTPATH-01..02` | 2    |
| L4 head 注入  | `src/seo/useSeoHead.spec.ts` | `TC-VIEW-SEO-01..03`     | 3    |
| L5 预渲染产物 | `e2e/seo-prerender.e2e.ts`   | `TC-E2E-SEO-01`          | 1    |

**合计计划新增 24 个 Case。** 命名空间 `SEO`/`GEO` 干净（全新前缀，无现存冲突）。

**回归（不新增、必须仍绿）**：既有全部结构页与排序页 + 播放器 + 骨架全部现有 Case —— 无任何 Case 断言 `document.title`/`<html lang>`（`TC-VIEW-HEADER-04` 断言页面内 `<h1>` 文本，与之无关），由全门禁证明零回归。

## L3 — 路由事实源（`TC-SEO-ROUTES-*`）

| TC               | 描述                                                                   | 预期   |
| ---------------- | ---------------------------------------------------------------------- | ------ |
| TC-SEO-ROUTES-01 | `SEO_ROUTES` 的 name 集合 == router 全部页面路由 name 集合（守护漏页） | 相等   |
| TC-SEO-ROUTES-02 | `SEO_ROUTES` 所有 path 唯一                                            | 无重复 |
| TC-SEO-ROUTES-03 | `SEO_ROUTES` 所有 name 唯一、均非空                                    | 通过   |

## L3 — 元数据表（`TC-SEO-META-*`）

| TC             | 描述                                                     | 预期   |
| -------------- | -------------------------------------------------------- | ------ |
| TC-SEO-META-01 | `PAGE_META` 覆盖 `SEO_ROUTES` 每个 name                  | 全覆盖 |
| TC-SEO-META-02 | 每条 title 非空且全局唯一                                | 通过   |
| TC-SEO-META-03 | 每条 description 非空且 ≤120 字                          | 通过   |
| TC-SEO-META-04 | `SITE.origin` 为 https 主站域名、defaultDescription 非空 | 通过   |

## L3 — JSON-LD（`TC-GEO-JSONLD-*`）

| TC               | 描述                                                                | 预期     |
| ---------------- | ------------------------------------------------------------------- | -------- |
| TC-GEO-JSONLD-01 | `buildJsonLd` 输出为合法 JSON                                       | 可 parse |
| TC-GEO-JSONLD-02 | 含 `@context = https://schema.org`                                  | 含       |
| TC-GEO-JSONLD-03 | `@graph` 含 SoftwareApplication / LearningResource / BreadcrumbList | 三者齐   |
| TC-GEO-JSONLD-04 | LearningResource.url == SITE.origin + path                          | 相等     |

## L3 — sitemap / llms / robots / distPath

| TC                 | 描述                                                                                                | 预期 |
| ------------------ | --------------------------------------------------------------------------------------------------- | ---- |
| TC-SEO-SITEMAP-01  | `buildSitemapXml` 为合法 `<urlset>`                                                                 | 通过 |
| TC-SEO-SITEMAP-02  | `<loc>` 数 == `SEO_ROUTES` 数，均为 origin 绝对 URL                                                 | 相等 |
| TC-SEO-SITEMAP-03  | 含首页与某算法页的 loc                                                                              | 含   |
| TC-GEO-LLMS-01     | `buildLlmsTxt` 含站名标题与简介                                                                     | 含   |
| TC-GEO-LLMS-02     | 含全部 `PAGE_META` 页的链接                                                                         | 全含 |
| TC-GEO-ROBOTS-01   | `public/robots.txt` 含 5 个 AI UA 放行（GPTBot/ClaudeBot/PerplexityBot/Google-Extended/Bytespider） | 全含 |
| TC-GEO-ROBOTS-02   | 含 `Sitemap:` 指向主站 sitemap.xml                                                                  | 含   |
| TC-SEO-DISTPATH-01 | `routeToDistPath('/')` == `index.html`                                                              | 相等 |
| TC-SEO-DISTPATH-02 | `routeToDistPath('/docs/array')` == `docs/array/index.html`                                         | 相等 |

## L4 — head 注入（`TC-VIEW-SEO-*`）

| TC             | 描述                                                                               | 预期 |
| -------------- | ---------------------------------------------------------------------------------- | ---- |
| TC-VIEW-SEO-01 | mount App + 路由到 array，`document.title` == PAGE_META.array.title                | 相等 |
| TC-VIEW-SEO-02 | `<meta name=description>` content == array 描述；存在 `application/ld+json` script | 通过 |
| TC-VIEW-SEO-03 | 切路由到 bubble-sort，title/description 随之更新                                   | 更新 |

## L5 — 预渲染产物（`TC-E2E-SEO-01`）

| TC            | 描述                                                                                                                               | 预期       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| TC-E2E-SEO-01 | 构建后 `dist/docs/array/index.html` 等：① 非空壳含算法标题正文 ② `<title>` 正确 ③ 含 `application/ld+json` ④ `<html lang="zh-CN">` | 各断言通过 |

## 覆盖率

本地门槛：lines/functions/statements ≥70%、branches ≥60%（聚合）。`src/seo/` 纯逻辑（routes/pageMeta/jsonld/sitemap/llms/distPath）L3 全覆盖；`useSeoHead` 注入由 L4 覆盖；`scripts/prerender.ts`、`scripts/gen-seo.ts` 为构建期 IO 脚本（依赖 Playwright/vite preview/fs），**不纳入 vitest 覆盖统计**，其行为由 L5 产物校验（`TC-E2E-SEO-01`）与 `build-only` 实跑兜底——在覆盖率配置中排除 `scripts/**`。

## 变更历史

- 2026-07-10：标记为 deprecated；计划用例未实现、未运行，保留供后续重新设计时追溯。
- 2026-06-29：创建（draft）。规划 24 个新 Case（L3 20 + L4 3 + L5 1），命名空间 `SEO`/`GEO`。纯逻辑全落 `src/seo/` 便于单测，构建脚本由 L5 产物校验兜底。待四文档评审通过后进 TDD。
