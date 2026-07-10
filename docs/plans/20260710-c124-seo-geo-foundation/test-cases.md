# 测试用例：SEO/GEO 技术地基重建

> Status: verified
> Stable ID: C-20260710-124
> Owner: IllegalCreed
> Created: 2026-07-10
> Last reviewed: 2026-07-10
> Requirements: ./requirements.md
> Design: ./design.md
> Implementation: ./implementation.md

## 用例总览

| 层级  | Case ID 区间                  | 数量 | 自动化位置                            |
| ----- | ----------------------------- | ---- | ------------------------------------- |
| L3    | `TC-SEO-PAGES-124-01..03`     | 3    | `src/seo/site.spec.ts`                |
| L3    | `TC-GEO-JSONLD-124-01..03`    | 3    | `src/seo/site.spec.ts`                |
| L4    | `TC-SEO-HEAD-124-01..03`      | 3    | `src/seo/useRouteSeo.spec.ts`         |
| cfg   | `TC-SEO-ROBOTS-124-01`        | 1    | `src/seo/site.spec.ts`                |
| build | `TC-SEO-PRERENDER-124-01..05` | 5    | `scripts/verify-seo.mjs` + 两套 build |
| L5    | `TC-E2E-SEO-124-01..03`       | 3    | `e2e/seo.e2e.ts`                      |
| docs  | `TC-DOC-SEO-124-01`           | 1    | plan/index 历史关系检查               |
| 合计  |                               | 19   |                                       |

## L3 页面与 JSON-LD

| Case ID              | 场景                          | 预期                                                                        |
| -------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| TC-SEO-PAGES-124-01  | page registry 生成            | 95 页；name/path/title/canonical 唯一；description 非空                     |
| TC-SEO-PAGES-124-02  | 与 router/Home catalog 对齐   | registry names = router 排除 docs/about 后 names；内容页正好 92             |
| TC-SEO-PAGES-124-03  | canonical 与 noindex fallback | canonical 指向主站尾斜杠静态入口；query 不参与；docs/about fallback noindex |
| TC-GEO-JSONLD-124-01 | 首页 JSON-LD                  | `@graph` 含 WebSite + SoftwareApplication，URL/语言/描述正确                |
| TC-GEO-JSONLD-124-02 | 内容页 JSON-LD                | 含 LearningResource + BreadcrumbList，末级 URL 与 canonical 一致            |
| TC-GEO-JSONLD-124-03 | 结构化数据边界                | 不含 FAQPage/Review/AggregateRating，字段来自 page registry                 |

## L4 路由级 head

| Case ID            | 场景                    | 预期                                                                |
| ------------------ | ----------------------- | ------------------------------------------------------------------- |
| TC-SEO-HEAD-124-01 | 首次进入 quick-sort     | lang/title/description/canonical/OG/Twitter/robots/JSON-LD 全部正确 |
| TC-SEO-HEAD-124-02 | quick-sort -> dijkstra  | 标签原地更新，每种 selector 仍只有一个节点，`data-seo-ready` 更新   |
| TC-SEO-HEAD-124-03 | 进入 docs/about/unknown | robots 为 noindex,nofollow，不进入 indexable registry               |

## 配置与 crawler 策略

| Case ID              | 场景                     | 预期                                                                    |
| -------------------- | ------------------------ | ----------------------------------------------------------------------- |
| TC-SEO-ROBOTS-124-01 | 读取 `public/robots.txt` | OAI-SearchBot Allow、GPTBot Disallow、通用 Allow、主站 Sitemap 同时存在 |

## 构建产物

| Case ID                 | 场景                | 预期                                                                                 |
| ----------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| TC-SEO-PRERENDER-124-01 | manifest 与静态入口 | manifest 95 条；每个 canonical 形态 URL 命中对应 HTML；内容页有 article h1/正文      |
| TC-SEO-PRERENDER-124-02 | route head/JSON-LD  | 逐页 lang/title/description/canonical/robots/OG/JSON-LD 与 manifest 一致，title 唯一 |
| TC-SEO-PRERENDER-124-03 | sitemap/llms        | sitemap URL 集合等于 95 canonical；llms 包含全部 URL                                 |
| TC-SEO-PRERENDER-124-04 | production mode     | 所有本地 script/style/modulepreload URL 使用 `/algorithms-visualization/` base       |
| TC-SEO-PRERENDER-124-05 | selfhost mode       | 所有本地 script/style/modulepreload URL 使用 `/`，不含 Pages base                    |

## L5 浏览器回归

| Case ID           | 场景                      | 预期                                          |
| ----------------- | ------------------------- | --------------------------------------------- |
| TC-E2E-SEO-124-01 | 直接访问首页与 quick-sort | root/深链 head、lang、canonical、JSON-LD 正确 |
| TC-E2E-SEO-124-02 | RouterLink/编程导航切页   | title/canonical/JSON-LD 更新且无重复标签      |
| TC-E2E-SEO-124-03 | `quick-sort?input=9,5,1`  | 自定义输入仍生效，canonical 不含 query        |

## 文档历史

| Case ID           | 场景                         | 预期                                                                               |
| ----------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| TC-DOC-SEO-124-01 | C034/C123/C124 与 plan index | C034 superseded by C124；C123 Case 04 obsolete 并由本 Case 替代；当前入口指向 C124 |

## TDD 记录

| 阶段                | 红测                                   | 绿测                                            | 结果   |
| ------------------- | -------------------------------------- | ----------------------------------------------- | ------ |
| T1 registry/JSON-LD | `./site` 不存在                        | `site.spec.ts` 7/7                              | passed |
| T2 route head       | `./useRouteSeo` 不存在                 | `useRouteSeo.spec.ts` 3/3                       | passed |
| T3/T4 artifact      | 旧 dist 缺少 `seo-manifest.json`       | production/selfhost 各 95 页 verifier 通过      | passed |
| T5 L5               | 新增用例前无 route head/canonical 覆盖 | 全量 110/110；尾斜杠调整后 SEO/quality 定向 4/4 | passed |

## 变更历史

- 2026-07-10：创建 19 个 Case，进入 T1 红测。
- 2026-07-10：19 个 Case 本地通过；静态托管审计补充尾斜杠 canonical、article 正文和逐 URL HTTP 命中断言，待线上双轨验证后转 verified。
- 2026-07-10：Pages/selfhost 线上静态响应与 deployment SHA 通过，19 个 Case 保持全绿，状态转 verified。
